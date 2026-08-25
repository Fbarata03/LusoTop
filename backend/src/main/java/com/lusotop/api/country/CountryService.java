package com.lusotop.api.country;

import com.lusotop.api.common.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CountryService {

    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    public List<Country> findAll() {
        return countryRepository.findAllByOrderByStatusAscNameAsc();
    }

    public Country findByIsoCode(String isoCode) {
        return countryRepository.findByIsoCodeIgnoreCase(isoCode)
                .orElseThrow(() -> new NotFoundException(
                        "COUNTRY_NOT_FOUND",
                        "País não encontrado: " + isoCode
                ));
    }
}
