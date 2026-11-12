package org.resqnet.config;

import org.resqnet.model.*;
import org.resqnet.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ResponderTeamRepository responderTeamRepository;
    private final IncidentRepository incidentRepository;
    private final IncidentUpdateRepository incidentUpdateRepository;
    private final ShelterRepository shelterRepository;
    private final EmergencyBroadcastRepository broadcastRepository;
    private final ResourceInventoryRepository resourceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ResponderTeamRepository responderTeamRepository,
                           IncidentRepository incidentRepository,
                           IncidentUpdateRepository incidentUpdateRepository,
                           ShelterRepository shelterRepository,
                           EmergencyBroadcastRepository broadcastRepository,
                           ResourceInventoryRepository resourceRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.responderTeamRepository = responderTeamRepository;
        this.incidentRepository = incidentRepository;
        this.incidentUpdateRepository = incidentUpdateRepository;
        this.shelterRepository = shelterRepository;
        this.broadcastRepository = broadcastRepository;
        this.resourceRepository = resourceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already initialized. Skipping seed data.");
            return;
        }

        log.info("Seeding initial demonstration data for ResQNet...");

        // 1. Users
        User admin = new User("admin", "admin@resqnet.org", passwordEncoder.encode("Admin@123"),
                "National EOC Commander", "+91-9876543210", Role.ROLE_ADMIN);
        userRepository.save(admin);

        User responderUser1 = new User("unit_alpha", "responder@resqnet.org", passwordEncoder.encode("Responder@123"),
                "Captain Vikram Singh", "+91-9876543211", Role.ROLE_RESPONDER);
        userRepository.save(responderUser1);

        User responderUser2 = new User("fire_squad", "fire@resqnet.org", passwordEncoder.encode("Fire@123"),
                "Station Officer Sharma", "+91-9876543212", Role.ROLE_RESPONDER);
        userRepository.save(responderUser2);

        User responderUser3 = new User("medical_emt", "medical@resqnet.org", passwordEncoder.encode("Medical@123"),
                "Dr. Priya Nair (EMT)", "+91-9876543213", Role.ROLE_RESPONDER);
        userRepository.save(responderUser3);

        User citizen = new User("citizen", "citizen@resqnet.org", passwordEncoder.encode("Citizen@123"),
                "Rahul Verma", "+91-9876543214", Role.ROLE_CITIZEN);
        userRepository.save(citizen);

        // 2. Responder Teams
        ResponderTeam team1 = new ResponderTeam(responderUser1, "NDRF Urban Rescue Alpha", "Flood & Disaster Evacuation",
                ResponderStatus.ON_SCENE, 28.6189, 77.2100, "Heavy Rescue Carrier & Inflatable Boats", "+91-9876543211");
        team1.setActiveIncidentCount(1);
        responderTeamRepository.save(team1);

        ResponderTeam team2 = new ResponderTeam(responderUser2, "Metro Fire Squad 14", "Fire Suppression & Hazmat",
                ResponderStatus.DISPATCHED, 28.6320, 77.2190, "Multi-Agent Fire Tender", "+91-9876543212");
        team2.setActiveIncidentCount(1);
        responderTeamRepository.save(team2);

        ResponderTeam team3 = new ResponderTeam(responderUser3, "Paramedic Mobile EMT-1", "Emergency Trauma & First Aid",
                ResponderStatus.AVAILABLE, 28.6050, 77.2000, "Advanced Life Support Ambulance", "+91-9876543213");
        team3.setActiveIncidentCount(0);
        responderTeamRepository.save(team3);

        // 3. Shelters
        shelterRepository.save(new Shelter("Central Sports Stadium Relief Camp", "Gate 4, Stadium Complex, Central Sector",
                28.6100, 77.2300, 500, 180, "ADEQUATE", "Col. R. Kapoor", "+91-9811002233"));

        shelterRepository.save(new Shelter("North District High School Camp", "Main Road, Sector 9, North District",
                28.6400, 77.2100, 250, 95, "ADEQUATE", "Principal A. Sen", "+91-9811002244"));

        shelterRepository.save(new Shelter("St. Jude Community Hall Shelter", "Park Avenue, West Enclave",
                28.5900, 77.2200, 150, 140, "LOW", "Rev. T. Mathew", "+91-9811002255"));

        // 4. Incidents
        Incident inc1 = new Incident();
        inc1.setTrackingCode("RSQ-8492-1011");
        inc1.setCitizen(citizen);
        inc1.setTitle("Flash Flooding in Low-Lying River Colony");
        inc1.setCategory(IncidentCategory.FLOOD);
        inc1.setSeverity(IncidentSeverity.CRITICAL);
        inc1.setDescription("Water level rapidly rising past 4 feet. Families stranded on rooftop including elderly and 2 infants.");
        inc1.setAffectedCount(12);
        inc1.setContactPhone("+91-9876543214");
        inc1.setLatitude(28.6250);
        inc1.setLongitude(28.6250 > 50 ? 77.2150 : 77.2150);
        inc1.setAddress("House #42, Lane 3, Yamuna Riverfront Colony");
        inc1.setStatus(IncidentStatus.IN_PROGRESS);
        inc1.setAssignedResponder(team1);
        inc1.setCreatedAt(Instant.now().minus(45, ChronoUnit.MINUTES));
        inc1.setUpdatedAt(Instant.now().minus(10, ChronoUnit.MINUTES));
        incidentRepository.save(inc1);

        incidentUpdateRepository.save(new IncidentUpdate(inc1, citizen, null, IncidentStatus.REPORTED, "Emergency reported by citizen."));
        incidentUpdateRepository.save(new IncidentUpdate(inc1, admin, IncidentStatus.REPORTED, IncidentStatus.VERIFIED, "Verified via drone sensor telemetry. High priority."));
        incidentUpdateRepository.save(new IncidentUpdate(inc1, admin, IncidentStatus.VERIFIED, IncidentStatus.DISPATCHED, "Dispatched NDRF Urban Rescue Alpha."));
        incidentUpdateRepository.save(new IncidentUpdate(inc1, responderUser1, IncidentStatus.DISPATCHED, IncidentStatus.IN_PROGRESS, "Unit arrived on scene with 2 inflatable boats. Commencing rooftop evacuation."));

        Incident inc2 = new Incident();
        inc2.setTrackingCode("RSQ-8492-1022");
        inc2.setCitizen(citizen);
        inc2.setTitle("Chemical Facility Fire & Heavy Smoke");
        inc2.setCategory(IncidentCategory.FIRE);
        inc2.setSeverity(IncidentSeverity.HIGH);
        inc2.setDescription("Electrical short circuit triggered solvent storage drum ignition. Dense toxic plume blowing east.");
        inc2.setAffectedCount(6);
        inc2.setContactPhone("+91-9876543214");
        inc2.setLatitude(28.6350);
        inc2.setLongitude(77.2250);
        inc2.setAddress("Plot 18, Industrial Estate Phase 2");
        inc2.setStatus(IncidentStatus.DISPATCHED);
        inc2.setAssignedResponder(team2);
        inc2.setCreatedAt(Instant.now().minus(25, ChronoUnit.MINUTES));
        inc2.setUpdatedAt(Instant.now().minus(5, ChronoUnit.MINUTES));
        incidentRepository.save(inc2);

        incidentUpdateRepository.save(new IncidentUpdate(inc2, citizen, null, IncidentStatus.REPORTED, "Industrial fire reported."));
        incidentUpdateRepository.save(new IncidentUpdate(inc2, admin, IncidentStatus.REPORTED, IncidentStatus.DISPATCHED, "Metro Fire Squad 14 mobilized with foam tenders."));

        Incident inc3 = new Incident();
        inc3.setTrackingCode("RSQ-8492-1033");
        inc3.setCitizen(citizen);
        inc3.setTitle("Multi-Vehicle Pileup on Ring Road Express");
        inc3.setCategory(IncidentCategory.ACCIDENT);
        inc3.setSeverity(IncidentSeverity.MEDIUM);
        inc3.setDescription("3 cars collided in dense rain fog. Minor injuries, 1 driver trapped in vehicle.");
        inc3.setAffectedCount(4);
        inc3.setContactPhone("+91-9876543214");
        inc3.setLatitude(28.5980);
        inc3.setLongitude(77.1920);
        inc3.setAddress("Ring Road Flyover Exit 5");
        inc3.setStatus(IncidentStatus.REPORTED);
        inc3.setCreatedAt(Instant.now().minus(15, ChronoUnit.MINUTES));
        inc3.setUpdatedAt(Instant.now().minus(15, ChronoUnit.MINUTES));
        incidentRepository.save(inc3);

        incidentUpdateRepository.save(new IncidentUpdate(inc3, citizen, null, IncidentStatus.REPORTED, "Accident logged by bystander."));

        Incident inc4 = new Incident();
        inc4.setTrackingCode("RSQ-8492-1000");
        inc4.setCitizen(citizen);
        inc4.setTitle("Old Residential Wall Collapse After Rain");
        inc4.setCategory(IncidentCategory.BUILDING_COLLAPSE);
        inc4.setSeverity(IncidentSeverity.HIGH);
        inc4.setDescription("Boundary wall collapsed on adjacent footpath. 3 pedestrians injured and transported to hospital.");
        inc4.setAffectedCount(3);
        inc4.setContactPhone("+91-9876543214");
        inc4.setLatitude(28.6140);
        inc4.setLongitude(77.2020);
        inc4.setAddress("Chandni Chowk Old Heritage Lane");
        inc4.setStatus(IncidentStatus.RESOLVED);
        inc4.setAssignedResponder(team3);
        inc4.setCreatedAt(Instant.now().minus(4, ChronoUnit.HOURS));
        inc4.setUpdatedAt(Instant.now().minus(1, ChronoUnit.HOURS));
        inc4.setResolvedAt(Instant.now().minus(1, ChronoUnit.HOURS));
        incidentRepository.save(inc4);

        // 5. Emergency Broadcasts
        broadcastRepository.save(new EmergencyBroadcast(
                "RED ALERT: Torrential Rainfall & High Flooding Risk in Eastern River Basin",
                "Met department issued severe weather warning. Residents in low-lying riverside colonies are strongly advised to evacuate to Central Sports Stadium Relief Camp or designated higher ground immediately.",
                "WARNING",
                "River Basin & Sectors 3-8",
                admin
        ));

        broadcastRepository.save(new EmergencyBroadcast(
                "ADVISORY: Power Grid Precautionary Shutdown in Sector 14",
                "Due to waterlogging near substation 4, electricity supply temporarily cut for safety until water is pumped out.",
                "ADVISORY",
                "Industrial Estate Sector 14",
                admin
        ));

        // 6. Resource Inventory
        resourceRepository.save(new ResourceInventory("Inflatable Rescue Boats with Motors", "RESCUE_EQUIPMENT", 12, 7, "Boats", "River Basin Base Depo"));
        resourceRepository.save(new ResourceInventory("Mobile Trauma Surgical Kits", "MEDICAL", 50, 36, "Kits", "Central EMT Depot"));
        resourceRepository.save(new ResourceInventory("Emergency High-Calorie Ration Packs", "FOOD_WATER", 2500, 1850, "Packs", "State Relief Warehouse"));
        resourceRepository.save(new ResourceInventory("Submersible High-Capacity De-watering Pumps", "RESCUE_EQUIPMENT", 16, 9, "Pumps", "Disaster Mgmt Logistics"));
        resourceRepository.save(new ResourceInventory("Thermal Blankets & Emergency Cots", "SHELTER_SUPPLIES", 800, 520, "Units", "Red Cross Central Storage"));

        log.info("Demo data seeding completed successfully! Test users ready: citizen@resqnet.org, responder@resqnet.org, admin@resqnet.org");
    }
}
