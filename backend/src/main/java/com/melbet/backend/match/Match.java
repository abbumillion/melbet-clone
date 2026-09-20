package com.melbet.backend.match;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "matches", indexes = {
        @Index(name = "idx_matches_status", columnList = "status"),
        @Index(name = "idx_matches_league", columnList = "league"),
        @Index(name = "idx_matches_sport", columnList = "sport")
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private SportType sport;

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

    // Sport-specific period label: "Q3", "Set 2", "Round 8", "45'"
    @Column(length = 32)
    private String period;

    // For tennis: sets won
    @Column(nullable = false)
    private int homeSets;

    @Column(nullable = false)
    private int awaySets;

    // For eSports: maps won
    @Column(nullable = false)
    private int homeMaps;

    @Column(nullable = false)
    private int awayMaps;

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