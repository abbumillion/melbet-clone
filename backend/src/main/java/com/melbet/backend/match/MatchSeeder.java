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

        // --- FOOTBALL (Priority: Africa first, then Global) ---
        for (LeagueTeams league : FOOTBALL_LEAGUES) {
            for (int i = 0; i < 3; i++) {
                seeded += seedMatch(league, 180);
            }
        }

        // --- BASKETBALL ---
        for (LeagueTeams league : BASKETBALL_LEAGUES) {
            for (int i = 0; i < 3; i++) {
                seeded += seedMatch(league, 90);
            }
        }

        // --- TENNIS ---
        for (int i = 0; i < 6; i++) {
            seeded += seedMatch(TENNIS_LEAGUE, 120);
        }

        // --- ICE HOCKEY (New) ---
        for (LeagueTeams league : HOCKEY_LEAGUES) {
            for (int i = 0; i < 2; i++) {
                seeded += seedMatch(league, 120);
            }
        }

        // --- VOLLEYBALL (New) ---
        for (int i = 0; i < 4; i++) {
            seeded += seedMatch(VOLLEYBALL_LEAGUE, 120);
        }

        // --- ESPORTS ---
        for (LeagueTeams league : ESPORTS_LEAGUES) {
            for (int i = 0; i < 2; i++) {
                seeded += seedMatch(league, 90);
            }
        }

        log.info("Seeded {} matches across multiple sports and leagues.", seeded);
    }

    private int seedMatch(LeagueTeams league, int spreadMinutes) {
        if (league.teams().size() < 2) return 0;

        String home = league.teams().get(random.nextInt(league.teams().size()));
        String away;
        int attempts = 0;
        do {
            away = league.teams().get(random.nextInt(league.teams().size()));
            attempts++;
        } while (away.equals(home) && attempts < 10);

        if (away.equals(home)) return 0; // Could not find a valid opponent

        long offset;
        double roll = random.nextDouble();
        if (roll < 0.20) {
            offset = -(random.nextInt(60) + 1); // Live/Finished
        } else if (roll < 0.40) {
            offset = random.nextInt(5); // Starting soon
        } else {
            offset = 10 + random.nextInt(spreadMinutes); // Future
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

    // ============================================
    // FOOTBALL LEAGUES
    // ============================================
    private static final List<LeagueTeams> FOOTBALL_LEAGUES = List.of(
            // --- AFRICA / REGIONAL (Priority) ---
            new LeagueTeams("Africa Cup of Nations", SportType.FOOTBALL, List.of(
                    "Ethiopia", "Sudan", "Egypt", "Morocco", "Nigeria", "Ghana",
                    "Senegal", "Ivory Coast", "Cameroon", "Algeria", "Tunisia", "South Africa")),
            new LeagueTeams("Ethiopian Premier League", SportType.FOOTBALL, List.of(
                    "Saint George", "Fasil Kenema", "Sidama Bunna", "Mekelle 70 Enderta",
                    "Wolaitta Dicha", "Adama City", "Hawassa City", "Dire Dawa City")),
            new LeagueTeams("Kenyan Premier League", SportType.FOOTBALL, List.of(
                    "Gor Mahia", "Tusker", "AFC Leopards", "Bandari",
                    "KCB", "Sofapaka", "Kariobangi Sharks", "Wazito")),
            new LeagueTeams("Egyptian Premier League", SportType.FOOTBALL, List.of(
                    "Al Ahly", "Zamalek", "Pyramids FC", "Ismaily",
                    "Al Masry", "Ceramica Cleopatra", "Future FC", "Smouha")),
            new LeagueTeams("CAF Champions League", SportType.FOOTBALL, List.of(
                    "Al Ahly", "Wydad Casablanca", "Mamelodi Sundowns", "ES Tunis",
                    "Simba SC", "CR Belouizdad", "TP Mazembe", "Al Hilal")),

            // --- EUROPEAN TOP LEAGUES ---
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
                    "Bayern Munich", "Borussia Dortmund", "RB Leipzig", "Bayer Leverkusen",
                    "Eintracht Frankfurt", "Wolfsburg", "Freiburg", "Union Berlin")),
            new LeagueTeams("Ligue 1", SportType.FOOTBALL, List.of(
                    "Paris Saint-Germain", "Marseille", "Lyon", "Monaco",
                    "Lille", "Nice", "Rennes", "Lens")),
            new LeagueTeams("UEFA Champions League", SportType.FOOTBALL, List.of(
                    "Real Madrid", "Manchester City", "Bayern Munich", "Paris Saint-Germain",
                    "Liverpool", "Inter Milan", "Barcelona", "Arsenal"))
    );

    // ============================================
    // BASKETBALL LEAGUES
    // ============================================
    private static final List<LeagueTeams> BASKETBALL_LEAGUES = List.of(
            new LeagueTeams("NBA", SportType.BASKETBALL, List.of(
                    "LA Lakers", "Boston Celtics", "Golden State Warriors", "Miami Heat",
                    "Milwaukee Bucks", "Denver Nuggets", "Phoenix Suns", "Dallas Mavericks")),
            new LeagueTeams("EuroLeague", SportType.BASKETBALL, List.of(
                    "Real Madrid", "Barcelona", "Olympiacos", "Panathinaikos",
                    "Fenerbahce", "Anadolu Efes", "Monaco", "Baskonia"))
    );

    // ============================================
    // TENNIS
    // ============================================
    private static final LeagueTeams TENNIS_LEAGUE = new LeagueTeams(
            "ATP Masters", SportType.TENNIS, List.of(
            "Novak Djokovic", "Carlos Alcaraz", "Jannik Sinner", "Daniil Medvedev",
            "Alexander Zverev", "Stefanos Tsitsipas", "Andrey Rublev", "Casper Ruud")
    );

    // ============================================
    // ICE HOCKEY
    // ============================================
    private static final List<LeagueTeams> HOCKEY_LEAGUES = List.of(
            new LeagueTeams("NHL", SportType.FOOTBALL, List.of( // Reusing FOOTBALL type for odds for now
                    "Toronto Maple Leafs", "Montreal Canadiens", "Boston Bruins", "New York Rangers",
                    "Chicago Blackhawks", "Detroit Red Wings", "Edmonton Oilers", "Colorado Avalanche")),
            new LeagueTeams("KHL", SportType.FOOTBALL, List.of(
                    "CSKA Moscow", "SKA Saint Petersburg", "Ak Bars Kazan", "Dynamo Moscow",
                    "Metallurg Magnitogorsk", "Avangard Omsk", "Lokomotiv Yaroslavl", "Salavat Yulaev"))
    );

    // ============================================
    // VOLLEYBALL
    // ============================================
    private static final LeagueTeams VOLLEYBALL_LEAGUE = new LeagueTeams(
            "FIVB Volleyball Nations League", SportType.FOOTBALL, List.of(
            "Brazil", "Italy", "Poland", "France", "USA", "Japan",
            "Serbia", "Argentina", "Germany", "Netherlands")
    );

    // ============================================
    // ESPORTS
    // ============================================
    private static final List<LeagueTeams> ESPORTS_LEAGUES = List.of(
            new LeagueTeams("CS:GO Major", SportType.ESPORTS, List.of(
                    "NAVI", "FaZe Clan", "G2 Esports", "Vitality",
                    "Astralis", "Heroic", "Cloud9", "MOUZ")),
            new LeagueTeams("LoL Worlds", SportType.ESPORTS, List.of(
                    "T1", "Gen.G", "JDG", "BLG", "G2", "Fnatic",
                    "Team Liquid", "DRX")),
            new LeagueTeams("Dota 2 - The International", SportType.ESPORTS, List.of(
                    "Team Spirit", "PSG.LGD", "OG", "Team Secret",
                    "Virtus.pro", "Tundra Esports", "Entity", "Thunder Awaken"))
    );
}