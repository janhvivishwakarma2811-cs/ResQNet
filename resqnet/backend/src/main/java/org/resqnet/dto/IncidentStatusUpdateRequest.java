package org.resqnet.dto;

import jakarta.validation.constraints.NotNull;
import org.resqnet.model.IncidentStatus;

public class IncidentStatusUpdateRequest {

    @NotNull(message = "New status is required")
    private IncidentStatus status;

    private String note;

    public IncidentStatusUpdateRequest() {}

    public IncidentStatusUpdateRequest(IncidentStatus status, String note) {
        this.status = status;
        this.note = note;
    }

    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus status) { this.status = status; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
