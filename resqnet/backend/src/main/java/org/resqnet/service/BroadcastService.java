package org.resqnet.service;

import org.resqnet.dto.BroadcastCreateDto;
import org.resqnet.model.EmergencyBroadcast;
import org.resqnet.model.User;
import org.resqnet.repository.EmergencyBroadcastRepository;
import org.resqnet.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BroadcastService {

    private final EmergencyBroadcastRepository broadcastRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public BroadcastService(EmergencyBroadcastRepository broadcastRepository,
                            UserRepository userRepository,
                            NotificationService notificationService) {
        this.broadcastRepository = broadcastRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<EmergencyBroadcast> getActiveBroadcasts() {
        return broadcastRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    public List<EmergencyBroadcast> getAllBroadcasts() {
        return broadcastRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public EmergencyBroadcast createBroadcast(BroadcastCreateDto dto, String username) {
        User user = null;
        if (username != null) {
            user = userRepository.findByUsername(username).orElse(null);
        }

        EmergencyBroadcast broadcast = new EmergencyBroadcast(
                dto.getTitle(),
                dto.getMessage(),
                dto.getSeverity(),
                dto.getAffectedArea(),
                user
        );

        EmergencyBroadcast saved = broadcastRepository.save(broadcast);
        notificationService.broadcastAlert(saved);
        return saved;
    }

    @Transactional
    public EmergencyBroadcast deactivateBroadcast(Long id) {
        EmergencyBroadcast broadcast = broadcastRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Broadcast not found: " + id));
        broadcast.setActive(false);
        return broadcastRepository.save(broadcast);
    }
}
