package com.ledger.service;

import com.ledger.dto.SetDefaultAccountRequest;
import com.ledger.dto.UserRequest;
import com.ledger.dto.UserResponse;
import com.ledger.entity.Account;
import com.ledger.entity.User;
import com.ledger.exception.AppException;
import com.ledger.repository.AccountRepository;
import com.ledger.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public UserService(UserRepository userRepository, AccountRepository accountRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    public List<UserResponse> listAll() {
        return userRepository.findAll().stream().map(UserResponse::from).toList();
    }

    public UserResponse create(UserRequest req) {
        User user = User.builder()
            .firstName(req.getFirstName())
            .lastName(req.getLastName())
            .dob(req.getDob())
            .phoneNumber(req.getPhoneNumber())
            .build();
        if (req.getDefaultAccountId() != null) {
            Account acc = accountRepository.findById(req.getDefaultAccountId())
                .orElseThrow(() -> new AppException("Account not found", HttpStatus.NOT_FOUND));
            user.setDefaultAccount(acc);
        }
        return UserResponse.from(userRepository.save(user));
    }

    public UserResponse getById(Long id) {
        return UserResponse.from(findOrThrow(id));
    }

    public UserResponse update(Long id, UserRequest req) {
        User user = findOrThrow(id);
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setDob(req.getDob());
        user.setPhoneNumber(req.getPhoneNumber());
        if (req.getDefaultAccountId() != null) {
            Account acc = accountRepository.findById(req.getDefaultAccountId())
                .orElseThrow(() -> new AppException("Account not found", HttpStatus.NOT_FOUND));
            user.setDefaultAccount(acc);
        }
        return UserResponse.from(userRepository.save(user));
    }

    public void delete(Long id) {
        findOrThrow(id);
        userRepository.deleteById(id);
    }

    public UserResponse setDefaultAccount(Long userId, SetDefaultAccountRequest req) {
        User user = findOrThrow(userId);
        Account account = accountRepository.findById(req.getAccount())
            .orElseThrow(() -> new AppException("Account not found", HttpStatus.NOT_FOUND));
        if (!account.getUser().getId().equals(userId))
            throw new AppException("Account does not belong to this user", HttpStatus.BAD_REQUEST);
        user.setDefaultAccount(account);
        return UserResponse.from(userRepository.save(user));
    }

    private User findOrThrow(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }
}
