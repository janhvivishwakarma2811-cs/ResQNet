package org.resqnet.service;

import org.resqnet.dto.ShelterDto;
import org.resqnet.model.Shelter;
import org.resqnet.repository.ShelterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ShelterService {

    private final ShelterRepository shelterRepository;

    public ShelterService(ShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }

    public List<Shelter> getAllShelters() {
        return shelterRepository.findAllByOrderByCurrentOccupantsDesc();
    }

    public Shelter getShelterById(Long id) {
        return shelterRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Shelter not found: " + id));
    }

    @Transactional
    public Shelter createShelter(ShelterDto dto) {
        Shelter shelter = new Shelter(
                dto.getName(),
                dto.getAddress(),
                dto.getLatitude(),
                dto.getLongitude(),
                dto.getCapacity(),
                dto.getCurrentOccupants() != null ? dto.getCurrentOccupants() : 0,
                dto.getSuppliesStatus() != null ? dto.getSuppliesStatus() : "ADEQUATE",
                dto.getContactPerson(),
                dto.getContactPhone()
        );
        return shelterRepository.save(shelter);
    }

    @Transactional
    public Shelter updateOccupancy(Long shelterId, Integer occupants) {
        Shelter shelter = getShelterById(shelterId);
        shelter.setCurrentOccupants(Math.max(0, occupants));
        return shelterRepository.save(shelter);
    }

    @Transactional
    public Shelter updateSupplies(Long shelterId, String suppliesStatus) {
        Shelter shelter = getShelterById(shelterId);
        shelter.setSuppliesStatus(suppliesStatus);
        return shelterRepository.save(shelter);
    }
}
