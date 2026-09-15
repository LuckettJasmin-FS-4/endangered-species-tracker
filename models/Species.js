const mongoose = require("mongoose");

const speciesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },

  habitat: {
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Species", speciesSchema);