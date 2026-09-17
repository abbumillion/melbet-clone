package com.melbet.backend.verification;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int MAX_ATTEMPTS = 5;

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${app.email.verification-expiry-minutes:15}")
    private long expiryMinutes;

    public String generateCode(String target, String type) {
        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        VerificationCode vc = VerificationCode.builder()
                .code(code)
                .target(target)
                .type(type)
                .expiresAt(Instant.now().plus(Duration.ofMinutes(expiryMinutes)))
                .attempts(0)
                .build();
        redisTemplate.opsForValue().set(key(target), vc, Duration.ofMinutes(expiryMinutes));
        return code;
    }

    public boolean verifyCode(String target, String submitted) {
        String key = key(target);
        Object raw = redisTemplate.opsForValue().get(key);
        if (!(raw instanceof VerificationCode vc)) {
            return false;
        }
        if (vc.getExpiresAt().isBefore(Instant.now())) {
            redisTemplate.delete(key);
            return false;
        }
        if (!vc.getCode().equals(submitted)) {
            vc.setAttempts(vc.getAttempts() + 1);
            if (vc.getAttempts() >= MAX_ATTEMPTS) {
                redisTemplate.delete(key);
            } else {
                long ttl = Math.max(1, Duration.between(Instant.now(), vc.getExpiresAt()).toSeconds());
                redisTemplate.opsForValue().set(key, vc, Duration.ofSeconds(ttl));
            }
            return false;
        }
        redisTemplate.delete(key);
        return true;
    }

    private String key(String target) {
        return "verify:" + target.toLowerCase();
    }
}
