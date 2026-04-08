package com.ledger.dto;

import com.ledger.entity.Budget;
import com.ledger.enums.Category;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetResponse {

    private String id;
    private Long userId;
    private Category category;
    private BigDecimal amount;

    public static BudgetResponse from(Budget b) {
        BudgetResponse r = new BudgetResponse();
        r.id = b.getId();
        r.userId = b.getUser().getId();
        r.category = b.getCategory();
        r.amount = b.getAmount();
        return r;
    }
}
