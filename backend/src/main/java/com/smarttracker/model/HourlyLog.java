package com.smarttracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "hourly_logs")
public class HourlyLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "log_date", nullable = false)
    private LocalDate date;

    @Column(name = "hour_of_day", nullable = false)
    private Integer hour;

    @Column(name = "activity", columnDefinition = "TEXT")
    private String activity;

    @Column(name = "user_email")
    private String userEmail;

    public HourlyLog() {}

    public HourlyLog(LocalDate date, Integer hour, String activity, String userEmail) {
        this.date = date;
        this.hour = hour;
        this.activity = activity;
        this.userEmail = userEmail;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Integer getHour() { return hour; }
    public void setHour(Integer hour) { this.hour = hour; }

    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}
