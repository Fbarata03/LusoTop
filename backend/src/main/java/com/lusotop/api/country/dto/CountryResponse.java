package com.lusotop.api.country.dto;

import com.lusotop.api.country.Country;
import com.lusotop.api.country.CountryStatus;

public record CountryResponse(
        Long id,
        String name,
        String isoCode,
        String phoneCode,
        String currencyCode,
        String currencySymbol,
        String flagEmoji,
        CountryStatus status
) {

    public static CountryResponse from(Country country) {
        return new CountryResponse(
                country.getId(),
                country.getName(),
                country.getIsoCode(),
                country.getPhoneCode(),
                country.getCurrencyCode(),
                country.getCurrencySymbol(),
                country.getFlagEmoji(),
                country.getStatus()
        );
    }
}
