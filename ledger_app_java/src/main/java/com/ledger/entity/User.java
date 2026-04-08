package com.ledger.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", length = 50, nullable = false)
    private String firstName;

    @Column(name = "last_name", length = 50, nullable = false)
    private String lastName;

    @Column(nullable = false)
    private LocalDate dob;

    @Column(name = "phone_number", length = 15, unique = true, nullable = false)
    private String phoneNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_account_id")
    private Account defaultAccount;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Account> accounts;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Budget> budgets;
}
