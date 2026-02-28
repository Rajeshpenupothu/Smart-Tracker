package com.smarttracker.controller;

import com.smarttracker.model.SpecialDay;
import com.smarttracker.repository.SpecialDayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/special-days")
@CrossOrigin(origins = "http://localhost:5173")
public class SpecialDayController {

    @Autowired
    private SpecialDayRepository repository;

    @GetMapping
    public List<SpecialDay> getAllSpecialDays() {
        return repository.findAllByOrderByDateDesc();
    }

    @PostMapping
    public SpecialDay saveSpecialDay(@RequestBody Map<String, String> payload) {
        String dateStr = payload.get("date");
        String title = payload.get("title");
        
        LocalDate date = LocalDate.parse(dateStr);
        Optional<SpecialDay> existing = repository.findByDate(date);
        
        if (existing.isPresent()) {
            SpecialDay sd = existing.get();
            sd.setTitle(title);
            return repository.save(sd);
        } else {
            SpecialDay sd = new SpecialDay(date, title);
            return repository.save(sd);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteSpecialDay(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
