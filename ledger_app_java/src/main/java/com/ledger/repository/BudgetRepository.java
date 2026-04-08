package com.ledger.repository;

import com.ledger.entity.Budget;
import com.ledger.enums.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, String> {
    List<Budget> findByUserId(Long userId);
    Optional<Budget> findByUserIdAndCategory(Long userId, Category category);
}
