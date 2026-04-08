package com.ledger.controller;

import com.ledger.dto.TransactionHistoryResponse;
import com.ledger.dto.TransactionRequest;
import com.ledger.dto.TransactionResponse;
import com.ledger.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public List<TransactionResponse> list() {
        return transactionService.listAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse create(@Valid @RequestBody TransactionRequest req) {
        return transactionService.create(req);
    }

    @GetMapping("/{id}")
    public TransactionResponse get(@PathVariable String id) {
        return transactionService.getById(id);
    }

    @GetMapping("/history")
    public List<TransactionHistoryResponse> history(
        @RequestParam("user_id") Long userId,
        @RequestParam("start_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
        @RequestParam("end_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        return transactionService.getHistory(userId, startDate, endDate);
    }
}
