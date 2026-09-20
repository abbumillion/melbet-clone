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

    @Override
    public void run(String... args) {
        if (matchRepository.count() > 0) {
            log.info("Matches already seeded ({} found). Skipping.", matchRepository.count());
            return;
        }

        int seeded = 0;

        // FOOTBALL — 4 leagues × 4 matches
        for (LeagueTeams league : FOOTBALL_LEAGUES) {
            for (int i = 0; i < 4; i++) {
                seeded += seedMatch(league, 30);
            }
        }

        // BASKETBALL
        for (LeagueTeams league : BASKETBALL_LEAGUES) {
            for (int i = 0; i < 3; i++) {
                seeded += seedMatch(league, 60);
            }
        }

        // TENNIS — player vs player
        for (int i = 0; i < 8; i++) {
            seeded += seedMatch(TENNIS_LEAGUE, 45);
        }

        // ATHLETICS — events
        for (int i = 0; i < 4; i++) {
            seeded += seedMatch(ATHLETICS_LEAGUE, 20);
        }

        // ESPORTS
        for (LeagueTeams league : ESPORTS_LEAGUES) {
            for (int i = 0; i < 3; i++) {
                seeded += seedMatch(league, 40);
            }
        }

        log.info("Seeded {} matches across multiple sports", seeded);
    }

    private int seedMatch(LeagueTeams league, int spreadMinutes) {
        String home = league.teams().get(random.nextInt(league.teams().size()));
        String away;
        do {
            away = league.teams().get(random.nextInt(league.teams().size()));
        } while (away.equals(home));

               // Bias toward future matches so more are pre-match with visible odds
        long offset;
        double roll = random.nextDouble();
        if (roll < 0.20) {
            // 20% already started (→ live or finished)
            offset = -(random.nextInt(60) + 1);
        } else if (roll < 0.40) {
            // 20% kick off very soon (→ live shortly)
            offset = random.nextInt(5);
        } else {
            // 60% in the future (→ pre-match, odds visible)
            offset = 10 + random.nextInt(240);
        }
        Instant startTime = Instant.now().plus(Duration.ofMinutes(offset));
       

        double homeStrength = random.nextDouble();
        double[] odds = oddsGenerator.generate1X2Odds(homeStrength);

        Match m = Match.builder()
                .sport(league.sport())
                .league(league.name())
                .homeTeam(home)
                .awayTeam(away)
                .homeScore(0)
                .awayScore(0)
                .minute(0)
                .period(null)
                .homeSets(0)
                .awaySets(0)
                .homeMaps(0)
                .awayMaps(0)
                .status("PRE_MATCH")
                .startTime(startTime)
                .homeOdds(odds[0])
                .drawOdds(odds[1])
                .awayOdds(odds[2])
                .oddsSuspended(false)
                .lastUpdated(Instant.now())
                .build();

        matchRepository.save(m);
        return 1;
    }

    private record LeagueTeams(String name, SportType sport, List<String> teams) {}

    private static final List<LeagueTeams> FOOTBALL_LEAGUES = List.of(
            new LeagueTeams("Premier League", SportType.FOOTBALL, List.of(
                    "Manchester United", "Liverpool", "Arsenal", "Chelsea",
                    "Manchester City", "Tottenham", "Newcastle", "Aston Villa")),
            new LeagueTeams("La Liga", SportType.FOOTBALL, List.of(
                    "Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla",
                    "Valencia", "Real Sociedad", "Villarreal", "Athletic Bilbao")),
            new LeagueTeams("Serie A", SportType.FOOTBALL, List.of(
                    "Juventus", "Inter Milan", "AC Milan", "Napoli",
                    "Roma", "Lazio", "Atalanta", "Fiorentina")),
            new LeagueTeams("Bundesliga", SportType.FOOTBALL, List.of(
                    "Bayern Munich", "Borussia Dortmund", "RB Leipzig",
                    "Bayer Leverkusen", "Eintracht Frankfurt", "Wolfsburg",
                    "Freiburg", "Union Berlin"))
    );

    private static final List<LeagueTeams> BASKETBALL_LEAGUES = List.of(
            new LeagueTeams("NBA", SportType.BASKETBALL, List.of(
                    "LA Lakers", "Boston Celtics", "Golden State Warriors", "Miami Heat",
                    "Milwaukee Bucks", "Denver Nuggets", "Phoenix Suns", "Dallas Mavericks",
                    "New York Knicks", "Philadelphia 76ers")),
            new LeagueTeams("EuroLeague", SportType.BASKETBALL, List.of(
                    "Real Madrid", "Barcelona", "Olympiacos", "Panathinaikos",
                    "Fenerbahce", "Anadolu Efes", "Monaco", "Baskonia"))
    );

    private static final LeagueTeams TENNIS_LEAGUE = new LeagueTeams(
            "ATP Masters", SportType.TENNIS, List.of(
            "Novak Djokovic", "Carlos Alcaraz", "Jannik Sinner", "Daniil Medvedev",
            "Alexander Zverev", "Stefanos Tsitsipas", "Andrey Rublev", "Casper Ruud",
            "Taylor Fritz", "Holger Rune", "Hubert Hurkacz", "Alex de Minaur")
    );

    private static final LeagueTeams ATHLETICS_LEAGUE = new LeagueTeams(
            "Diamond League", SportType.ATHLETICS, List.of(
            "Men's Marathon", "Women's 5000m", "Men's 100m Final",
            "Women's 1500m", "Men's 400m Hurdles", "Women's Long Jump")
    );

    private static final List<LeagueTeams> ESPORTS_LEAGUES = List.of(
            new LeagueTeams("CS:GO Major", SportType.ESPORTS, List.of(
                    "NAVI", "FaZe Clan", "G2 Esports", "Vitality",
                    "Astralis", "Heroic", "Cloud9", "MOUZ")),
            new LeagueTeams("LoL Worlds", SportType.ESPORTS, List.of(
                    "T1", "Gen.G", "JDG", "BLG", "G2", "Fnatic",
                    "Team Liquid", "DRX"))
    );
}
