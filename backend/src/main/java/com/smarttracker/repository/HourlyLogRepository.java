package com.smarttracker.repository;

import com.smarttracker.model.HourlyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface HourlyLogRepository extends JpaRepository<HourlyLog, Long> {
    List<HourlyLog> findByDate(LocalDate date);
    void deleteByDate(LocalDate date);
}
