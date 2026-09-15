const express = require("express");
const router = express.Router();

const Species = require("../models/Species");

// GET all species
router.get("/", async (req, res) => {
  try {
    const species = await Species.find();
    res.status(200).json(species);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one species
router.get("/:id", async (req, res) => {
  try {
    const species = await Species.findById(req.params.id);

    if (!species) {
      return res.status(404).json({ message: "Species not found" });
    }

    res.status(200).json(species);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new species
router.post("/", async (req, res) => {
  const newSpecies = new Species({
    name: req.body.name,
    status: req.body.status,
    habitat: req.body.habitat,
  });

  try {
    const savedSpecies = await newSpecies.save();
    res.status(201).json(savedSpecies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH a species
router.patch("/:id", async (req, res) => {
  try {
    const updatedSpecies = await Species.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSpecies) {
      return res.status(404).json({ message: "Species not found" });
    }

    res.status(200).json(updatedSpecies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a species
router.delete("/:id", async (req, res) => {
  try {
    const deletedSpecies = await Species.findByIdAndDelete(req.params.id);

    if (!deletedSpecies) {
      return res.status(404).json({ message: "Species not found" });
    }

    res.status(200).json({
      message: "Species deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;