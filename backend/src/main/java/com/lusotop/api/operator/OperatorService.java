package com.lusotop.api.operator;

import com.lusotop.api.common.NotFoundException;
import com.lusotop.api.country.Country;
import com.lusotop.api.country.CountryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OperatorService {

    private final OperatorRepository operatorRepository;
    private final CountryService countryService;

    public OperatorService(OperatorRepository operatorRepository, CountryService countryService) {
        this.operatorRepository = operatorRepository;
        this.countryService = countryService;
    }

    public List<Operator> findByCountryIsoCode(String isoCode) {
        Country country = countryService.findByIsoCode(isoCode);
        return operatorRepository.findAllByCountryIdAndActiveTrueOrderByNameAsc(country.getId());
    }

    public Operator findById(Long operatorId) {
        return operatorRepository.findById(operatorId)
                .orElseThrow(() -> new NotFoundException(
                        "OPERATOR_NOT_FOUND",
                        "Operadora não encontrada: " + operatorId
                ));
    }
}
