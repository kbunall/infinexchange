package com.infilasyon.infinexchangebackend.controller;

import com.infilasyon.infinexchangebackend.dto.response.PortfolioDetailsResponse;
import com.infilasyon.infinexchangebackend.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/portfolios")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping
    public ResponseEntity<List<PortfolioDetailsResponse>> getAll(@RequestParam(required = false) String taxNo,
                                                                @RequestParam(required = false) String tcNo,
                                                                @RequestParam(required = false) String corporationName,
                                                                @RequestParam(required = false) String firstName,
                                                                @RequestParam(required = false) String lastName,
                                                                @RequestParam(required = false) String currencyCode,
                                                                @RequestParam(required = false) BigDecimal amount) {
        return ResponseEntity.ok(portfolioService
                .getAll(taxNo, tcNo, corporationName, firstName, lastName, currencyCode, amount));
    }
}