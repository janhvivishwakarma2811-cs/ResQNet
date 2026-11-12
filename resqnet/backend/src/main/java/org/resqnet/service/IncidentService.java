package org.resqnet.service;

import org.resqnet.dto.IncidentCreateRequest;
import org.resqnet.dto.IncidentDispatchDto;
import org.resqnet.dto.IncidentStatusUpdateRequest;
import org.resqnet.model.*;
import org.resqnet.repository.IncidentRepository;
import org.resqnet.repository.IncidentUpdateRepository;
import org.resqnet.repository.ResponderTeamRepository;
import org.resqnet.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final IncidentUpdateRepository updateRepository;
    private final UserRepository userRepository;
    private final ResponderTeamRepository responderTeamRepository;
    private final NotificationService notificationService;

    public IncidentService(IncidentRepository incidentRepository,
                           IncidentUpdateRepository updateRepository,
                           UserRepository userRepository,
                           ResponderTeamRepository responderTeamRepository,
                           NotificationService notificationService) {
        this.incidentRepository = incidentRepository;
        this.updateRepository = updateRepository;
        this.userRepository = userRepository;
        this.responderTeamRepository = responderTeamRepository;
        this.notificationService = notificationService;
    }

    private String generateTrackingCode() {
        int randomNum = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "RSQ-" + (Instant.now().getEpochSecond() % 100000) + "-" + randomNum;
    }

    public static double haversineDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round((R * c) * 100.0) / 100.0;
    }

    @Transactional
    public Incident createIncident(IncidentCreateRequest request, String username) {
        User citizen = null;
        if (username != null) {
            citizen = userRepository.findByUsername(username).orElse(null);
        }

        Incident incident = new Incident();
        incident.setTrackingCode(generateTrackingCode());
        incident.setCitizen(citizen);
        incident.setTitle(request.getTitle());
        incident.setCategory(request.getCategory());
        incident.setSeverity(request.getSeverity());
        incident.setDescription(request.getDescription());
        incident.setAffectedCount(request.getAffectedCount() != null ? request.getAffectedCount() : 1);
        incident.setContactPhone(request.getContactPhone());
        incident.setLatitude(request.getLatitude());
        incident.setLongitude(request.getLongitude());
        incident.setAddress(request.getAddress());
        incident.setImageUrl(request.getImageUrl());
        incident.setStatus(IncidentStatus.REPORTED);
        incident.setCreatedAt(Instant.now());
        incident.setUpdatedAt(Instant.now());

        Incident saved = incidentRepository.save(incident);

        // Initial timeline update
        IncidentUpdate initialUpdate = new IncidentUpdate(
                saved,
                citizen,
                null,
                IncidentStatus.REPORTED,
                "Emergency incident logged via ResQNet portal."
        );
        updateRepository.save(initialUpdate);

        // Broadcast to WebSocket clients
        notificationService.broadcastIncident(saved);

        return saved;
    }

    @Transactional
    public Incident triggerSos(Double latitude, Double longitude, String address, String username) {
        User citizen = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Incident incident = new Incident();
        incident.setTrackingCode(generateTrackingCode());
        incident.setCitizen(citizen);
        incident.setTitle("EMERGENCY SOS: Panic Button Triggered by " + citizen.getFullName());
        incident.setCategory(IncidentCategory.OTHER);
        incident.setSeverity(IncidentSeverity.CRITICAL);
        incident.setDescription("Urgent SOS panic signal initiated with immediate GPS coordinates. Immediate responder intervention needed!");
        incident.setAffectedCount(1);
        incident.setContactPhone(citizen.getPhone() != null ? citizen.getPhone() : "Not provided");
        incident.setLatitude(latitude != null ? latitude : 28.6139);
        incident.setLongitude(longitude != null ? longitude : 77.2090);
        incident.setAddress(address != null ? address : "Coordinates: " + latitude + ", " + longitude);
        incident.setStatus(IncidentStatus.REPORTED);
        incident.setCreatedAt(Instant.now());
        incident.setUpdatedAt(Instant.now());

        Incident saved = incidentRepository.save(incident);

        IncidentUpdate update = new IncidentUpdate(
                saved,
                citizen,
                null,
                IncidentStatus.REPORTED,
                "CRITICAL: SOS Panic Button pressed. Dispatching teams notified."
        );
        updateRepository.save(update);

        notificationService.broadcastIncident(saved);
        return saved;
    }

    @Transactional
    public Incident updateStatus(Long incidentId, IncidentStatusUpdateRequest request, String username) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new NoSuchElementException("Incident not found with ID: " + incidentId));

        User user = userRepository.findByUsername(username).orElse(null);
        IncidentStatus previousStatus = incident.getStatus();
        incident.setStatus(request.getStatus());
        incident.setUpdatedAt(Instant.now());

        if (request.getStatus() == IncidentStatus.RESOLVED) {
            incident.setResolvedAt(Instant.now());
            if (incident.getAssignedResponder() != null) {
                ResponderTeam team = incident.getAssignedResponder();
                int current = team.getActiveIncidentCount() != null ? team.getActiveIncidentCount() : 1;
                team.setActiveIncidentCount(Math.max(0, current - 1));
                if (team.getActiveIncidentCount() == 0) {
                    team.setStatus(ResponderStatus.AVAILABLE);
                }
                responderTeamRepository.save(team);
            }
        }

        Incident saved = incidentRepository.save(incident);

        IncidentUpdate update = new IncidentUpdate(
                saved,
                user,
                previousStatus,
                request.getStatus(),
                request.getNote() != null ? request.getNote() : "Status updated to " + request.getStatus()
        );
        updateRepository.save(update);

        notificationService.broadcastIncident(saved);
        notificationService.broadcastIncidentUpdate(saved.getId(), update);

        return saved;
    }

    @Transactional
    public Incident dispatchResponder(Long incidentId, IncidentDispatchDto dto, String username) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new NoSuchElementException("Incident not found: " + incidentId));

        ResponderTeam responder = responderTeamRepository.findById(dto.getResponderTeamId())
                .orElseThrow(() -> new NoSuchElementException("Responder team not found: " + dto.getResponderTeamId()));

        User dispatcher = userRepository.findByUsername(username).orElse(null);
        IncidentStatus prev = incident.getStatus();

        incident.setAssignedResponder(responder);
        incident.setStatus(IncidentStatus.DISPATCHED);
        incident.setUpdatedAt(Instant.now());

        responder.setStatus(ResponderStatus.DISPATCHED);
        responder.setActiveIncidentCount((responder.getActiveIncidentCount() != null ? responder.getActiveIncidentCount() : 0) + 1);
        responderTeamRepository.save(responder);

        Incident saved = incidentRepository.save(incident);

        String note = (dto.getDispatchNote() != null && !dto.getDispatchNote().isBlank())
                ? dto.getDispatchNote()
                : "Assigned rescue unit: " + responder.getTeamName() + " (" + responder.getSpecialization() + ")";

        IncidentUpdate update = new IncidentUpdate(saved, dispatcher, prev, IncidentStatus.DISPATCHED, note);
        updateRepository.save(update);

        notificationService.broadcastIncident(saved);
        notificationService.broadcastIncidentUpdate(saved.getId(), update);

        return saved;
    }

    public List<Map<String, Object>> getNearbyResponders(Double lat, Double lng) {
        List<ResponderTeam> responders = responderTeamRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (ResponderTeam r : responders) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("teamName", r.getTeamName());
            map.put("specialization", r.getSpecialization());
            map.put("status", r.getStatus());
            map.put("currentLatitude", r.getCurrentLatitude());
            map.put("currentLongitude", r.getCurrentLongitude());
            map.put("vehicleType", r.getVehicleType());
            map.put("contactPhone", r.getContactPhone());
            map.put("activeIncidentCount", r.getActiveIncidentCount());

            if (lat != null && lng != null && r.getCurrentLatitude() != null && r.getCurrentLongitude() != null) {
                double dist = haversineDistanceKm(lat, lng, r.getCurrentLatitude(), r.getCurrentLongitude());
                map.put("distanceKm", dist);
            } else {
                map.put("distanceKm", 0.0);
            }
            result.add(map);
        }

        result.sort(Comparator.comparingDouble(m -> (Double) m.get("distanceKm")));
        return result;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Incident> getCitizenIncidents(String username) {
        User citizen = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return incidentRepository.findByCitizenIdOrderByCreatedAtDesc(citizen.getId());
    }

    public List<Incident> getResponderIncidents(Long responderTeamId) {
        return incidentRepository.findByAssignedResponderIdOrderByCreatedAtDesc(responderTeamId);
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Incident not found: " + id));
    }

    public Incident getIncidentByTrackingCode(String trackingCode) {
        return incidentRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new NoSuchElementException("No incident with tracking code: " + trackingCode));
    }

    public List<IncidentUpdate> getIncidentUpdates(Long incidentId) {
        return updateRepository.findByIncidentIdOrderByCreatedAtAsc(incidentId);
    }
}
