package com.ledger.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SetDefaultAccountRequest {
    @NotNull
    private Long account;
}
