package com.melbet.backend.match;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class OddsGenerator {

    private final Random random = new Random();

    /**
     * Generates realistic 1X2 odds for a football match.
     * Uses an implied probability + overround (bookmaker margin).
     */
    public double[] generate1X2Odds(double homeStrength) {
        // homeStrength: 0.0 (weak home) to 1.0 (strong home)
        double homeProb = 0.30 + (homeStrength * 0.40);   // 0.30 – 0.70
        double drawProb = 0.22 + (random.nextDouble() * 0.08); // 0.22 – 0.30
        double awayProb = 1.0 - homeProb - drawProb;

        // Overround: 5–8% margin
        double margin = 0.05 + (random.nextDouble() * 0.03);
        double total = homeProb + drawProb + awayProb;
        double scale = (1.0 + margin) / total;

        double homeOdds = round2(1.0 / (homeProb * scale));
        double drawOdds = round2(1.0 / (drawProb * scale));
        double awayOdds = round2(1.0 / (awayProb * scale));

        // Clamp to realistic bounds
        homeOdds = clamp(homeOdds, 1.05, 20.0);
        drawOdds = clamp(drawOdds, 1.05, 20.0);
        awayOdds = clamp(awayOdds, 1.05, 20.0);

        return new double[]{homeOdds, drawOdds, awayOdds};
    }

    /**
     * Drifts an odd by a small amount, keeping it within bounds.
     */
    public double driftOdds(double current) {
        double delta = (random.nextDouble() - 0.5) * 0.10; // ±0.05
        double next = current + delta;
        return round2(clamp(next, 1.05, 20.0));
    }

    private double clamp(double v, double min, double max) {
        return Math.max(min, Math.min(max, v));
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
