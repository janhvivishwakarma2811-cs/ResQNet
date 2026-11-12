package org.resqnet.repository;

import org.resqnet.model.ResourceInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceInventoryRepository extends JpaRepository<ResourceInventory, Long> {
    List<ResourceInventory> findByCategory(String category);
}
