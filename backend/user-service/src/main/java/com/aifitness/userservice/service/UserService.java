package com.aifitness.userservice.service;

import com.aifitness.userservice.dto.*;
import com.aifitness.userservice.model.User;
import com.aifitness.userservice.model.UserRole;
import com.aifitness.userservice.model.AuthProvider;
import com.aifitness.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(UserRegistrationDto registrationDto) {
        String email = registrationDto.getEmail().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("The email '" + email + "' is already registered.");
        }

        String username = registrationDto.getUsername();
        if (username == null || username.isEmpty()) {
            throw new RuntimeException("Username is mandatory for Shred Pro accounts.");
        }
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already taken. Try another.");
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(registrationDto.getPassword()));
        user.setFullName(registrationDto.getFullName());
        user.setRole(UserRole.USER);
        user.setProvider(AuthProvider.LOCAL);

        return userRepository.save(user);
    }

    public java.util.Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase());
    }

    public java.util.Optional<User> getUserById(java.util.UUID id) {
        return userRepository.findById(id);
    }

    public User syncOAuthUser(OAuthLoginDto dto) {
        java.util.Optional<User> existingUser = userRepository.findByEmail(dto.getEmail());
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // Optional: update provider if needed, or update picture
            if (dto.getProfilePicture() != null && user.getProfilePicture() == null) {
                user.setProfilePicture(dto.getProfilePicture());
                userRepository.save(user);
            }
            return user;
        }

        User newUser = new User();
        newUser.setEmail(dto.getEmail());
        newUser.setFullName(dto.getFullName());

        // Generate unique username from email prefix
        String baseUsername = dto.getEmail().split("@")[0];
        String finalUsername = baseUsername;
        int count = 1;
        while (userRepository.existsByUsername(finalUsername)) {
            finalUsername = baseUsername + count++;
        }
        newUser.setUsername(finalUsername);

        // Generates random hash so they can't login locally without reset
        newUser.setPasswordHash(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
        newUser.setRole(UserRole.USER);

        try {
            AuthProvider enumProv = AuthProvider.valueOf(dto.getProvider().toUpperCase());
            newUser.setProvider(enumProv);
        } catch (Exception e) {
            newUser.setProvider(AuthProvider.LOCAL);
        }

        newUser.setProviderId(dto.getProviderId());
        newUser.setProfilePicture(dto.getProfilePicture());

        return userRepository.save(newUser);
    }

    public User updateProfile(String email, UserProfileUpdateDto dto) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getUsername() != null && !dto.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(dto.getUsername())) {
                throw new RuntimeException("Username already taken. Try another.");
            }
            user.setUsername(dto.getUsername());
        }

        if (dto.getFullName() != null)
            user.setFullName(dto.getFullName());
        if (dto.getCurrentWeight() != null)
            user.setCurrentWeight(dto.getCurrentWeight());
        if (dto.getHeight() != null)
            user.setHeight(dto.getHeight());
        if (dto.getAge() != null)
            user.setAge(dto.getAge());
        if (dto.getProfilePicture() != null)
            user.setProfilePicture(dto.getProfilePicture());
        return userRepository.save(user);
    }

    public User updateSecurity(String email, SecurityUpdateDto dto) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (dto.getNewPassword() != null && !dto.getNewPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        }
        if (dto.getTwoFactorEnabled() != null)
            user.setTwoFactorEnabled(dto.getTwoFactorEnabled());
        return userRepository.save(user);
    }

    public User updateNotifications(String email, NotificationUpdateDto dto) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (dto.getNotificationWorkout() != null)
            user.setNotificationWorkout(dto.getNotificationWorkout());
        if (dto.getNotificationDiet() != null)
            user.setNotificationDiet(dto.getNotificationDiet());
        if (dto.getNotificationAi() != null)
            user.setNotificationAi(dto.getNotificationAi());
        if (dto.getNotificationMarketing() != null)
            user.setNotificationMarketing(dto.getNotificationMarketing());
        return userRepository.save(user);
    }

    public User updateBiometrics(java.util.UUID id, BiometricsUpdateDto dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (dto.getAge() != null)
            user.setAge(dto.getAge());
        if (dto.getGender() != null)
            user.setGender(dto.getGender());
        if (dto.getCurrentWeight() != null)
            user.setCurrentWeight(dto.getCurrentWeight());
        if (dto.getHeight() != null)
            user.setHeight(dto.getHeight());
        if (dto.getGoal() != null)
            user.setGoal(dto.getGoal());
        if (dto.getDietPreference() != null)
            user.setDietPreference(dto.getDietPreference());
        if (dto.getCountry() != null)
            user.setCountry(dto.getCountry());
        return userRepository.save(user);
    }

    public User updateMembership(String email, MembershipUpdateDto dto) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (dto.getMembershipLevel() != null)
            user.setMembershipLevel(dto.getMembershipLevel());
        return userRepository.save(user);
    }
}
