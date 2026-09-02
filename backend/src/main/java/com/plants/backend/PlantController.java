package com.plants.backend;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/plants")
@CrossOrigin(origins = "https://project-plants-orpin.vercel.app")
public class PlantController {

    private final PlantRepository plantRepository;

    public PlantController(PlantRepository plantRepository) {
        this.plantRepository = plantRepository;
    }

    // =========================
    // GET ALL PLANTS
    // =========================

    @GetMapping
    public List<Plant> getAllPlants() {
        return plantRepository.findAll();
    }

    // =========================
    // GET PLANT BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Plant> getPlantById(
            @PathVariable Long id) {

        Optional<Plant> plant =
                plantRepository.findById(id);

        if (plant.isPresent()) {
            return ResponseEntity.ok(plant.get());
        }

        return ResponseEntity.notFound().build();
    }

    // =========================
    // ADD NEW PLANT
    // =========================

    @PostMapping
    public ResponseEntity<Plant> addPlant(
            @RequestBody Plant plant) {

        // Make sure a new plant gets a new ID
        plant.setId(null);

        Plant savedPlant =
                plantRepository.save(plant);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedPlant);
    }

    // =========================
    // UPDATE PLANT
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<Plant> updatePlant(
            @PathVariable Long id,
            @RequestBody Plant updatedPlant) {

        Optional<Plant> existingPlant =
                plantRepository.findById(id);

        if (existingPlant.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Plant plant = existingPlant.get();

        plant.setName(updatedPlant.getName());
        plant.setCategory(updatedPlant.getCategory());
        plant.setDescription(updatedPlant.getDescription());
        plant.setImage(updatedPlant.getImage());
        plant.setSunlight(updatedPlant.getSunlight());
        plant.setWatering(updatedPlant.getWatering());
        plant.setBenefits(updatedPlant.getBenefits());

        Plant savedPlant =
                plantRepository.save(plant);

        return ResponseEntity.ok(savedPlant);
    }

    // =========================
    // DELETE PLANT
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlant(
            @PathVariable Long id) {

        if (!plantRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        plantRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}