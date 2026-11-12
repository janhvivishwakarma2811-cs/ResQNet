package org.resqnet.model;

import jakarta.persistence.*;

@Entity
@Table(name = "responder_teams")
public class ResponderTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(nullable = false, length = 100)
    private String teamName;

    @Column(nullable = false, length = 50)
    private String specialization;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ResponderStatus status = ResponderStatus.AVAILABLE;

    @Column(nullable = false)
    private Double currentLatitude;

    @Column(nullable = false)
    private Double currentLongitude;

    @Column(length = 50)
    private String vehicleType;

    @Column(length = 20)
    private String contactPhone;

    @Column(nullable = false)
    private Integer activeIncidentCount = 0;

    public ResponderTeam() {}

    public ResponderTeam(User user, String teamName, String specialization, ResponderStatus status,
                         Double currentLatitude, Double currentLongitude, String vehicleType, String contactPhone) {
        this.user = user;
        this.teamName = teamName;
        this.specialization = specialization;
        this.status = status;
        this.currentLatitude = currentLatitude;
        this.currentLongitude = currentLongitude;
        this.vehicleType = vehicleType;
        this.contactPhone = contactPhone;
        this.activeIncidentCount = 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public ResponderStatus getStatus() { return status; }
    public void setStatus(ResponderStatus status) { this.status = status; }

    public Double getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(Double currentLatitude) { this.currentLatitude = currentLatitude; }

    public Double getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(Double currentLongitude) { this.currentLongitude = currentLongitude; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public Integer getActiveIncidentCount() { return activeIncidentCount; }
    public void setActiveIncidentCount(Integer activeIncidentCount) { this.activeIncidentCount = activeIncidentCount; }
}
