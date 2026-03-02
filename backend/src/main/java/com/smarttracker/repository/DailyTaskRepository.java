package com.smarttracker.repository;

import com.smarttracker.model.DailyTask;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface DailyTaskRepository extends JpaRepository<DailyTask, Long> {
    Optional<DailyTask> findByDateAndUserEmail(LocalDate date, String userEmail);
    List<DailyTask> findAllByUserEmailOrderByDateDesc(String userEmail);
}
