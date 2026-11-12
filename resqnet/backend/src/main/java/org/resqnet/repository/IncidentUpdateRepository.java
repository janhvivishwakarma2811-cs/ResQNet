package org.resqnet.repository;

import org.resqnet.model.IncidentUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentUpdateRepository extends JpaRepository<IncidentUpdate, Long> {

    @Query("SELECT u FROM IncidentUpdate u WHERE u.incident.id = :incidentId ORDER BY u.createdAt ASC")
    List<IncidentUpdate> findByIncidentIdOrderByCreatedAtAsc(@Param("incidentId") Long incidentId);
}
