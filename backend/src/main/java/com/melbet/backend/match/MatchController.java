package com.melbet.backend.match;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchRepository matchRepository;

    @GetMapping
    public List<Match> all() {
        return matchRepository.findAll();
    }

    @GetMapping("/live")
    public List<Match> live() {
        return matchRepository.findByStatusIn(List.of("LIVE", "HT"));
    }

    @GetMapping("/upcoming")
    public List<Match> upcoming() {
        return matchRepository.findByStatus("PRE_MATCH");
    }

    @GetMapping("/sport/{sport}")
    public List<Match> bySport(@PathVariable String sport) {
        return matchRepository.findBySport(sport.toUpperCase());
    }
}
