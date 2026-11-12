package org.resqnet.service;

import org.resqnet.dto.DashboardStatsDto;
import org.resqnet.model.IncidentSeverity;
import org.resqnet.model.IncidentStatus;
import org.resqnet.model.ResponderStatus;
import org.resqnet.repository.IncidentRepository;
import org.resqnet.repository.ResponderTeamRepository;
import org.resqnet.repository.ShelterRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final IncidentRepository incidentRepository;
    private final ResponderTeamRepository responderTeamRepository;
    private final ShelterRepository shelterRepository;

    public AnalyticsService(IncidentRepository incidentRepository,
                            ResponderTeamRepository responderTeamRepository,
                            ShelterRepository shelterRepository) {
        this.incidentRepository = incidentRepository;
        this.responderTeamRepository = responderTeamRepository;
        this.shelterRepository = shelterRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        long total = incidentRepository.count();
        long resolved = incidentRepository.countByStatus(IncidentStatus.RESOLVED);
        long active = total - resolved - incidentRepository.countByStatus(IncidentStatus.CANCELLED);
        long critical = incidentRepository.countBySeverity(IncidentSeverity.CRITICAL);
        long rescued = incidentRepository.sumRescuedPeopleCount();

        long activeResponders = responderTeamRepository.countByStatus(ResponderStatus.AVAILABLE)
                + responderTeamRepository.countByStatus(ResponderStatus.DISPATCHED)
                + responderTeamRepository.countByStatus(ResponderStatus.ON_SCENE);

        long shelterCapacity = shelterRepository.sumTotalCapacity();
        long shelterOccupants = shelterRepository.sumTotalOccupants();

        // Categorical breakdowns
        Map<String, Long> categoryMap = new HashMap<>();
        List<Object[]> categoryData = incidentRepository.countGroupByCategory();
        for (Object[] row : categoryData) {
            categoryMap.put(row[0].toString(), (Long) row[1]);
        }

        Map<String, Long> severityMap = new HashMap<>();
        List<Object[]> severityData = incidentRepository.countGroupBySeverity();
        for (Object[] row : severityData) {
            severityMap.put(row[0].toString(), (Long) row[1]);
        }

        Map<String, Long> statusMap = new HashMap<>();
        List<Object[]> statusData = incidentRepository.countGroupByStatus();
        for (Object[] row : statusData) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }

        stats.setTotalIncidents(total);
        stats.setActiveIncidents(Math.max(0, active));
        stats.setResolvedIncidents(resolved);
        stats.setCriticalIncidents(critical);
        stats.setTotalRescuedPeople(rescued);
        stats.setActiveResponders(activeResponders);
        stats.setTotalShelterCapacity(shelterCapacity);
        stats.setCurrentShelterOccupants(shelterOccupants);
        stats.setIncidentsByCategory(categoryMap);
        stats.setIncidentsBySeverity(severityMap);
        stats.setIncidentsByStatus(statusMap);

        return stats;
    }
}
