package com.ledger.payment;

import com.ledger.entity.Account;
import com.ledger.repository.AccountRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class CreditCardPaymentProcessor extends PaymentProcessor {

    private static final BigDecimal FEE_RATE = new BigDecimal("0.02");

    public CreditCardPaymentProcessor(AccountRepository accountRepository) {
        super(accountRepository);
    }

    private BigDecimal fee(BigDecimal amount) {
        return amount.multiply(FEE_RATE).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public void validate(BigDecimal amount, Account fromAccount, Account toAccount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Amount must be positive");
        BigDecimal total = amount.add(fee(amount));
        if (fromAccount.getBalance().compareTo(total) < 0)
            throw new IllegalArgumentException(
                "Insufficient balance (amount + 2%% fee = " + total + ")"
            );
    }

    @Override
    public void process(BigDecimal amount, Account fromAccount, Account toAccount) {
        BigDecimal total = amount.add(fee(amount));
        fromAccount.setBalance(fromAccount.getBalance().subtract(total));
        toAccount.setBalance(toAccount.getBalance().add(amount));
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
    }
}
