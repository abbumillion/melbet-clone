package com.melbet.backend.match;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class MatchSeeder implements CommandLineRunner {

    private final MatchRepository matchRepository;
    private final OddsGenerator oddsGenerator;
    private final Random random = new Random();

    private static final List<LeagueTeams> LEAGUES = List.of(
            new LeagueTeams("Premier League", "FOOTBALL", List.of(
                    "Manchester United", "Liverpool", "Arsenal", "Chelsea",
                    "Manchester City", "Tottenham", "Newcastle", "Aston Villa")),
            new LeagueTeams("La Liga", "FOOTBALL", List.of(
                    "Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla",
                    "Valencia", "Real Sociedad", "Villarreal", "Athletic Bilbao")),
            new LeagueTeams("Serie A", "FOOTBALL", List.of(
                    "Juventus", "Inter Milan", "AC Milan", "Napoli",
                    "Roma", "Lazio", "Atalanta", "Fiorentina")),
            new LeagueTeams("Bundesliga", "FOOTBALL", List.of(
                    "Bayern Munich", "Borussia Dortmund", "RB Leipzig",
                    "Bayer Leverkusen", "Eintracht Frankfurt", "Wolfsburg",
                    "Freiburg", "Union Berlin"))
    );

    @Override
    public void run(String... args) {
        if (matchRepository.count() > 0) {
            log.info("Matches already seeded ({} found). Skipping.", matchRepository.count());
            return;
        }

        int seeded = 0;
        for (LeagueTeams league : LEAGUES) {
            for (int i = 0; i < 4; i++) {
                String home = league.teams().get(random.nextInt(league.teams().size()));
                String away;
                do {
                    away = league.teams().get(random.nextInt(league.teams().size()));
                } while (away.equals(home));

                // Spread kickoff times: some in the past (→ live), some in the future
                long offsetMinutes = random.nextInt(30) - 5; // -5 to +25 minutes
                Instant startTime = Instant.now().plus(Duration.ofMinutes(offsetMinutes));

                double homeStrength = random.nextDouble();
                double[] odds = oddsGenerator.generate1X2Odds(homeStrength);

                Match match = Match.builder()
                        .sport(league.sport())
                        .league(league.name())
                        .homeTeam(home)
                        .awayTeam(away)
                        .homeScore(0)
                        .awayScore(0)
                        .minute(0)
                        .status("PRE_MATCH")
                        .startTime(startTime)
                        .homeOdds(odds[0])
                        .drawOdds(odds[1])
                        .awayOdds(odds[2])
                        .oddsSuspended(false)
                        .lastUpdated(Instant.now())
                        .build();

                matchRepository.save(match);
                seeded++;
            }
        }
        log.info("Seeded {} matches across {} leagues", seeded, LEAGUES.size());
    }

    private record LeagueTeams(String name, String sport, List<String> teams) {}
}
