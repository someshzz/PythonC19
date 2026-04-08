package com.ledger.controller;

import com.ledger.dto.BudgetRequest;
import com.ledger.dto.BudgetResponse;
import com.ledger.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public List<BudgetResponse> list() {
        return budgetService.listAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BudgetResponse create(@Valid @RequestBody BudgetRequest req) {
        return budgetService.create(req);
    }

    @GetMapping("/{id}")
    public BudgetResponse get(@PathVariable String id) {
        return budgetService.getById(id);
    }

    @PutMapping("/{id}")
    public BudgetResponse update(@PathVariable String id, @RequestBody BudgetRequest req) {
        return budgetService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        budgetService.delete(id);
    }
}
