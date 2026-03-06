package com.aifitness.userservice.controller;

import com.aifitness.userservice.dto.*;
import com.aifitness.userservice.model.User;
import com.aifitness.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map; // Added import

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*") // Allow React app to connect
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody UserRegistrationDto registrationDto) {
        User registeredUser = userService.registerUser(registrationDto);
        return ResponseEntity.ok(registeredUser);
    }

    @GetMapping("/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") java.util.UUID id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Login Endpoint for Frontend NextAuth CredentialsProvider
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String rawPassword = loginRequest.get("password");

        System.out.println("Login attempt for user: " + email);

        return userService.getUserByEmail(email)
                .filter(user -> {
                    boolean matches = passwordEncoder.matches(rawPassword, user.getPasswordHash());
                    System.out.println("Password match for " + email + ": " + matches);
                    return matches;
                })
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    System.out.println("Login failed for user: " + email);
                    return ResponseEntity.status(401).build();
                });
    }

    // Sync OAuth users across the platform from NextAuth
    @PostMapping("/oauth-sync")
    public ResponseEntity<User> oauthSync(@RequestBody OAuthLoginDto syncDto) {
        try {
            return ResponseEntity.ok(userService.syncOAuthUser(syncDto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{email}/profile")
    public ResponseEntity<User> updateProfile(@PathVariable String email, @RequestBody UserProfileUpdateDto dto) {
        try {
            return ResponseEntity.ok(userService.updateProfile(email, dto));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{email}/security")
    public ResponseEntity<User> updateSecurity(@PathVariable String email, @RequestBody SecurityUpdateDto dto) {
        try {
            return ResponseEntity.ok(userService.updateSecurity(email, dto));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{email}/notifications")
    public ResponseEntity<User> updateNotifications(@PathVariable String email,
            @RequestBody NotificationUpdateDto dto) {
        try {
            return ResponseEntity.ok(userService.updateNotifications(email, dto));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/biometrics")
    public ResponseEntity<User> updateBiometrics(@PathVariable java.util.UUID id,
            @RequestBody BiometricsUpdateDto dto) {
        try {
            return ResponseEntity.ok(userService.updateBiometrics(id, dto));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{email}/membership")
    public ResponseEntity<User> updateMembership(@PathVariable String email, @RequestBody MembershipUpdateDto dto) {
        try {
            return ResponseEntity.ok(userService.updateMembership(email, dto));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
