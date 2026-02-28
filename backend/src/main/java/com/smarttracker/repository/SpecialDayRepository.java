package com.smarttracker.repository;

import com.smarttracker.model.SpecialDay;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

public interface SpecialDayRepository extends JpaRepository<SpecialDay, Long> {
    List<SpecialDay> findAllByOrderByDateDesc();
    Optional<SpecialDay> findByDate(LocalDate date);
}
