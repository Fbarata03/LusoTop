package com.lusotop.api.product;

import com.lusotop.api.product.dto.ProductResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AirtimeProductController {

    private final AirtimeProductService productService;

    public AirtimeProductController(AirtimeProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/api/operators/{operatorId}/products")
    public List<ProductResponse> findByOperator(@PathVariable Long operatorId) {
        return productService.findByOperatorId(operatorId).stream()
                .map(ProductResponse::from)
                .toList();
    }
}
