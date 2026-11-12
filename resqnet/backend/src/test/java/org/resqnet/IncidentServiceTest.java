package org.resqnet;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.resqnet.dto.IncidentCreateRequest;
import org.resqnet.model.*;
import org.resqnet.repository.IncidentRepository;
import org.resqnet.repository.IncidentUpdateRepository;
import org.resqnet.repository.ResponderTeamRepository;
import org.resqnet.repository.UserRepository;
import org.resqnet.service.IncidentService;
import org.resqnet.service.NotificationService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class IncidentServiceTest {

    @Mock
    private IncidentRepository incidentRepository;

    @Mock
    private IncidentUpdateRepository updateRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ResponderTeamRepository responderTeamRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private IncidentService incidentService;

    private User citizen;

    @BeforeEach
    void setUp() {
        citizen = new User("testcitizen", "citizen@test.com", "pass", "Test Citizen", "1234567890", Role.ROLE_CITIZEN);
        citizen.setId(1L);
    }

    @Test
    void testCreateIncident() {
        IncidentCreateRequest req = new IncidentCreateRequest();
        req.setTitle("Flash Flood in Sector 4");
        req.setCategory(IncidentCategory.FLOOD);
        req.setSeverity(IncidentSeverity.CRITICAL);
        req.setDescription("Water rising fast");
        req.setAffectedCount(5);
        req.setContactPhone("1234567890");
        req.setLatitude(28.6139);
        req.setLongitude(77.2090);
        req.setAddress("Sector 4 Riverbank");

        when(userRepository.findByUsername("testcitizen")).thenReturn(Optional.of(citizen));
        when(incidentRepository.save(any(Incident.class))).thenAnswer(invocation -> {
            Incident inc = invocation.getArgument(0);
            inc.setId(10L);
            return inc;
        });

        Incident result = incidentService.createIncident(req, "testcitizen");

        assertNotNull(result);
        assertEquals(IncidentStatus.REPORTED, result.getStatus());
        assertEquals("Flash Flood in Sector 4", result.getTitle());
        assertTrue(result.getTrackingCode().startsWith("RSQ-"));
        verify(updateRepository, times(1)).save(any(IncidentUpdate.class));
        verify(notificationService, times(1)).broadcastIncident(any(Incident.class));
    }

    @Test
    void testHaversineDistanceCalculation() {
        // Distance between Connaught Place (28.6315, 77.2167) and India Gate (28.6129, 77.2295) is approx 2.4 km
        double distance = IncidentService.haversineDistanceKm(28.6315, 77.2167, 28.6129, 77.2295);
        assertTrue(distance > 2.0 && distance < 3.0, "Calculated distance should be around 2.4 km");
    }
}
