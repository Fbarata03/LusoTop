package com.lusotop.api.currency;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * Conversao entre as moedas dos 9 paises da CPLP e as moedas mais comuns de
 * quem paga (EUR/USD/BRL). Nunca inventa taxas:
 * - EUR/USD/BRL: taxas reais ao vivo via Frankfurter (dados do BCE, sem API key).
 * - XOF/XAF/CVE: paridades fixas oficiais (nao mudam, fixadas por tratado/acordo,
 *   nao sao uma estimativa).
 * - AOA/MZN/STN: sem fonte gratuita fiavel -> conversao fica indisponivel em vez
 *   de mostrar um numero inventado.
 */
@Service
public class ExchangeRateService {

    private static final Map<String, BigDecimal> EUR_PEGS = Map.of(
            "XOF", new BigDecimal("655.957"),
            "XAF", new BigDecimal("655.957"),
            "CVE", new BigDecimal("110.265")
    );

    private static final Set<String> LIVE_CURRENCIES = Set.of("USD", "BRL");
    private static final Duration CACHE_TTL = Duration.ofHours(1);

    private final RestClient restClient;
    private volatile Map<String, BigDecimal> liveRatesCache = Map.of();
    private volatile Instant cacheTimestamp = Instant.EPOCH;

    public ExchangeRateService(RestClient.Builder builder) {
        this.restClient = builder.baseUrl("https://api.frankfurter.app").build();
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
        if (LIVE_CURRENCIES.contains(currency)) {
            BigDecimal eurToCurrency = liveRates().get(currency);
            if (eurToCurrency == null) return Optional.empty();
            return Optional.of(BigDecimal.ONE.divide(eurToCurrency, 10, RoundingMode.HALF_UP));
        }
        return Optional.empty();
    }

    /** Quantas unidades da moeda dada vale 1 EUR. */
    private Optional<BigDecimal> fromEur(String currency) {
        if (currency.equals("EUR")) {
            return Optional.of(BigDecimal.ONE);
        }
        if (EUR_PEGS.containsKey(currency)) {
            return Optional.of(EUR_PEGS.get(currency));
        }
        if (LIVE_CURRENCIES.contains(currency)) {
            return Optional.ofNullable(liveRates().get(currency));
        }
        return Optional.empty();
    }

    private synchronized Map<String, BigDecimal> liveRates() {
        if (Duration.between(cacheTimestamp, Instant.now()).compareTo(CACHE_TTL) < 0
                && !liveRatesCache.isEmpty()) {
            return liveRatesCache;
        }
        try {
            FrankfurterResponse response = restClient.get()
                    .uri("/latest?from=EUR&to=USD,BRL")
                    .retrieve()
                    .body(FrankfurterResponse.class);
            if (response != null && response.rates() != null) {
                liveRatesCache = response.rates();
                cacheTimestamp = Instant.now();
            }
        } catch (Exception e) {
            // Mantem a cache anterior (ou vazia) em caso de falha de rede -- nunca inventa uma taxa.
        }
        return liveRatesCache;
    }

    private record FrankfurterResponse(String base, String date, Map<String, BigDecimal> rates) {
    }
}
