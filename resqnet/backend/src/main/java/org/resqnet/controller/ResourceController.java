package org.resqnet.controller;

import org.resqnet.model.ResourceInventory;
import org.resqnet.repository.ResourceInventoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceInventoryRepository repository;

    public ResourceController(ResourceInventoryRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<ResourceInventory>> getAllResources() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResourceInventory> saveResource(@RequestBody ResourceInventory resource) {
        return ResponseEntity.ok(repository.save(resource));
    }
}
