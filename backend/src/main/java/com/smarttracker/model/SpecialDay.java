package com.smarttracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "special_days")
public class SpecialDay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "special_date", nullable = false)
    private LocalDate date;
    
    @Column(nullable = false)
    private String title;

    public SpecialDay() {}

    public SpecialDay(LocalDate date, String title) {
        this.date = date;
        this.title = title;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
