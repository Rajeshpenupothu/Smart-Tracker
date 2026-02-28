package com.smarttracker.repository;

import com.smarttracker.model.DailyTask;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface DailyTaskRepository extends JpaRepository<DailyTask, Long> {
    Optional<DailyTask> findByDate(LocalDate date);
    Optional<DailyTask> findFirstByOrderByDateDesc();
    java.util.List<DailyTask> findAllByOrderByDateDesc();
}
