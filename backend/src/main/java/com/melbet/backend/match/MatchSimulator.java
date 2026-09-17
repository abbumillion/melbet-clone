package com.melbet.backend.match;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
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

    /**
     * Runs every 10 real seconds. Each tick = ~1 simulated minute.
     * A full 90-minute match takes ~15 real minutes.
     */
    @Scheduled(fixedRate = 10_000)
    @Transactional
    public void tick() {
        List<Match> liveMatches = matchRepository.findByStatusIn(List.of("LIVE", "HT"));

        for (Match m : liveMatches) {
            updateLiveMatch(m);
        }

        // Kick off matches whose start time has passed
        List<Match> preMatch = matchRepository.findByStatus("PRE_MATCH");
        for (Match m : preMatch) {
            if (m.getStartTime().isBefore(Instant.now())) {
                m.setStatus("LIVE");
                m.setMinute(0);
                m.setLastUpdated(Instant.now());
                log.info("Kickoff: {} vs {} ({})", m.getHomeTeam(), m.getAwayTeam(), m.getLeague());
            }
        }

        // Drift pre-match odds slightly
        for (Match m : preMatch) {
            if (!m.isOddsSuspended() && random.nextDouble() < 0.3) {
                m.setHomeOdds(oddsGenerator.driftOdds(m.getHomeOdds()));
                m.setDrawOdds(oddsGenerator.driftOdds(m.getDrawOdds()));
                m.setAwayOdds(oddsGenerator.driftOdds(m.getAwayOdds()));
                m.setLastUpdated(Instant.now());
            }
        }

        matchRepository.saveAll(liveMatches);
        matchRepository.saveAll(preMatch);
    }

    private void updateLiveMatch(Match m) {
        if ("HT".equals(m.getStatus())) {
            // Halftime lasts ~2 real ticks (20s)
            if (random.nextDouble() < 0.5) {
                m.setStatus("LIVE");
                m.setMinute(46);
                log.info("Second half started: {} vs {}", m.getHomeTeam(), m.getAwayTeam());
            }
            m.setLastUpdated(Instant.now());
            return;
        }

        // Advance the minute
        m.setMinute(m.getMinute() + 1);

        // Goal probability: ~3% per simulated minute
        if (random.nextDouble() < 0.03) {
            boolean homeScores = random.nextDouble() < 0.55; // slight home advantage
            if (homeScores) {
                m.setHomeScore(m.getHomeScore() + 1);
                log.info("GOAL! {} {} - {} {} ({}')",
                        m.getHomeTeam(), m.getHomeScore(),
                        m.getAwayScore(), m.getAwayTeam(), m.getMinute());
            } else {
                m.setAwayScore(m.getAwayScore() + 1);
                log.info("GOAL! {} {} - {} {} ({}')",
                        m.getHomeTeam(), m.getHomeScore(),
                        m.getAwayScore(), m.getAwayTeam(), m.getMinute());
            }

            // Suspend odds briefly after a goal
            m.setOddsSuspended(true);

            // Recalculate odds based on new score and time remaining
            double homeStrength = computeHomeStrength(m);
            double[] newOdds = oddsGenerator.generate1X2Odds(homeStrength);
            m.setHomeOdds(newOdds[0]);
            m.setDrawOdds(newOdds[1]);
            m.setAwayOdds(newOdds[2]);
        } else if (!m.isOddsSuspended() && random.nextDouble() < 0.4) {
            // Small drift on live odds
            m.setHomeOdds(oddsGenerator.driftOdds(m.getHomeOdds()));
            m.setDrawOdds(oddsGenerator.driftOdds(m.getDrawOdds()));
            m.setAwayOdds(oddsGenerator.driftOdds(m.getAwayOdds()));
        } else if (m.isOddsSuspended()) {
            // Re-open odds after 1 tick
            m.setOddsSuspended(false);
        }

        // Halftime at 45'
        if (m.getMinute() == 45) {
            m.setStatus("HT");
            log.info("HT: {} {} - {} {}", m.getHomeTeam(), m.getHomeScore(),
                    m.getAwayScore(), m.getAwayTeam());
        }

        // Full time at 90'
        if (m.getMinute() >= 90) {
            m.setStatus("FT");
            m.setOddsSuspended(true);
            log.info("FT: {} {} - {} {}", m.getHomeTeam(), m.getHomeScore(),
                    m.getAwayScore(), m.getAwayTeam());
        }

        m.setLastUpdated(Instant.now());
    }

    /**
     * Estimates current home strength based on score + time remaining.
     * Used to recompute odds after a goal.
     */
    private double computeHomeStrength(Match m) {
        int remaining = Math.max(0, 90 - m.getMinute());
        int goalDiff = m.getHomeScore() - m.getAwayScore();
        double base = 0.5;
        double goalEffect = goalDiff * 0.15;
        double timeFactor = 1.0 - (remaining / 90.0);
        return Math.max(0.05, Math.min(0.95, base + goalEffect + (timeFactor * 0.05)));
    }
}
