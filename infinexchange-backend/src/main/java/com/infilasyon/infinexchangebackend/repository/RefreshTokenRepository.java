package com.infilasyon.infinexchangebackend.repository;

import com.infilasyon.infinexchangebackend.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {

    @Query("SELECT rt FROM RefreshToken rt WHERE rt.user.username = ?1")
    List<RefreshToken> findByUsername(String username);

    @Query("DELETE FROM RefreshToken rt WHERE rt.user.id = ?1")
    @Modifying
    void deleteByUserId(Integer userId);

    @Query("DELETE FROM RefreshToken rt WHERE rt.expiryTime <= :currentTime")
    @Modifying
    void deleteByExpiryTime(@Param("currentTime") Date currentTime);

}