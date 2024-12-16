package com.infilasyon.infinexchangebackend.config.auth;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public class RefreshTokenRequest {

    @NotNull
    @Length(min = 5, max = 20)
    private String username;

    @NotNull
    @Length(min = 36, max = 50)
    private String refreshToken;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

}