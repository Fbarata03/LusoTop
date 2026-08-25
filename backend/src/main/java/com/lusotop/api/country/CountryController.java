package com.lusotop.api.country;

import com.lusotop.api.country.dto.CountryResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
public class CountryController {

    private final CountryService countryService;

    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    @GetMapping
    public List<CountryResponse> findAll() {
        return countryService.findAll().stream()
                .map(CountryResponse::from)
                .toList();
    }

    @GetMapping("/{isoCode}")
    public CountryResponse findByIsoCode(@PathVariable String isoCode) {
        return CountryResponse.from(countryService.findByIsoCode(isoCode));
    }
}
