package com.ledger.dto;

import com.ledger.enums.Category;
import com.ledger.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionRequest {

    @NotBlank @Size(max = 15)
    private String phoneNumber;

    @NotNull
    private Long fromAccount;

    @NotNull @Positive
    private BigDecimal amount;

    @NotNull
    private Category category;

    private String description;

    @NotNull
    private PaymentMethod paymentMethod;
}
