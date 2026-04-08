package com.ledger.payment;

import com.ledger.entity.Account;
import com.ledger.repository.AccountRepository;

import java.math.BigDecimal;

public class BankTransferPaymentProcessor extends PaymentProcessor {

    public BankTransferPaymentProcessor(AccountRepository accountRepository) {
        super(accountRepository);
    }

    @Override
    public void validate(BigDecimal amount, Account fromAccount, Account toAccount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Amount must be positive");
        if (fromAccount.getId().equals(toAccount.getId()))
            throw new IllegalArgumentException("Cannot transfer to the same account");
        if (fromAccount.getBalance().compareTo(amount) < 0)
            throw new IllegalArgumentException("Insufficient balance");
    }

    @Override
    public void process(BigDecimal amount, Account fromAccount, Account toAccount) {
        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        toAccount.setBalance(toAccount.getBalance().add(amount));
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
    }
}
