package com.smarttracker.service;

import com.smarttracker.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class KeepAliveService {

    private static final Logger logger = LoggerFactory.getLogger(KeepAliveService.class);

    private final UserRepository userRepository;

    public KeepAliveService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Runs every 5 minutes to keep Render free tier alive
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void keepAlive() {
        try {
            long count = userRepository.count();
            logger.info("[Keep-Alive] DB ping OK — user count: {}", count);
        } catch (Exception e) {
            logger.warn("[Keep-Alive] DB ping failed: {}", e.getMessage());
        }
    }
}
