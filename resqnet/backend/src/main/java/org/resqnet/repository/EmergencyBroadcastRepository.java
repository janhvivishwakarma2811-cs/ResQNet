package org.resqnet.repository;

import org.resqnet.model.EmergencyBroadcast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyBroadcastRepository extends JpaRepository<EmergencyBroadcast, Long> {
    List<EmergencyBroadcast> findByActiveTrueOrderByCreatedAtDesc();
    List<EmergencyBroadcast> findAllByOrderByCreatedAtDesc();
}
