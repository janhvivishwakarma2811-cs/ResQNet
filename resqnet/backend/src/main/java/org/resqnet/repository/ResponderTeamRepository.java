package org.resqnet.repository;

import org.resqnet.model.ResponderStatus;
import org.resqnet.model.ResponderTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResponderTeamRepository extends JpaRepository<ResponderTeam, Long> {
    Optional<ResponderTeam> findByUserId(Long userId);
    List<ResponderTeam> findByStatus(ResponderStatus status);
    long countByStatus(ResponderStatus status);
}
