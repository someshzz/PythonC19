package com.ledger.service;

import com.ledger.dto.BudgetRequest;
import com.ledger.dto.BudgetResponse;
import com.ledger.entity.Budget;
import com.ledger.entity.User;
import com.ledger.exception.AppException;
import com.ledger.repository.BudgetRepository;
import com.ledger.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public BudgetService(BudgetRepository budgetRepository, UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    public List<BudgetResponse> listAll() {
        return budgetRepository.findAll().stream().map(BudgetResponse::from).toList();
    }

    public BudgetResponse create(BudgetRequest req) {
        User user = userRepository.findById(req.getUserId())
            .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        Budget budget = Budget.builder()
            .user(user)
            .category(req.getCategory())
            .amount(req.getAmount())
            .build();
        return BudgetResponse.from(budgetRepository.save(budget));
    }

    public BudgetResponse getById(String id) {
        return BudgetResponse.from(findOrThrow(id));
    }

    public BudgetResponse update(String id, BudgetRequest req) {
        Budget budget = findOrThrow(id);
        if (req.getCategory() != null) budget.setCategory(req.getCategory());
        if (req.getAmount() != null) budget.setAmount(req.getAmount());
        return BudgetResponse.from(budgetRepository.save(budget));
    }

    public void delete(String id) {
        findOrThrow(id);
        budgetRepository.deleteById(id);
    }

    private Budget findOrThrow(String id) {
        return budgetRepository.findById(id)
            .orElseThrow(() -> new AppException("Budget not found", HttpStatus.NOT_FOUND));
    }
}
