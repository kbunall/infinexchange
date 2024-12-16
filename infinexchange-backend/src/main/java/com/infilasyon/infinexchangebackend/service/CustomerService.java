package com.infilasyon.infinexchangebackend.service;

import com.infilasyon.infinexchangebackend.dto.request.CustomerRequest;
import com.infilasyon.infinexchangebackend.dto.request.CustomerUpdateRequest;
import com.infilasyon.infinexchangebackend.dto.response.*;
import com.infilasyon.infinexchangebackend.entity.*;
import com.infilasyon.infinexchangebackend.entity.enums.CustomerType;
import com.infilasyon.infinexchangebackend.entity.enums.Role;
import com.infilasyon.infinexchangebackend.exception.*;
import com.infilasyon.infinexchangebackend.repository.CustomerRepository;
import com.infilasyon.infinexchangebackend.repository.specifications.CustomerSpecifications;
import com.infilasyon.infinexchangebackend.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final SecurityUtils securityUtils;
    public CustomerResponse createCustomer(CustomerRequest customerRequest) {
        User authenticatedUser = securityUtils.getAuthenticatedUser();

        validateCustomerFields(customerRequest);
        checkUniqueFields(customerRequest);

        Customer customer = toEntity(customerRequest, authenticatedUser);
        Customer savedCustomer = customerRepository.save(customer);
        return toCustomerResponse(savedCustomer);
    }

    public List<CustomerResponse> getCustomersByUserRole() {
        User user = securityUtils.getAuthenticatedUser();
        Role role = user.getRole();
        Integer userId = user.getId();

        if (Role.ADMIN.equals(role)) {
            return getAllCustomers();
        } else {
            return getAllCustomersByUserId(userId);
        }
    }

    public CustomerProfileResponse getCustomerById(Integer id) {
        Customer customer = findCustomerById(id);
        checkAccess(customer);
        return toCustomerProfileResponse(customer);
    }

        public List<CustomerResponse> findCustomersByCriteria(String firstName, String lastName, String corporationName,
                                                    String type, String tcNo, String taxNo, Date dateOfBirth,
                                                    String phoneNumber, String address,
                                                    String email, BigDecimal balance, Date createdDate,
                                                    Integer userId, Integer id) {
        Specification<Customer> specification = Specification.where(null);
        User authenticatedUser = securityUtils.getAuthenticatedUser();

        if (firstName != null && !firstName.isEmpty()) {
            specification = specification.and(CustomerSpecifications.hasFirstName(firstName));
        }
        if (lastName != null && !lastName.isEmpty()) {
            specification = specification.and(CustomerSpecifications.hasLastName(lastName));
        }
        if (corporationName != null && !corporationName.isEmpty()) {
            specification = specification.and(CustomerSpecifications.hasCorporationName(corporationName));
        }
        if (type != null && !type.isEmpty()) {
            specification = specification.and(CustomerSpecifications.hasType(type));
        }
        if (tcNo != null && !tcNo.isEmpty()) {
            specification = specification.and(CustomerSpecifications.hasTcNo(tcNo));
        }
        if (taxNo != null && !taxNo.isEmpty()) {
            specification = specification.and(CustomerSpecifications.hasTaxNo(taxNo));
        }
        if (dateOfBirth != null) {
            specification = specification.and(CustomerSpecifications.hasDateOfBirth(dateOfBirth));
        }
        if (phoneNumber != null && !phoneNumber.isEmpty()) {
            specification = specification.and(CustomerSpecifications.hasPhoneNumber(phoneNumber));
        }

        if (address != null && !address.isEmpty()) {
            specification = specification.and(CustomerSpecifications.hasAddress(address));
        }
        if (email != null && !email.isEmpty()) {
            specification = specification.and(CustomerSpecifications.hasEmail(email));
        }
        if (balance != null) {
            specification = specification.and(CustomerSpecifications.hasBalance(balance));
        }
        if (createdDate != null) {
            specification = specification.and(CustomerSpecifications.hasCreatedDate(createdDate));
        }
        if (userId != null) {
            specification = specification.and(CustomerSpecifications.hasUserId(userId));
        }
        if (id != null) {
            specification = specification.and(CustomerSpecifications.hasId(id));
        }
        if (!Role.ADMIN.equals(authenticatedUser.getRole())) {
            specification = specification.and(CustomerSpecifications.hasUserId(authenticatedUser.getId()));
        }

        return customerRepository.findAll(specification)
                .stream()
                .map(this::toCustomerResponse).toList();
    }

    private void validateCustomerFields(CustomerRequest customerRequest) {
        if ("B".equals(customerRequest.getType())) {
            if (customerRequest.getTcNo() == null || customerRequest.getTcNo().length() != 11 || !isValidTCNumber(customerRequest.getTcNo())) {
                throw new InvalidTCNumberException("Bireysel müşteriler için geçerli bir TC Kimlik No gereklidir.");
            }
        } else if ("K".equals(customerRequest.getType())) {
            if (customerRequest.getTaxNo() == null || customerRequest.getTaxNo().length() != 10) {
                throw new InvalidTaxNumberException("Kurumsal müşteriler için geçerli bir Vergi No gereklidir.");
            }
            if (customerRequest.getCorporationName() == null || customerRequest.getCorporationName().isEmpty()) {
                throw new InvalidCorporationNameException("Kurumsal müşteriler için şirket adı gereklidir.");
            }
        }
    }

    private void checkUniqueFields(CustomerRequest customerRequest) {
        if (customerRepository.existsByCorporationName(customerRequest.getCorporationName()) && !customerRequest.getCorporationName().equals("")) {
            throw new CorporationNameAlreadyExistsException("Bu adle zaten bir Şirket var: " + customerRequest.getCorporationName());
        }
        if (customerRepository.existsByTcNo(customerRequest.getTcNo() ) && !customerRequest.getTcNo().equals("")) {
            throw new TCNoAlreadyExistsException("TC Numarası kayıtlı: " + customerRequest.getTcNo());
        }
        if (customerRepository.existsByTaxNo(customerRequest.getTaxNo()) && !customerRequest.getTaxNo().equals("")) {
            throw new TaxNoAlreadyExistsException("Vergi Numarası ile bir hesap var: " + customerRequest.getTaxNo());
        }
        if (customerRepository.existsByPhoneNumber(customerRequest.getPhoneNumber())) {
            throw new PhoneNumberAlreadyExistsException("Telefon Numarası Kayıtlı: " + customerRequest.getPhoneNumber());
        }
        if (customerRepository.existsByEmail(customerRequest.getEmail())) {
            throw new EmailAlreadyExistsException("E mail adresi kayıtlı: " + customerRequest.getEmail());
        }
    }
    public static boolean isValidTCNumber(String tcNumber) {
        if (tcNumber == null || tcNumber.length() != 11) {
            return false;
        }

        char[] digits = tcNumber.toCharArray();

        if (digits[0] == '0') {
            return false;
        }

        int[] numbers = new int[11];
        for (int i = 0; i < 11; i++) {
            numbers[i] = Character.getNumericValue(digits[i]);
        }

        int sumOdd = numbers[0] + numbers[2] + numbers[4] + numbers[6] + numbers[8];
        int sumEven = numbers[1] + numbers[3] + numbers[5] + numbers[7];

        int checksum10 = (7 * sumOdd - sumEven) % 10;
        int checksum11 = (sumOdd + sumEven + numbers[9]) % 10;

        return (checksum10 == numbers[9] && checksum11 == numbers[10]);
    }


    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::toCustomerResponse)
                .collect(Collectors.toList());
    }

    public List<CustomerResponse> getAllCustomersByUserId(Integer userId) {
        return customerRepository.findCustomersByUserId(userId).stream()
                .map(this::toCustomerResponse)
                .collect(Collectors.toList());
    }


    public CustomerResponse updateCustomer(Integer id, CustomerUpdateRequest customerUpdateRequest) {
        Customer customer = findCustomerById(id);
        checkAccess(customer);

        customer.setFirstName(customerUpdateRequest.getFirstName());
        customer.setLastName(customerUpdateRequest.getLastName());
        customer.setCorporationName(customerUpdateRequest.getCorporationName());
        customer.setType(CustomerType.valueOf(customerUpdateRequest.getType()));
        customer.setTcNo(customerUpdateRequest.getTcNo());
        customer.setAddress(customerUpdateRequest.getAddress());
        customer.setTaxNo(customerUpdateRequest.getTaxNo());
        customer.setDateOfBirth(customerUpdateRequest.getDateOfBirth());
        customer.setPhoneNumber(customerUpdateRequest.getPhoneNumber());
        customer.setEmail(customerUpdateRequest.getEmail());

        Customer updatedCustomer = customerRepository.save(customer);
        return toCustomerResponse(updatedCustomer);
    }

    public void deleteCustomer(Integer id) {
        Customer customer = findCustomerById(id);
        checkAccess(customer);
        customerRepository.deleteById(id);
    }

    private Customer findCustomerById(Integer id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with the given id: " + id));
    }
    private void checkAccess(Customer customer) {
        User authenticatedUser = securityUtils.getAuthenticatedUser();
        if (!(Role.ADMIN.equals(authenticatedUser.getRole())) && !customer.getUser().equals(authenticatedUser)) {
            throw new AccessDeniedException("You do not have the required permissions to access this resource.");
        }
    }
    private CustomerResponse toCustomerResponse(Customer customer) {

        CustomerResponse customerResponse = new CustomerResponse();
        customerResponse.setId(customer.getId());
        customerResponse.setFirstName(customer.getFirstName());
        customerResponse.setLastName(customer.getLastName());
        customerResponse.setCorporationName(customer.getCorporationName());
        customerResponse.setType(customer.getType());
        customerResponse.setTcNo(customer.getTcNo());
        customerResponse.setAddress(customer.getAddress());
        customerResponse.setTaxNo(customer.getTaxNo());
        customerResponse.setDateOfBirth(customer.getDateOfBirth());
        customerResponse.setPhoneNumber(customer.getPhoneNumber());
        customerResponse.setEmail(customer.getEmail());
        customerResponse.setBalance(customer.getBalance());
        customerResponse.setUser(customer.getUser().getFirstName() + " " + customer.getUser().getLastName());

        return customerResponse;
    }

    private Customer toEntity(CustomerRequest customerRequest, User authenticatedUser) {
        Customer customer = new Customer();
        customer.setFirstName(customerRequest.getFirstName());
        customer.setLastName(customerRequest.getLastName());
        customer.setCorporationName(customerRequest.getCorporationName());
        customer.setType(CustomerType.valueOf(customerRequest.getType()));
        customer.setAddress(customerRequest.getAddress());
        customer.setTcNo(customerRequest.getTcNo());
        customer.setTaxNo(customerRequest.getTaxNo());
        customer.setDateOfBirth(customerRequest.getDateOfBirth());
        customer.setPhoneNumber(customerRequest.getPhoneNumber());
        customer.setEmail(customerRequest.getEmail());
        customer.setCreatedDate(new Date());
        customer.setBalance(customerRequest.getBalance());
        customer.setUser(authenticatedUser);
        return customer;
    }

    public CustomerProfileResponse toCustomerProfileResponse(Customer customer) {
        CustomerProfileResponse response = new CustomerProfileResponse();
        response.setCustomerResponse(toCustomerResponse(customer));
        response.setPortfolio(getPortfolioResponses(customer));
        response.setAccountTransactions(getAccountTransactionResponses(customer));
        response.setCurrencyTransactions(getCurrencyTransactionResponses(customer));

        return response;
    }

    private List<PortfolioResponse> getPortfolioResponses(Customer customer) {
        BigDecimal totalPortfolioValue = calculateTotalPortfolioValue(customer);

        return customer.getPortfolio().stream()
                .map(portfolio -> {
                    PortfolioResponse portfolioDTO = new PortfolioResponse();
                    portfolioDTO.setCurrencyCode(portfolio.getCurrencyCode());
                    portfolioDTO.setAmount(portfolio.getAmount());
                    portfolioDTO.setPercentage(calculatePercentage(portfolio.getAmount(), totalPortfolioValue));
                    return portfolioDTO;
                })
                .collect(Collectors.toList());
    }

    private BigDecimal calculateTotalPortfolioValue(Customer customer) {
        return customer.getPortfolio().stream()
                .map(Portfolio::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculatePercentage(BigDecimal amount, BigDecimal totalValue) {
        return totalValue.compareTo(BigDecimal.ZERO) > 0
                ?
                amount.divide(totalValue, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .setScale(2, RoundingMode.HALF_UP)
                :
                BigDecimal.ZERO;
    }

    private List<AccountTransactionResponse> getAccountTransactionResponses(Customer customer) {
        return customer.getAccountTransactions().stream()
                .map(transaction -> {
                    AccountTransactionResponse transactionDTO = new AccountTransactionResponse();
                    transactionDTO.setId(transaction.getId());
                    transactionDTO.setUserId(transaction.getUser().getId());
                    transactionDTO.setCustomerId(transaction.getCustomer().getId());
                    transactionDTO.setAccountTransactionType(transaction.getAccountTransactionType());
                    transactionDTO.setAmount(transaction.getAmount());
                    transactionDTO.setTransactionDate(transaction.getTransactionDate());
                    return transactionDTO;
                })
                .collect(Collectors.toList());
    }

    private List<CurrencyTransactionResponse>  getCurrencyTransactionResponses(Customer customer) {
        return customer.getCurrencyTransactions().stream()
                .map(transaction -> {
                    CurrencyTransactionResponse transactionDTO = new CurrencyTransactionResponse();
                    transactionDTO.setCustomerFirstName(customer.getFirstName());
                    transactionDTO.setCustomerLastName(customer.getLastName());
                    transactionDTO.setId(transaction.getId());
                    transactionDTO.setCustomerId(transaction.getCustomer().getId());
                    transactionDTO.setUserId(transaction.getUser().getId());
                    transactionDTO.setCurrencyTransactionType(transaction.getCurrencyTransactionType());
                    transactionDTO.setCurrencyCode(transaction.getCurrencyCode());
                    transactionDTO.setAmount(transaction.getAmount());
                    transactionDTO.setExchangeRate(transaction.getExchangeRate());
                    transactionDTO.setTransactionDate(transaction.getTransactionDate());
                    transactionDTO.setBuyCurrencyCode(transaction.getTargetCurrencyCode());
                    return transactionDTO;
                })
                .collect(Collectors.toList());
    }



}