package com.lusotop.api.operator;

import com.lusotop.api.operator.dto.OperatorResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class OperatorController {

    private final OperatorService operatorService;

    public OperatorController(OperatorService operatorService) {
        this.operatorService = operatorService;
    }

    @GetMapping("/api/countries/{isoCode}/operators")
    public List<OperatorResponse> findByCountry(@PathVariable String isoCode) {
        return operatorService.findByCountryIsoCode(isoCode).stream()
                .map(OperatorResponse::from)
                .toList();
    }
}
