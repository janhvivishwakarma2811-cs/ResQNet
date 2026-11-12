package org.resqnet.dto;

import jakarta.validation.constraints.NotNull;

public class IncidentDispatchDto {

    @NotNull(message = "Responder Team ID is required")
    private Long responderTeamId;

    private String dispatchNote;

    public IncidentDispatchDto() {}

    public IncidentDispatchDto(Long responderTeamId, String dispatchNote) {
        this.responderTeamId = responderTeamId;
        this.dispatchNote = dispatchNote;
    }

    public Long getResponderTeamId() { return responderTeamId; }
    public void setResponderTeamId(Long responderTeamId) { this.responderTeamId = responderTeamId; }

    public String getDispatchNote() { return dispatchNote; }
    public void setDispatchNote(String dispatchNote) { this.dispatchNote = dispatchNote; }
}
