package org.resqnet.controller;

import jakarta.validation.Valid;
import org.resqnet.dto.BroadcastCreateDto;
import org.resqnet.model.EmergencyBroadcast;
import org.resqnet.service.BroadcastService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/broadcasts")
public class BroadcastController {

    private final BroadcastService broadcastService;

    public BroadcastController(BroadcastService broadcastService) {
        this.broadcastService = broadcastService;
    }

    @GetMapping("/active")
    public ResponseEntity<List<EmergencyBroadcast>> getActiveBroadcasts() {
        return ResponseEntity.ok(broadcastService.getActiveBroadcasts());
    }

    @GetMapping
    public ResponseEntity<List<EmergencyBroadcast>> getAllBroadcasts() {
        return ResponseEntity.ok(broadcastService.getAllBroadcasts());
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<EmergencyBroadcast> createBroadcast(@Valid @RequestBody BroadcastCreateDto dto,
                                                              @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.status(HttpStatus.CREATED).body(broadcastService.createBroadcast(dto, username));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deactivateBroadcast(@PathVariable Long id) {
        broadcastService.deactivateBroadcast(id);
        return ResponseEntity.noContent().build();
    }
}
