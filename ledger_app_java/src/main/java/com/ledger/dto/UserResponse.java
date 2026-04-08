package com.ledger.dto;

import com.ledger.entity.User;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String phoneNumber;
    private Long defaultAccountId;

    public static UserResponse from(User user) {
        UserResponse r = new UserResponse();
        r.id = user.getId();
        r.firstName = user.getFirstName();
        r.lastName = user.getLastName();
        r.dob = user.getDob();
        r.phoneNumber = user.getPhoneNumber();
        r.defaultAccountId = user.getDefaultAccount() != null ? user.getDefaultAccount().getId() : null;
        return r;
    }
}
