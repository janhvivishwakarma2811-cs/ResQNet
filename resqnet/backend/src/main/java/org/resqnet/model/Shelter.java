package org.resqnet.model;

import jakarta.persistence.*;

@Entity
@Table(name = "shelters")
public class Shelter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Integer currentOccupants = 0;

    @Column(nullable = false, length = 50)
    private String suppliesStatus = "ADEQUATE"; // ADEQUATE, LOW, CRITICAL

    @Column(length = 100)
    private String contactPerson;

    @Column(length = 20)
    private String contactPhone;

    public Shelter() {}

    public Shelter(String name, String address, Double latitude, Double longitude,
                   Integer capacity, Integer currentOccupants, String suppliesStatus,
                   String contactPerson, String contactPhone) {
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.capacity = capacity;
        this.currentOccupants = currentOccupants;
        this.suppliesStatus = suppliesStatus;
        this.contactPerson = contactPerson;
        this.contactPhone = contactPhone;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Integer getCurrentOccupants() { return currentOccupants; }
    public void setCurrentOccupants(Integer currentOccupants) { this.currentOccupants = currentOccupants; }

    public String getSuppliesStatus() { return suppliesStatus; }
    public void setSuppliesStatus(String suppliesStatus) { this.suppliesStatus = suppliesStatus; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
}
