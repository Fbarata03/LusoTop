package com.lusotop.api.product;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AirtimeProductRepository extends JpaRepository<AirtimeProduct, Long> {

    List<AirtimeProduct> findAllByOperatorIdAndActiveTrueOrderByAmountAsc(Long operatorId);
}
