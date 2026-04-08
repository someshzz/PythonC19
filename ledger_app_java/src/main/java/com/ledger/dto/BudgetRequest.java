package com.ledger.dto;

import com.ledger.enums.Category;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetRequest {

    @NotNull
    private Long userId;

    @NotNull
    private Category category;

    @NotNull @PositiveOrZero
    private BigDecimal amount;
}
