package org.resqnet.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "emergency_broadcasts")
public class EmergencyBroadcast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, length = 20)
    private String severity; // ADVISORY, WATCH, WARNING, EVACUATE

    @Column(nullable = false, length = 150)
    private String affectedArea;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "issued_by_id")
    private User issuedBy;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public EmergencyBroadcast() {}

    public EmergencyBroadcast(String title, String message, String severity, String affectedArea, User issuedBy) {
        this.title = title;
        this.message = message;
        this.severity = severity;
        this.affectedArea = affectedArea;
        this.issuedBy = issuedBy;
        this.active = true;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getAffectedArea() { return affectedArea; }
    public void setAffectedArea(String affectedArea) { this.affectedArea = affectedArea; }

    public User getIssuedBy() { return issuedBy; }
    public void setIssuedBy(User issuedBy) { this.issuedBy = issuedBy; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
