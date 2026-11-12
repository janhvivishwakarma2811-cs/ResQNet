package org.resqnet.dto;

import java.util.Map;

public class DashboardStatsDto {
    private long totalIncidents;
    private long activeIncidents;
    private long resolvedIncidents;
    private long criticalIncidents;
    private long totalRescuedPeople;
    private long activeResponders;
    private long totalShelterCapacity;
    private long currentShelterOccupants;
    private Map<String, Long> incidentsByCategory;
    private Map<String, Long> incidentsBySeverity;
    private Map<String, Long> incidentsByStatus;

    public DashboardStatsDto() {}

    public long getTotalIncidents() { return totalIncidents; }
    public void setTotalIncidents(long totalIncidents) { this.totalIncidents = totalIncidents; }

    public long getActiveIncidents() { return activeIncidents; }
    public void setActiveIncidents(long activeIncidents) { this.activeIncidents = activeIncidents; }

    public long getResolvedIncidents() { return resolvedIncidents; }
    public void setResolvedIncidents(long resolvedIncidents) { this.resolvedIncidents = resolvedIncidents; }

    public long getCriticalIncidents() { return criticalIncidents; }
    public void setCriticalIncidents(long criticalIncidents) { this.criticalIncidents = criticalIncidents; }

    public long getTotalRescuedPeople() { return totalRescuedPeople; }
    public void setTotalRescuedPeople(long totalRescuedPeople) { this.totalRescuedPeople = totalRescuedPeople; }

    public long getActiveResponders() { return activeResponders; }
    public void setActiveResponders(long activeResponders) { this.activeResponders = activeResponders; }

    public long getTotalShelterCapacity() { return totalShelterCapacity; }
    public void setTotalShelterCapacity(long totalShelterCapacity) { this.totalShelterCapacity = totalShelterCapacity; }

    public long getCurrentShelterOccupants() { return currentShelterOccupants; }
    public void setCurrentShelterOccupants(long currentShelterOccupants) { this.currentShelterOccupants = currentShelterOccupants; }

    public Map<String, Long> getIncidentsByCategory() { return incidentsByCategory; }
    public void setIncidentsByCategory(Map<String, Long> incidentsByCategory) { this.incidentsByCategory = incidentsByCategory; }

    public Map<String, Long> getIncidentsBySeverity() { return incidentsBySeverity; }
    public void setIncidentsBySeverity(Map<String, Long> incidentsBySeverity) { this.incidentsBySeverity = incidentsBySeverity; }

    public Map<String, Long> getIncidentsByStatus() { return incidentsByStatus; }
    public void setIncidentsByStatus(Map<String, Long> incidentsByStatus) { this.incidentsByStatus = incidentsByStatus; }
}
