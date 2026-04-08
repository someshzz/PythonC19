package com.ledger.dto;

import com.ledger.entity.Account;
import com.ledger.enums.AccountType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AccountResponse {

    private Long id;
    private Long userId;
    private String accountNumber;
    private String ifsc;
    private BigDecimal balance;
    private AccountType accountType;
    private LocalDateTime createdAt;

    public static AccountResponse from(Account a) {
        AccountResponse r = new AccountResponse();
        r.id = a.getId();
        r.userId = a.getUser().getId();
        r.accountNumber = a.getAccountNumber();
        r.ifsc = a.getIfsc();
        r.balance = a.getBalance();
        r.accountType = a.getAccountType();
        r.createdAt = a.getCreatedAt();
        return r;
    }
}
