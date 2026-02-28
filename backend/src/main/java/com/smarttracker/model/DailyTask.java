package com.smarttracker.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;

@Entity
@Table(name = "daily_log")
public class DailyTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "log_date")
    private LocalDate date;
    
    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "completed_tasks", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> completedTasks = new HashMap<>(); // Store as JSON map

    public DailyTask() {}

    public DailyTask(Long id, LocalDate date, String notes, Map<String, Object> completedTasks) {
        this.id = id;
        this.date = date;
        this.notes = notes;
        this.completedTasks = completedTasks;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Map<String, Object> getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(Map<String, Object> completedTasks) { this.completedTasks = completedTasks; }
}
