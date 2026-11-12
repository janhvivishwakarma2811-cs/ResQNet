package org.resqnet.repository;

import org.resqnet.model.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShelterRepository extends JpaRepository<Shelter, Long> {
    @Query("SELECT COALESCE(SUM(s.capacity), 0) FROM Shelter s")
    long sumTotalCapacity();

    @Query("SELECT COALESCE(SUM(s.currentOccupants), 0) FROM Shelter s")
    long sumTotalOccupants();

    List<Shelter> findAllByOrderByCurrentOccupantsDesc();
}
