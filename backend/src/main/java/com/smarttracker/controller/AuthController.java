package com.smarttracker.controller;

import com.smarttracker.model.User;
import com.smarttracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        String normalizedEmail = (user.getEmail() != null) ? user.getEmail().toLowerCase() : null;
        user.setEmail(normalizedEmail);
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        String normalizedEmail = (loginRequest.getEmail() != null) ? loginRequest.getEmail().toLowerCase() : null;
        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);
        
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(404).body("Email not found");
        }
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body("Incorrect password");
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("email", userOpt.get().getEmail());
        response.put("fullName", userOpt.get().getFullName());
        response.put("message", "Login successful");
        return ResponseEntity.ok(response);
    }
}
