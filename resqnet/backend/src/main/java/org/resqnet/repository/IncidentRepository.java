package org.resqnet.repository;

import org.resqnet.model.Incident;
import org.resqnet.model.IncidentCategory;
import org.resqnet.model.IncidentSeverity;
import org.resqnet.model.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    Optional<Incident> findByTrackingCode(String trackingCode);
    List<Incident> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);
    List<Incident> findByAssignedResponderIdOrderByCreatedAtDesc(Long responderId);
    List<Incident> findByStatusOrderByCreatedAtDesc(IncidentStatus status);
    List<Incident> findAllByOrderByCreatedAtDesc();

    List<Incident> findByStatusNotOrderByCreatedAtDesc(IncidentStatus status);

    long countByStatus(IncidentStatus status);
    long countBySeverity(IncidentSeverity severity);
    long countByCategory(IncidentCategory category);

    @Query("SELECT i.category, COUNT(i) FROM Incident i GROUP BY i.category")
    List<Object[]> countGroupByCategory();

    @Query("SELECT i.severity, COUNT(i) FROM Incident i GROUP BY i.severity")
    List<Object[]> countGroupBySeverity();

    @Query("SELECT i.status, COUNT(i) FROM Incident i GROUP BY i.status")
    List<Object[]> countGroupByStatus();

    @Query("SELECT COALESCE(SUM(i.affectedCount), 0) FROM Incident i WHERE i.status = org.resqnet.model.IncidentStatus.RESOLVED")
    long sumRescuedPeopleCount();
}
