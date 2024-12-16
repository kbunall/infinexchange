package com.infilasyon.infinexchangebackend.config;

import com.infilasyon.infinexchangebackend.repository.RefreshTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Component("deleteExpiredRefreshTokens")
@EnableScheduling
public class RefreshTokenRemovalScheduledTask {

    private static final Logger LOGGER = LoggerFactory.getLogger(RefreshTokenRemovalScheduledTask.class);

    private final RefreshTokenRepository repo;

    public RefreshTokenRemovalScheduledTask(RefreshTokenRepository repo) {
        this.repo = repo;
    }

    @Scheduled(fixedDelayString = "${app.refresh-token.removal.interval}", initialDelay = 5000)
    @Transactional
    public void deleteExpiredRefreshTokens() {
         repo.deleteByExpiryTime(new Date());

        LOGGER.info("Expired refresh tokens deleted." );

    }
}
