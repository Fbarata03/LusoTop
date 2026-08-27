package com.lusotop.api.currency;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * Conversao entre as moedas dos paises da CPLP e o EUR (unica moeda de pagamento).
 * Nunca inventa taxas:
 * - EUR: identidade.
 * - XOF/XAF/CVE/STN: paridades fixas oficiais (fixadas por tratado/acordo com a
 *   zona euro, nao sao uma estimativa).
 * - BRL/AOA/MZN: taxas reais ao vivo (BRL via Frankfurter/BCE, AOA/MZN via
 *   exchangerate-api.com, que a Frankfurter nao cobre).
 */
@Service
public class ExchangeRateService {

    private static final Map<String, BigDecimal> EUR_PEGS = Map.of(
            "XOF", new BigDecimal("655.957"),
            "XAF", new BigDecimal("655.957"),
            "CVE", new BigDecimal("110.265"),
            "STN", new BigDecimal("24.5")
    );

    private static final Set<String> FRANKFURTER_CURRENCIES = Set.of("BRL");
    private static final Set<String> OPEN_ER_API_CURRENCIES = Set.of("AOA", "MZN");
    private static final Duration CACHE_TTL = Duration.ofHours(1);

    private final RestClient frankfurterClient;
    private final RestClient openErApiClient;
    private volatile Map<String, BigDecimal> liveRatesCache = Map.of();
    private volatile Instant cacheTimestamp = Instant.EPOCH;

    public ExchangeRateService() {
        this.frankfurterClient = RestClient.builder().baseUrl("https://api.frankfurter.dev/v1").build();
        this.openErApiClient = RestClient.builder().baseUrl("https://open.er-api.com/v6").build();
    }

    public Optional<BigDecimal> getRate(String fromRaw, String toRaw) {
        String from = fromRaw.toUpperCase();
        String to = toRaw.toUpperCase();

        if (from.equals(to)) {
            return Optional.of(BigDecimal.ONE);
        }

        Optional<BigDecimal> fromToEur = toEur(from);
        Optional<BigDecimal> eurToTarget = fromEur(to);

        if (fromToEur.isEmpty() || eurToTarget.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(fromToEur.get().multiply(eurToTarget.get()));
    }

    /** Quantos EUR vale 1 unidade da moeda dada. */
    private Optional<BigDecimal> toEur(String currency) {
        if (currency.equals("EUR")) {
            return Optional.of(BigDecimal.ONE);
        }
        if (EUR_PEGS.containsKey(currency)) {
            return Optional.of(BigDecimal.ONE.divide(EUR_PEGS.get(currency), 10, RoundingMode.HALF_UP));
        }
        BigDecimal eurToCurrency = liveRates().get(currency);
        if (eurToCurrency == null) return Optional.empty();
        return Optional.of(BigDecimal.ONE.divide(eurToCurrency, 10, RoundingMode.HALF_UP));
    }

    /** Quantas unidades da moeda dada vale 1 EUR. */
    private Optional<BigDecimal> fromEur(String currency) {
        if (currency.equals("EUR")) {
            return Optional.of(BigDecimal.ONE);
        }
        if (EUR_PEGS.containsKey(currency)) {
            return Optional.of(EUR_PEGS.get(currency));
        }
        return Optional.ofNullable(liveRates().get(currency));
    }

    private synchronized Map<String, BigDecimal> liveRates() {
        if (Duration.between(cacheTimestamp, Instant.now()).compareTo(CACHE_TTL) < 0
                && !liveRatesCache.isEmpty()) {
            return liveRatesCache;
        }

        Map<String, BigDecimal> merged = new HashMap<>(liveRatesCache);
        boolean updated = false;

        try {
            FrankfurterResponse response = frankfurterClient.get()
                    .uri("/latest?from=EUR&to=" + String.join(",", FRANKFURTER_CURRENCIES))
                    .retrieve()
                    .body(FrankfurterResponse.class);
            if (response != null && response.rates() != null) {
                merged.putAll(response.rates());
                updated = true;
            }
        } catch (Exception e) {
            // Mantem a taxa anterior desta fonte (ou indisponivel) em caso de falha -- nunca inventa.
        }

        try {
            OpenErApiResponse response = openErApiClient.get()
                    .uri("/latest/EUR")
                    .retrieve()
                    .body(OpenErApiResponse.class);
            if (response != null && "success".equals(response.result()) && response.rates() != null) {
                for (String currency : OPEN_ER_API_CURRENCIES) {
                    BigDecimal rate = response.rates().get(currency);
                    if (rate != null) {
                        merged.put(currency, rate);
                        updated = true;
                    }
                }
            }
        } catch (Exception e) {
            // Mantem a taxa anterior desta fonte (ou indisponivel) em caso de falha -- nunca inventa.
        }

        if (updated) {
            liveRatesCache = Map.copyOf(merged);
            cacheTimestamp = Instant.now();
        }
        return liveRatesCache;
    }

    private record FrankfurterResponse(String base, String date, Map<String, BigDecimal> rates) {
    }

    private record OpenErApiResponse(String result, Map<String, BigDecimal> rates) {
    }
}
