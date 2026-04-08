package com.ledger.controller;

import com.ledger.dto.AccountRequest;
import com.ledger.dto.AccountResponse;
import com.ledger.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public List<AccountResponse> list() {
        return accountService.listAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponse create(@Valid @RequestBody AccountRequest req) {
        return accountService.create(req);
    }

    @GetMapping("/{id}")
    public AccountResponse get(@PathVariable Long id) {
        return accountService.getById(id);
    }

    @PutMapping("/{id}")
    public AccountResponse update(@PathVariable Long id, @RequestBody AccountRequest req) {
        return accountService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        accountService.delete(id);
    }
}
