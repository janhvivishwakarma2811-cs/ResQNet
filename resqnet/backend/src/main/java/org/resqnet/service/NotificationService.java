package org.resqnet.service;

import org.resqnet.model.EmergencyBroadcast;
import org.resqnet.model.Incident;
import org.resqnet.model.IncidentUpdate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void broadcastIncident(Incident incident) {
        try {
            messagingTemplate.convertAndSend("/topic/incidents", incident);
            log.info("Broadcasted incident {} to /topic/incidents", incident.getTrackingCode());
        } catch (Exception e) {
            log.error("Failed to broadcast incident to WebSocket", e);
        }
    }

    public void broadcastIncidentUpdate(Long incidentId, IncidentUpdate update) {
        try {
            messagingTemplate.convertAndSend("/topic/incident/" + incidentId, update);
            log.info("Sent update for incident ID {} to /topic/incident/{}", incidentId, incidentId);
        } catch (Exception e) {
            log.error("Failed to send incident update to WebSocket", e);
        }
    }

    public void broadcastAlert(EmergencyBroadcast alert) {
        try {
            messagingTemplate.convertAndSend("/topic/alerts", alert);
            log.info("Broadcasted emergency alert {} to /topic/alerts", alert.getTitle());
        } catch (Exception e) {
            log.error("Failed to broadcast alert to WebSocket", e);
        }
    }
}
