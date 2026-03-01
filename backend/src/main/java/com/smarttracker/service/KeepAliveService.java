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
    private final org.springframework.web.reactive.function.client.WebClient webClient;

    public KeepAliveService(UserRepository userRepository, org.springframework.web.reactive.function.client.WebClient webClient) {
        this.userRepository = userRepository;
        this.webClient = webClient;
    }

    // Runs every 10 minutes to keep Render free tier alive (shorter than 15-min timeout)
    @Scheduled(fixedRate = 10 * 60 * 1000)
    public void keepAlive() {
        try {
            // 1. DB Ping
            long count = userRepository.count();
            logger.info("[Keep-Alive] DB ping OK — user count: {}", count);

            // 2. Self-Ping (to reset Render's 15-min inactivity timer)
            String appUrl = System.getenv("RENDER_EXTERNAL_URL");
            if (appUrl == null || appUrl.isEmpty()) {
                appUrl = "http://localhost:8080"; // Fallback for local testing
            }
            
            String healthUrl = appUrl + "/health";
            webClient.get()
                    .uri(healthUrl)
                    .retrieve()
                    .bodyToMono(String.class)
                    .doOnSuccess(res -> logger.info("[Keep-Alive] Self-ping successful: {}", healthUrl))
                    .doOnError(err -> logger.warn("[Keep-Alive] Self-ping failed: {}", err.getMessage()))
                    .subscribe();

        } catch (Exception e) {
            logger.warn("[Keep-Alive] unexpected error: {}", e.getMessage());
        }
    }
}
