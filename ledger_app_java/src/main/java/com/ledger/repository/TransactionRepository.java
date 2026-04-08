package com.ledger.repository;

import com.ledger.entity.Transaction;
import com.ledger.enums.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, String> {

    @Query("""
        SELECT t FROM Transaction t
        WHERE (t.fromAccount.id IN :accountIds OR t.toAccount.id IN :accountIds)
        AND t.createdAt BETWEEN :start AND :end
        """)
    List<Transaction> findHistoryForUser(
        @Param("accountIds") List<Long> accountIds,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t
        WHERE t.fromAccount.id IN :accountIds
        AND t.category = :category
        AND t.createdAt BETWEEN :start AND :end
        """)
    BigDecimal sumMonthlySpending(
        @Param("accountIds") List<Long> accountIds,
        @Param("category") Category category,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );
}
