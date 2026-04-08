package com.ledger.dto;

import com.ledger.entity.Transaction;
import com.ledger.enums.Category;
import com.ledger.enums.PaymentMethod;
import com.ledger.enums.TransactionStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionResponse {

    private String id;
    private Long fromAccountId;
    private Long toAccountId;
    private BigDecimal amount;
    private Category category;
    private String description;
    private PaymentMethod paymentMethod;
    private TransactionStatus status;
    private LocalDateTime createdAt;

    public static TransactionResponse from(Transaction t) {
        TransactionResponse r = new TransactionResponse();
        r.id = t.getId();
        r.fromAccountId = t.getFromAccount().getId();
        r.toAccountId = t.getToAccount().getId();
        r.amount = t.getAmount();
        r.category = t.getCategory();
        r.description = t.getDescription();
        r.paymentMethod = t.getPaymentMethod();
        r.status = t.getStatus();
        r.createdAt = t.getCreatedAt();
        return r;
    }
}
