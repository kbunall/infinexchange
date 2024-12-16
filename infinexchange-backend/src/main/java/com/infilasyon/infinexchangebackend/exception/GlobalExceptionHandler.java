package com.infilasyon.infinexchangebackend.exception;

import com.infilasyon.infinexchangebackend.config.auth.InvalidResetPasswordTokenException;
import com.infilasyon.infinexchangebackend.config.auth.RefreshTokenExpiredException;
import com.infilasyon.infinexchangebackend.config.auth.RefreshTokenNotFoundException;
import com.infilasyon.infinexchangebackend.config.jwt.JwtValidationException;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;
import java.util.List;


@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private ErrorDTO createErrorDTO(HttpStatus status, String message, WebRequest request) {
        ErrorDTO error = new ErrorDTO();
        error.setTimestamp(new Date());
        error.setStatus(status.value());
        error.addError("error", message);
        error.setPath(((ServletWebRequest) request).getRequest().getServletPath());
        return error;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorDTO handleGenericException(Exception ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.", request);
    }

    @ExceptionHandler({AuthorizationDeniedException.class, AccessDeniedException.class})
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorDTO handleAuthorizationDeniedException(Exception ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.FORBIDDEN, "You do not have the required permissions to access this resource.", request);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleConstraintViolation(ConstraintViolationException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(JwtValidationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public ErrorDTO handleJwtValidationException(JwtValidationException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
    }

    @ExceptionHandler(RefreshTokenNotFoundException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public ErrorDTO handleRefreshTokenNotFoundException(RefreshTokenNotFoundException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
    }

    @ExceptionHandler(RefreshTokenExpiredException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public ErrorDTO handleRefreshTokenExpiredException(RefreshTokenExpiredException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
    }

    @ExceptionHandler(InsufficientBalanceException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleInsufficientBalanceException(InsufficientBalanceException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public ErrorDTO handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.UNAUTHORIZED, "Kullanıcı adı veya şifre hatalı.", request);
    }

    @ExceptionHandler(CustomerNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorDTO handleCustomerNotFoundException(CustomerNotFoundException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorDTO handleUserNotFoundException(UserNotFoundException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(CustomerCurrencyNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorDTO handleCustomerCurrencyNotFoundException(CustomerCurrencyNotFoundException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(CurrencyNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorDTO handleCurrencyNotFoundException(CurrencyNotFoundException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(InsufficientCurrencyAmountException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleInsufficientCurrencyAmountException(InsufficientCurrencyAmountException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }
    @ExceptionHandler(NotUniqueUsernameException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleNotUniqueUsernameException(NotUniqueUsernameException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }
    @ExceptionHandler(InvalidResetPasswordTokenException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleInvalidResetPasswordTokenException(InvalidResetPasswordTokenException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }
    @ExceptionHandler(InvalidTCNumberException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleInvalidTCNumberException(InvalidTCNumberException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(TCNoAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleTCNoAlreadyExistsException(TCNoAlreadyExistsException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(InvalidTaxNumberException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleInvalidTaxNumberException(InvalidTaxNumberException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(InvalidCorporationNameException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleInvalidCorporationNameException(InvalidCorporationNameException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(CorporationNameAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleCorporationNameAlreadyExistsException(CorporationNameAlreadyExistsException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(TaxNoAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleTaxNoAlreadyExistsException(TaxNoAlreadyExistsException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(PhoneNumberAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handlePhoneNumberAlreadyExistsException(PhoneNumberAlreadyExistsException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleEmailAlreadyExistsException(EmailAlreadyExistsException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(NewPasswordSameAsOldException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleNewPasswordSameAsOldException(NewPasswordSameAsOldException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }
    @ExceptionHandler(IncorrectOldPasswordException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO handleIncorrectOldPasswordException(IncorrectOldPasswordException ex, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        return createErrorDTO(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        LOGGER.error(ex.getMessage(), ex);
        ErrorDTO error = new ErrorDTO();
        error.setPath(((ServletWebRequest) request).getRequest().getServletPath());
        error.setStatus(status.value());
        error.setTimestamp(new Date());
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        fieldErrors.forEach(fieldError ->
                error.addError(fieldError.getField() , fieldError.getDefaultMessage())
        );

        return new ResponseEntity<>(error, headers, status);
    }
}