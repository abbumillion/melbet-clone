package com.melbet.backend.match;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByStatus(String status);

    List<Match> findByStatusIn(List<String> statuses);

    List<Match> findBySport(String sport);
}
