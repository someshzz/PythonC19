package com.ledger.dto;

import com.ledger.enums.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountRequest {

    @NotNull
    private Long userId;

    @NotBlank @Size(max = 30)
    private String accountNumber;

    @NotBlank @Size(max = 11)
    private String ifsc;

    private BigDecimal balance;

    @NotNull
    private AccountType accountType;
}
