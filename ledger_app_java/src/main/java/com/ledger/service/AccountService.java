package com.ledger.service;

import com.ledger.dto.AccountRequest;
import com.ledger.dto.AccountResponse;
import com.ledger.entity.Account;
import com.ledger.entity.User;
import com.ledger.exception.AppException;
import com.ledger.repository.AccountRepository;
import com.ledger.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountService(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public List<AccountResponse> listAll() {
        return accountRepository.findAll().stream().map(AccountResponse::from).toList();
    }

    public AccountResponse create(AccountRequest req) {
        User user = userRepository.findById(req.getUserId())
            .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        Account account = Account.builder()
            .user(user)
            .accountNumber(req.getAccountNumber())
            .ifsc(req.getIfsc())
            .balance(req.getBalance() != null ? req.getBalance() : BigDecimal.ZERO)
            .accountType(req.getAccountType())
            .build();
        return AccountResponse.from(accountRepository.save(account));
    }

    public AccountResponse getById(Long id) {
        return AccountResponse.from(findOrThrow(id));
    }

    public AccountResponse update(Long id, AccountRequest req) {
        Account account = findOrThrow(id);
        if (req.getAccountNumber() != null) account.setAccountNumber(req.getAccountNumber());
        if (req.getIfsc() != null) account.setIfsc(req.getIfsc());
        if (req.getBalance() != null) account.setBalance(req.getBalance());
        if (req.getAccountType() != null) account.setAccountType(req.getAccountType());
        return AccountResponse.from(accountRepository.save(account));
    }

    public void delete(Long id) {
        findOrThrow(id);
        accountRepository.deleteById(id);
    }

    private Account findOrThrow(Long id) {
        return accountRepository.findById(id)
            .orElseThrow(() -> new AppException("Account not found", HttpStatus.NOT_FOUND));
    }
}
