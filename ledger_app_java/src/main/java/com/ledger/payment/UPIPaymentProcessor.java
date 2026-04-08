package com.ledger.payment;

import com.ledger.entity.Account;
import com.ledger.repository.AccountRepository;

import java.math.BigDecimal;

public class UPIPaymentProcessor extends PaymentProcessor {

    private static final BigDecimal MAX_AMOUNT = new BigDecimal("100000");

    public UPIPaymentProcessor(AccountRepository accountRepository) {
        super(accountRepository);
    }

    @Override
    public void validate(BigDecimal amount, Account fromAccount, Account toAccount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Amount must be positive");
        if (amount.compareTo(MAX_AMOUNT) > 0)
            throw new IllegalArgumentException("UPI max transaction is ₹1,00,000");
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
