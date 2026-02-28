package com.smarttracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartTrackerApplication.class, args);
    }
}
