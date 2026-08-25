package com.lusotop.api.currency;

import com.lusotop.api.currency.dto.RateResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/currency")
public class CurrencyController {

    private final ExchangeRateService exchangeRateService;

    public CurrencyController(ExchangeRateService exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
    }

    @GetMapping("/rate")
    public RateResponse rate(@RequestParam String from, @RequestParam String to) {
        return exchangeRateService.getRate(from, to)
                .map(rate -> new RateResponse(from.toUpperCase(), to.toUpperCase(), true, rate))
                .orElse(new RateResponse(from.toUpperCase(), to.toUpperCase(), false, null));
    }
}
