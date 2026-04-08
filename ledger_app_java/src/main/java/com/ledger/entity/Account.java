package com.ledger.entity;

import com.ledger.enums.AccountType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "accounts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "account_number", length = 30, unique = true, nullable = false)
    private String accountNumber;

    @Column(length = 11, nullable = false)
    private String ifsc;

    @Column(precision = 12, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false)
    private AccountType accountType;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "fromAccount", fetch = FetchType.LAZY)
    private List<Transaction> outgoingTransactions;

    @OneToMany(mappedBy = "toAccount", fetch = FetchType.LAZY)
    private List<Transaction> incomingTransactions;
}
