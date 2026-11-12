package org.resqnet.dto;

import jakarta.validation.constraints.NotNull;
import org.resqnet.model.ResponderStatus;

public class ResponderLocationDto {

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private ResponderStatus status;

    public ResponderLocationDto() {}

    public ResponderLocationDto(Double latitude, Double longitude, ResponderStatus status) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
    }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public ResponderStatus getStatus() { return status; }
    public void setStatus(ResponderStatus status) { this.status = status; }
}
