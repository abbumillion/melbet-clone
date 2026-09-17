package com.melbet.backend.verification;

import lombok.*;

import java.io.Serializable;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationCode implements Serializable {
    private String code;
    private String target;       // email or phone
    private String type;         // EMAIL or PHONE
    private Instant expiresAt;
    private int attempts;
}
