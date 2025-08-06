const mongoose = require('mongoose');       // Importation de Mongoose pour interagir avec MongoDB

const userSchema = new mongoose.Schema({        // Définition du schéma pour les utilisateurs
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);        // Exportation du modèle User basé sur le schéma défini
