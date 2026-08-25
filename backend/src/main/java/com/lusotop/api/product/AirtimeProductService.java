package com.lusotop.api.product;

import com.lusotop.api.operator.OperatorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirtimeProductService {

    private final AirtimeProductRepository productRepository;
    private final OperatorService operatorService;

    public AirtimeProductService(AirtimeProductRepository productRepository, OperatorService operatorService) {
        this.productRepository = productRepository;
        this.operatorService = operatorService;
    }

    public List<AirtimeProduct> findByOperatorId(Long operatorId) {
        operatorService.findById(operatorId);
        return productRepository.findAllByOperatorIdAndActiveTrueOrderByAmountAsc(operatorId);
    }
}
