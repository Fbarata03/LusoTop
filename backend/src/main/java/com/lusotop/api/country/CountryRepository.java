package com.lusotop.api.country;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CountryRepository extends JpaRepository<Country, Long> {

    Optional<Country> findByIsoCodeIgnoreCase(String isoCode);

    List<Country> findAllByOrderByStatusAscNameAsc();
}
