package com.melbet.backend.auth;

import com.melbet.backend.auth.dto.AuthResponse;
import com.melbet.backend.auth.dto.LoginRequest;
import com.melbet.backend.auth.dto.RegisterRequest;
import com.melbet.backend.auth.jwt.JwtService;
import com.melbet.backend.user.Role;
import com.melbet.backend.user.User;
import com.melbet.backend.user.UserRepository;
import com.melbet.backend.verification.VerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final VerificationService verificationService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .email(email)
                .phone(request.phone())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .emailVerified(false)
                .phoneVerified(false)
                .build();

        userRepository.save(user);

        String code = verificationService.generateCode(email, "EMAIL");
        log.info("Verification code for {}: {}", email, code);

        // In the next step, this gets replaced with a real email send.
        return new AuthResponse(
                null,
                user.getEmail(),
                user.getRole().name(),
                false,
                "Registration successful. Check your email for the verification code."
        );
    }

    @Transactional
    public AuthResponse verify(String email, String code) {
        String normalizedEmail = email.toLowerCase().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.isEmailVerified()) {
            return new AuthResponse(null, user.getEmail(), user.getRole().name(), true,
                    "Already verified. You can log in.");
        }

        boolean ok = verificationService.verifyCode(normalizedEmail, code);
        if (!ok) {
            throw new IllegalArgumentException("Invalid or expired verification code");
        }

        user.setEmailVerified(true);
        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getRole().name(), true,
                "Email verified successfully");
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.email().toLowerCase().trim();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        if (!user.isEmailVerified()) {
            throw new BadCredentialsException("Email not verified. Please verify first.");
        }

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getRole().name(), true,
                "Login successful");
    }
}
