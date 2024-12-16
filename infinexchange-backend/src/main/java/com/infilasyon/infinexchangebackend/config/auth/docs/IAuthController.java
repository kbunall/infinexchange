package com.infilasyon.infinexchangebackend.config.auth.docs;
import com.infilasyon.infinexchangebackend.config.auth.AuthRequest;
import com.infilasyon.infinexchangebackend.config.auth.RefreshTokenRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

@Tag(name = "Authentication Controller", description = "Operations pertaining to user authentication")
public interface IAuthController {

    @Operation(summary = "Get Access Token", description = "Generate an access token using username and password", responses = {
            @ApiResponse(responseCode = "200", description = "Token generated successfully"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    ResponseEntity<?> getAccessToken(@Valid AuthRequest request);

    @Operation(summary = "Refresh Token", description = "Refresh the access token using a refresh token", responses = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
            @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
    })
    ResponseEntity<?> refreshToken(@Valid RefreshTokenRequest request);
}
