package com.smarttracker.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;
    private List<Map<String, String>> quotesList;

    public AIController(ResourceLoader resourceLoader, ObjectMapper objectMapper) {
        this.resourceLoader = resourceLoader;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        try {
            Resource resource = resourceLoader.getResource("classpath:study_quotes.json");
            try (InputStream is = resource.getInputStream()) {
                quotesList = objectMapper.readValue(is, new TypeReference<List<Map<String, String>>>() {});
                System.out.println("Loaded " + quotesList.size() + " offline quotes for daily rotation.");
            }
        } catch (Exception e) {
            System.err.println("Failed to load study_quotes.json: " + e.getMessage());
        }
    }

    @GetMapping("/quote")
    public Mono<Map<String, String>> getDailyQuote(@RequestParam(required = false) String date) {
        Map<String, String> response = new HashMap<>();
        if (quotesList == null || quotesList.isEmpty()) {
            response.put("text", "The only way to do great work is to love what you do.");
            response.put("author", "Steve Jobs");
        } else {
            LocalDate targetDate = LocalDate.now();
            if (date != null && !date.isEmpty()) {
                try {
                    targetDate = LocalDate.parse(date);
                } catch (Exception e) {
                    // fall back to today if invalid
                }
            }
            
            // Pick a deterministic quote based on the day of the year (1 - 365)
            int dayOfYear = targetDate.getDayOfYear();
            int quoteIndex = dayOfYear % quotesList.size();
            Map<String, String> selectedQuote = quotesList.get(quoteIndex);
            
            response.put("text", selectedQuote.getOrDefault("quote", "Keep pushing forward!"));
            response.put("author", selectedQuote.getOrDefault("author", "Unknown"));
        }
        return Mono.just(response);
    }
}
