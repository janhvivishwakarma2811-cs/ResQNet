package org.resqnet.controller;

import jakarta.validation.Valid;
import org.resqnet.dto.ResponderLocationDto;
import org.resqnet.model.ResponderStatus;
import org.resqnet.model.ResponderTeam;
import org.resqnet.service.ResponderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/responders")
public class ResponderController {

    private final ResponderService responderService;

    public ResponderController(ResponderService responderService) {
        this.responderService = responderService;
    }

    @GetMapping
    public ResponseEntity<List<ResponderTeam>> getAllResponders() {
        return ResponseEntity.ok(responderService.getAllResponders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponderTeam> getResponderById(@PathVariable Long id) {
        return ResponseEntity.ok(responderService.getResponderById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponderTeam> getResponderByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(responderService.getResponderByUserId(userId));
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<ResponderTeam> updateLocationAndStatus(@PathVariable Long id,
                                                                 @Valid @RequestBody ResponderLocationDto dto) {
        return ResponseEntity.ok(responderService.updateLocationAndStatus(id, dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ResponderTeam> updateStatus(@PathVariable Long id,
                                                      @RequestBody Map<String, String> payload) {
        ResponderStatus status = ResponderStatus.valueOf(payload.get("status"));
        return ResponseEntity.ok(responderService.updateStatus(id, status));
    }
}
