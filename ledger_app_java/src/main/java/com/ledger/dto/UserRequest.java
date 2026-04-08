package com.ledger.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRequest {

    @NotBlank @Size(max = 50)
    private String firstName;

    @NotBlank @Size(max = 50)
    private String lastName;

    @NotNull
    private LocalDate dob;

    @NotBlank @Size(max = 15)
    private String phoneNumber;

    private Long defaultAccountId;
}
