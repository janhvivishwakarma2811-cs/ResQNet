package org.resqnet.dto;

import jakarta.validation.constraints.NotBlank;

public class BroadcastCreateDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotBlank(message = "Severity is required")
    private String severity; // ADVISORY, WATCH, WARNING, EVACUATE

    @NotBlank(message = "Affected area is required")
    private String affectedArea;

    public BroadcastCreateDto() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getAffectedArea() { return affectedArea; }
    public void setAffectedArea(String affectedArea) { this.affectedArea = affectedArea; }
}
