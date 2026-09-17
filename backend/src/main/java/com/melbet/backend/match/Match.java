package com.melbet.backend.match;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "matches", indexes = {
        @Index(name = "idx_matches_status", columnList = "status"),
        @Index(name = "idx_matches_league", columnList = "league")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String sport;              // FOOTBALL, BASKETBALL, TENNIS

    @Column(nullable = false, length = 128)
    private String league;

    @Column(nullable = false, length = 128)
    private String homeTeam;

    @Column(nullable = false, length = 128)
    private String awayTeam;

    @Column(nullable = false)
    private int homeScore;

    @Column(nullable = false)
    private int awayScore;

    @Column(nullable = false)
    private int minute;

    @Column(nullable = false, length = 16)
    private String status;             // PRE_MATCH, LIVE, HT, FT

    @Column(nullable = false)
    private Instant startTime;

    @Column(nullable = false)
    private double homeOdds;

    @Column(nullable = false)
    private double drawOdds;

    @Column(nullable = false)
    private double awayOdds;

    @Column(nullable = false)
    private boolean oddsSuspended;

    @Column(nullable = false)
    private Instant lastUpdated;
}
