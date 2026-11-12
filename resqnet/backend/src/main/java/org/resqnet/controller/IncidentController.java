package org.resqnet.controller;

import jakarta.validation.Valid;
import org.resqnet.dto.IncidentCreateRequest;
import org.resqnet.dto.IncidentDispatchDto;
import org.resqnet.dto.IncidentStatusUpdateRequest;
import org.resqnet.model.Incident;
import org.resqnet.model.IncidentUpdate;
import org.resqnet.service.IncidentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Incident>> getMyIncidents(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(incidentService.getCitizenIncidents(userDetails.getUsername()));
    }

    @GetMapping("/responder/{responderId}")
    public ResponseEntity<List<Incident>> getResponderIncidents(@PathVariable Long responderId) {
        return ResponseEntity.ok(incidentService.getResponderIncidents(responderId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.getIncidentById(id));
    }

    @GetMapping("/track/{trackingCode}")
    public ResponseEntity<Incident> trackIncident(@PathVariable String trackingCode) {
        return ResponseEntity.ok(incidentService.getIncidentByTrackingCode(trackingCode));
    }

    @PostMapping
    public ResponseEntity<Incident> createIncident(@Valid @RequestBody IncidentCreateRequest request,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : null;
        Incident created = incidentService.createIncident(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/sos")
    public ResponseEntity<Incident> triggerSos(@RequestBody Map<String, Object> payload,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        Double lat = payload.get("latitude") != null ? Double.parseDouble(payload.get("latitude").toString()) : 28.6139;
        Double lng = payload.get("longitude") != null ? Double.parseDouble(payload.get("longitude").toString()) : 77.2090;
        String address = payload.get("address") != null ? payload.get("address").toString() : "Current GPS Location";
        Incident sos = incidentService.triggerSos(lat, lng, address, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(sos);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Incident> updateIncidentStatus(@PathVariable Long id,
                                                        @Valid @RequestBody IncidentStatusUpdateRequest request,
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        Incident updated = incidentService.updateStatus(id, request, userDetails.getUsername());
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/dispatch")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Incident> dispatchResponder(@PathVariable Long id,
                                                     @Valid @RequestBody IncidentDispatchDto dto,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        Incident dispatched = incidentService.dispatchResponder(id, dto, userDetails.getUsername());
        return ResponseEntity.ok(dispatched);
    }

    @GetMapping("/{id}/updates")
    public ResponseEntity<List<IncidentUpdate>> getIncidentUpdates(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.getIncidentUpdates(id));
    }

    @GetMapping("/{id}/nearby-responders")
    public ResponseEntity<List<Map<String, Object>>> getNearbyResponders(@PathVariable Long id) {
        Incident inc = incidentService.getIncidentById(id);
        return ResponseEntity.ok(incidentService.getNearbyResponders(inc.getLatitude(), inc.getLongitude()));
    }
}
