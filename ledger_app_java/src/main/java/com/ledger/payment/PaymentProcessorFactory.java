package com.ledger.payment;

import com.ledger.enums.PaymentMethod;
import com.ledger.repository.AccountRepository;
import org.springframework.stereotype.Component;

@Component
public class PaymentProcessorFactory {

    private final AccountRepository accountRepository;

    public PaymentProcessorFactory(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public PaymentProcessor get(PaymentMethod method) {
        return switch (method) {
            case UPI -> new UPIPaymentProcessor(accountRepository);
            case CC -> new CreditCardPaymentProcessor(accountRepository);
            case BANK_TRANSFER -> new BankTransferPaymentProcessor(accountRepository);
        };
    }
}
