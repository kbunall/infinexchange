package com.infilasyon.infinexchangebackend.service;

import com.infilasyon.infinexchangebackend.dto.response.PortfolioDetailsResponse;
import com.infilasyon.infinexchangebackend.dto.response.PortfolioResponse;
import com.infilasyon.infinexchangebackend.entity.Portfolio;
import com.infilasyon.infinexchangebackend.entity.User;
import com.infilasyon.infinexchangebackend.entity.enums.Role;
import com.infilasyon.infinexchangebackend.exception.CustomerNotFoundException;
import com.infilasyon.infinexchangebackend.repository.CustomerRepository;
import com.infilasyon.infinexchangebackend.repository.PortfolioRepository;
import com.infilasyon.infinexchangebackend.repository.specifications.PortfolioSpecifications;
import com.infilasyon.infinexchangebackend.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final CustomerRepository customerRepository;
    private final SecurityUtils securityUtils;
    public List<PortfolioDetailsResponse> getAll(String taxNo, String tcNo, String corporationName, String firstName, String lastName, String currencyCode, BigDecimal amount) {
        User user = securityUtils.getAuthenticatedUser();
        Specification<Portfolio> spec = Specification.where(PortfolioSpecifications.hasTaxNo(taxNo))
                .and(PortfolioSpecifications.hasTcNo(tcNo))
                .and(PortfolioSpecifications.hasCorporationName(corporationName))
                .and(PortfolioSpecifications.hasFirstName(firstName))
                .and(PortfolioSpecifications.hasLastName(lastName))
                .and(PortfolioSpecifications.hasCurrencyCode(currencyCode))
                .and(PortfolioSpecifications.hasAmount(amount));

        List<Portfolio> portfolios;

        if (Role.ADMIN.equals(user.getRole())) {
            portfolios = portfolioRepository.findAll(spec);
        } else {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("customer").get("user").get("id"), user.getId()));
            portfolios = portfolioRepository.findAll(spec);
        }

        return portfolios.stream()
                .map(this::toPortfolioDetailsResponse)
                .collect(Collectors.toList());
    }
    public List<PortfolioResponse> getPortfolioByCustomerId(Integer id) {
        if (customerRepository.findById(id).isEmpty()) {
            throw new CustomerNotFoundException("Customer not found with the given id: " + id);
        }
        List<Portfolio> currencies = portfolioRepository.findByCustomerId(id);
        return currencies.stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }
    private PortfolioResponse entityToDto(Portfolio portfolio) {
        PortfolioResponse response = new PortfolioResponse();
        response.setCurrencyCode(portfolio.getCurrencyCode());
        response.setAmount(portfolio.getAmount());
        return response;
    }

    private PortfolioDetailsResponse toPortfolioDetailsResponse(Portfolio portfolio) {
        PortfolioDetailsResponse response = new PortfolioDetailsResponse();
        response.setAmount(portfolio.getAmount());
        response.setTaxNo(portfolio.getCustomer().getTaxNo());
        response.setTcNo(portfolio.getCustomer().getTcNo());
        response.setCorporationName(portfolio.getCustomer().getCorporationName());
        response.setFirsName(portfolio.getCustomer().getFirstName());
        response.setLastName(portfolio.getCustomer().getLastName());
        response.setCurrencyCode(portfolio.getCurrencyCode());
        return response;
    }
}
