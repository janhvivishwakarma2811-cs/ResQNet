package org.resqnet.service;

import org.resqnet.dto.ResponderLocationDto;
import org.resqnet.model.ResponderStatus;
import org.resqnet.model.ResponderTeam;
import org.resqnet.repository.ResponderTeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ResponderService {

    private final ResponderTeamRepository responderTeamRepository;

    public ResponderService(ResponderTeamRepository responderTeamRepository) {
        this.responderTeamRepository = responderTeamRepository;
    }

    public List<ResponderTeam> getAllResponders() {
        return responderTeamRepository.findAll();
    }

    public ResponderTeam getResponderById(Long id) {
        return responderTeamRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Responder team not found: " + id));
    }

    public ResponderTeam getResponderByUserId(Long userId) {
        return responderTeamRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("Responder team profile not found for user: " + userId));
    }

    @Transactional
    public ResponderTeam updateLocationAndStatus(Long responderId, ResponderLocationDto dto) {
        ResponderTeam team = getResponderById(responderId);
        if (dto.getLatitude() != null) {
            team.setCurrentLatitude(dto.getLatitude());
        }
        if (dto.getLongitude() != null) {
            team.setCurrentLongitude(dto.getLongitude());
        }
        if (dto.getStatus() != null) {
            team.setStatus(dto.getStatus());
        }
        return responderTeamRepository.save(team);
    }

    @Transactional
    public ResponderTeam updateStatus(Long responderId, ResponderStatus status) {
        ResponderTeam team = getResponderById(responderId);
        team.setStatus(status);
        return responderTeamRepository.save(team);
    }
}
