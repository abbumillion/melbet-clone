package com.melbet.backend.match;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchSimulator {

    private final MatchRepository matchRepository;
    private final OddsGenerator oddsGenerator;
    private final Random random = new Random();

    @Scheduled(fixedRate = 10_000)
    @Transactional
    public void tick() {
        // 1) Kick off any PRE_MATCH whose time has arrived
        List<Match> preMatch = matchRepository.findByStatus("PRE_MATCH");
        for (Match m : preMatch) {
            if (m.getStartTime().isBefore(Instant.now())) {
                m.setStatus("LIVE");
                m.setMinute(0);
                m.setPeriod(initialPeriod(m.getSport()));
                m.setLastUpdated(Instant.now());
                log.info("Kickoff: {} vs {} ({})", m.getHomeTeam(), m.getAwayTeam(), m.getLeague());
            }
        }
        matchRepository.saveAll(preMatch);

        // 2) Tick live matches by sport
        List<Match> live = matchRepository.findByStatusIn(List.of("LIVE", "HT"));
        for (Match m : live) {
            switch (m.getSport()) {
                case FOOTBALL -> tickFootball(m);
                case BASKETBALL -> tickBasketball(m);
                case TENNIS -> tickTennis(m);
                case ATHLETICS -> tickAthletics(m);
                case ESPORTS -> tickEsports(m);
            }
            m.setLastUpdated(Instant.now());
        }
        matchRepository.saveAll(live);

        // 3) Drift pre-match odds
        for (Match m : preMatch) {
            if (!"PRE_MATCH".equals(m.getStatus())) continue;
            if (m.isOddsSuspended() || random.nextDouble() >= 0.3) continue;
            m.setHomeOdds(oddsGenerator.driftOdds(m.getHomeOdds()));
            m.setDrawOdds(oddsGenerator.driftOdds(m.getDrawOdds()));
            m.setAwayOdds(oddsGenerator.driftOdds(m.getAwayOdds()));
            m.setLastUpdated(Instant.now());
        }
        matchRepository.saveAll(preMatch);
    }

    // ---------------- FOOTBALL ----------------
    private void tickFootball(Match m) {
        if ("HT".equals(m.getStatus())) {
            if (random.nextDouble() < 0.5) {
                m.setStatus("LIVE");
                m.setMinute(46);
                m.setPeriod("46'");
            }
            return;
        }
        m.setMinute(m.getMinute() + 1);
        m.setPeriod(m.getMinute() + "'");

        if (random.nextDouble() < 0.03) {
            boolean home = random.nextDouble() < 0.55;
            if (home) m.setHomeScore(m.getHomeScore() + 1);
            else m.setAwayScore(m.getAwayScore() + 1);
            m.setOddsSuspended(true);
            recalcOdds(m);
        } else if (m.isOddsSuspended()) {
            m.setOddsSuspended(false);
        } else if (random.nextDouble() < 0.4) {
            driftOdds(m);
        }

        if (m.getMinute() == 45) m.setStatus("HT");
        if (m.getMinute() >= 90) {
            m.setStatus("FT");
            m.setPeriod("FT");
            m.setOddsSuspended(true);
        }
    }

    // ---------------- BASKETBALL ----------------
    private void tickBasketball(Match m) {
        // 4 quarters × 12 min = 48 simulated minutes
        m.setMinute(m.getMinute() + 1);
        int q = Math.min(4, (m.getMinute() / 12) + 1);
        m.setPeriod("Q" + q);

        // ~2-4 points per team per minute
        int homePts = 2 + random.nextInt(3);
        int awayPts = 2 + random.nextInt(3);
        m.setHomeScore(m.getHomeScore() + homePts);
        m.setAwayScore(m.getAwayScore() + awayPts);

        if (random.nextDouble() < 0.3) driftOdds(m);

        if (m.getMinute() >= 48) {
            // Basketball never ends in a draw; simulate OT if tied
            if (m.getHomeScore() == m.getAwayScore()) {
                m.setHomeScore(m.getHomeScore() + random.nextInt(8) + 1);
                m.setAwayScore(m.getAwayScore() + random.nextInt(8));
            }
            m.setStatus("FT");
            m.setPeriod("FT");
            m.setOddsSuspended(true);
        }
    }

    // ---------------- TENNIS ----------------
    private void tickTennis(Match m) {
        // Each tick = 1 game. Best of 3 sets → first to 2 sets wins.
        // Track sets in homeSets/awaySets, "score" holds games in current set.
        m.setMinute(m.getMinute() + 1);
        m.setPeriod("Set " + (m.getHomeSets() + m.getAwaySets() + 1));

        boolean homeWins = random.nextDouble() < 0.5;
        if (homeWins) m.setHomeScore(m.getHomeScore() + 1);
        else m.setAwayScore(m.getAwayScore() + 1);

        // Set won at 6 games (simplified, no deuce)
        if (m.getHomeScore() >= 6) {
            m.setHomeSets(m.getHomeSets() + 1);
            m.setHomeScore(0);
            m.setAwayScore(0);
        } else if (m.getAwayScore() >= 6) {
            m.setAwaySets(m.getAwaySets() + 1);
            m.setHomeScore(0);
            m.setAwayScore(0);
        }

        if (random.nextDouble() < 0.3) driftOdds(m);

        if (m.getHomeSets() == 2 || m.getAwaySets() == 2) {
            m.setStatus("FT");
            m.setPeriod("FT");
            m.setOddsSuspended(true);
        }
    }

    // ---------------- ATHLETICS ----------------
    private void tickAthletics(Match m) {
        // Event has no opponent. Simulate a countdown to finish.
        m.setMinute(m.getMinute() + 1);
        m.setPeriod("Running");

        if (random.nextDouble() < 0.2) driftOdds(m);

        if (m.getMinute() >= 30) {
            m.setStatus("FT");
            m.setPeriod("Finished");
            m.setOddsSuspended(true);
            // Assign a winner flag via scores (1 = winner)
            if (random.nextDouble() < 0.5) m.setHomeScore(1);
            else m.setAwayScore(1);
        }
    }

    // ---------------- ESPORTS ----------------
    private void tickEsports(Match m) {
        // Best of 3 maps. Each tick = 1 round within the current map.
        m.setMinute(m.getMinute() + 1);
        m.setPeriod("Map " + (m.getHomeMaps() + m.getAwayMaps() + 1));

        boolean homeWinsRound = random.nextDouble() < 0.5;
        if (homeWinsRound) m.setHomeScore(m.getHomeScore() + 1);
        else m.setAwayScore(m.getAwayScore() + 1);

        // Map won at 16 rounds (CS:GO style)
        if (m.getHomeScore() >= 16) {
            m.setHomeMaps(m.getHomeMaps() + 1);
            m.setHomeScore(0);
            m.setAwayScore(0);
        } else if (m.getAwayScore() >= 16) {
            m.setAwayMaps(m.getAwayMaps() + 1);
            m.setHomeScore(0);
            m.setAwayScore(0);
        }

        if (random.nextDouble() < 0.3) driftOdds(m);

        if (m.getHomeMaps() == 2 || m.getAwayMaps() == 2) {
            m.setStatus("FT");
            m.setPeriod("FT");
            m.setOddsSuspended(true);
        }
    }

    // ---------------- HELPERS ----------------
    private void recalcOdds(Match m) {
        double strength = computeStrength(m);
        double[] odds = oddsGenerator.generate1X2Odds(strength);
        m.setHomeOdds(odds[0]);
        m.setDrawOdds(odds[1]);
        m.setAwayOdds(odds[2]);
    }

    private void driftOdds(Match m) {
        m.setHomeOdds(oddsGenerator.driftOdds(m.getHomeOdds()));
        m.setDrawOdds(oddsGenerator.driftOdds(m.getDrawOdds()));
        m.setAwayOdds(oddsGenerator.driftOdds(m.getAwayOdds()));
    }

    private double computeStrength(Match m) {
        int remaining = Math.max(0, 90 - m.getMinute());
        int diff = m.getHomeScore() - m.getAwayScore();
        double base = 0.5 + (diff * 0.15);
        double time = 1.0 - (remaining / 90.0);
        return Math.max(0.05, Math.min(0.95, base + (time * 0.05)));
    }

    private String initialPeriod(SportType sport) {
        return switch (sport) {
            case FOOTBALL -> "0'";
            case BASKETBALL -> "Q1";
            case TENNIS -> "Set 1";
            case ATHLETICS -> "Running";
            case ESPORTS -> "Map 1";
        };
    }
}