package com.ledger.dto;

import com.ledger.enums.TransactionStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionHistoryResponse {
    private String txnId;
    private String receiverName;
    private String receiverAccountNumber;
    private LocalDateTime txnDate;
    private BigDecimal amount;
    private TransactionStatus status;
    private String txnType; // DEBIT or CREDIT
}
