package com.ledger.service;

import com.ledger.dto.TransactionHistoryResponse;
import com.ledger.dto.TransactionRequest;
import com.ledger.dto.TransactionResponse;
import com.ledger.entity.Account;
import com.ledger.entity.Budget;
import com.ledger.entity.Transaction;
import com.ledger.entity.User;
import com.ledger.enums.TransactionStatus;
import com.ledger.exception.AppException;
import com.ledger.payment.PaymentProcessor;
import com.ledger.payment.PaymentProcessorFactory;
import com.ledger.repository.AccountRepository;
import com.ledger.repository.BudgetRepository;
import com.ledger.repository.TransactionRepository;
import com.ledger.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final PaymentProcessorFactory processorFactory;

    public TransactionService(
        TransactionRepository transactionRepository,
        AccountRepository accountRepository,
        UserRepository userRepository,
        BudgetRepository budgetRepository,
        PaymentProcessorFactory processorFactory
    ) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.budgetRepository = budgetRepository;
        this.processorFactory = processorFactory;
    }

    public List<TransactionResponse> listAll() {
        return transactionRepository.findAll().stream().map(TransactionResponse::from).toList();
    }

    public TransactionResponse getById(String id) {
        Transaction txn = transactionRepository.findById(id)
            .orElseThrow(() -> new AppException("Transaction not found", HttpStatus.NOT_FOUND));
        return TransactionResponse.from(txn);
    }

    @Transactional
    public TransactionResponse create(TransactionRequest req) {
        // Resolve receiver
        User receiver = userRepository.findByPhoneNumber(req.getPhoneNumber())
            .orElseThrow(() -> new AppException("Receiver not found", HttpStatus.NOT_FOUND));
        if (receiver.getDefaultAccount() == null)
            throw new AppException("Receiver has no default account set", HttpStatus.BAD_REQUEST);

        Account fromAccount = accountRepository.findById(req.getFromAccount())
            .orElseThrow(() -> new AppException("Sender account not found", HttpStatus.NOT_FOUND));
        Account toAccount = receiver.getDefaultAccount();

        // Budget check
        Optional<Budget> budget = budgetRepository.findByUserIdAndCategory(
            fromAccount.getUser().getId(), req.getCategory()
        );
        if (budget.isPresent()) {
            List<Long> userAccountIds = accountRepository.findByUserId(fromAccount.getUser().getId())
                .stream().map(Account::getId).toList();

            LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
            LocalDateTime monthEnd = monthStart.plusMonths(1).minusSeconds(1);

            BigDecimal spent = transactionRepository.sumMonthlySpending(
                userAccountIds, req.getCategory(), monthStart, monthEnd
            );

            if (spent.add(req.getAmount()).compareTo(budget.get().getAmount()) > 0) {
                throw new AppException(
                    "Budget exceeded for " + req.getCategory() +
                    ". Spent: " + spent + ", Budget: " + budget.get().getAmount() +
                    ", Requested: " + req.getAmount(),
                    HttpStatus.BAD_REQUEST
                );
            }
        }

        // Process payment (updates balances)
        PaymentProcessor processor = processorFactory.get(req.getPaymentMethod());
        processor.pay(req.getAmount(), fromAccount, toAccount);

        // Record transaction
        Transaction txn = Transaction.builder()
            .fromAccount(fromAccount)
            .toAccount(toAccount)
            .amount(req.getAmount())
            .category(req.getCategory())
            .description(req.getDescription() != null ? req.getDescription() : "")
            .paymentMethod(req.getPaymentMethod())
            .status(TransactionStatus.COMPLETED)
            .build();

        return TransactionResponse.from(transactionRepository.save(txn));
    }

    public List<TransactionHistoryResponse> getHistory(Long userId, LocalDateTime start, LocalDateTime end) {
        List<Account> userAccounts = accountRepository.findByUserId(userId);
        if (userAccounts.isEmpty())
            throw new AppException("User not found or has no accounts", HttpStatus.NOT_FOUND);

        List<Long> accountIds = userAccounts.stream().map(Account::getId).toList();
        Set<Long> accountIdSet = userAccounts.stream().map(Account::getId).collect(Collectors.toSet());

        List<Transaction> transactions = transactionRepository.findHistoryForUser(accountIds, start, end);

        return transactions.stream().map(txn -> {
            boolean isDebit = accountIdSet.contains(txn.getFromAccount().getId());
            Account other = isDebit ? txn.getToAccount() : txn.getFromAccount();

            TransactionHistoryResponse r = new TransactionHistoryResponse();
            r.setTxnId(txn.getId());
            r.setReceiverName(other.getUser().getFirstName() + " " + other.getUser().getLastName());
            r.setReceiverAccountNumber(other.getAccountNumber());
            r.setTxnDate(txn.getCreatedAt());
            r.setAmount(txn.getAmount());
            r.setStatus(txn.getStatus());
            r.setTxnType(isDebit ? "DEBIT" : "CREDIT");
            return r;
        }).toList();
    }
}
