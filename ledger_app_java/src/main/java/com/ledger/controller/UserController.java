package com.ledger.controller;

import com.ledger.dto.SetDefaultAccountRequest;
import com.ledger.dto.UserRequest;
import com.ledger.dto.UserResponse;
import com.ledger.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> list() {
        return userService.listAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody UserRequest req) {
        return userService.create(req);
    }

    @GetMapping("/{id}")
    public UserResponse get(@PathVariable Long id) {
        return userService.getById(id);
    }

    @PutMapping("/{id}")
    public UserResponse update(@PathVariable Long id, @Valid @RequestBody UserRequest req) {
        return userService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }

    @PostMapping("/{id}/set-default-account")
    public UserResponse setDefaultAccount(
        @PathVariable Long id,
        @Valid @RequestBody SetDefaultAccountRequest req
    ) {
        return userService.setDefaultAccount(id, req);
    }
}
