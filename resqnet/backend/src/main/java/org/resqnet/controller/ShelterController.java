package org.resqnet.controller;

import jakarta.validation.Valid;
import org.resqnet.dto.ShelterDto;
import org.resqnet.model.Shelter;
import org.resqnet.service.ShelterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shelters")
public class ShelterController {

    private final ShelterService shelterService;

    public ShelterController(ShelterService shelterService) {
        this.shelterService = shelterService;
    }

    @GetMapping
    public ResponseEntity<List<Shelter>> getAllShelters() {
        return ResponseEntity.ok(shelterService.getAllShelters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shelter> getShelterById(@PathVariable Long id) {
        return ResponseEntity.ok(shelterService.getShelterById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Shelter> createShelter(@Valid @RequestBody ShelterDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shelterService.createShelter(dto));
    }

    @PutMapping("/{id}/occupancy")
    public ResponseEntity<Shelter> updateOccupancy(@PathVariable Long id, @RequestBody Map<String, Integer> payload) {
        Integer occupants = payload.get("occupants");
        return ResponseEntity.ok(shelterService.updateOccupancy(id, occupants));
    }

    @PutMapping("/{id}/supplies")
    public ResponseEntity<Shelter> updateSupplies(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("suppliesStatus");
        return ResponseEntity.ok(shelterService.updateSupplies(id, status));
    }
}
