package com.ledger.payment;

import com.ledger.entity.Account;
import com.ledger.repository.AccountRepository;

import java.math.BigDecimal;

public abstract class PaymentProcessor {

    protected final AccountRepository accountRepository;

    protected PaymentProcessor(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public abstract void validate(BigDecimal amount, Account fromAccount, Account toAccount);

    public abstract void process(BigDecimal amount, Account fromAccount, Account toAccount);

    public void pay(BigDecimal amount, Account fromAccount, Account toAccount) {
        validate(amount, fromAccount, toAccount);
        process(amount, fromAccount, toAccount);
    }
}
