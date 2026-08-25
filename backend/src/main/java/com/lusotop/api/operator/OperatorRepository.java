package com.lusotop.api.operator;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OperatorRepository extends JpaRepository<Operator, Long> {

    List<Operator> findAllByCountryIdAndActiveTrueOrderByNameAsc(Long countryId);
}
