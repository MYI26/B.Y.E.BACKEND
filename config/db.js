const mongoose = require('mongoose');

// Chargement des variables d'environnement
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,    // Utilise le nouveau parseur d'URL
      useUnifiedTopology: true   // Utilise le nouveau moteur de topologie
    });
    console.log('✅ Connexion MongoDB réussie');
  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB :', err.message);
    process.exit(1); // Arrête le serveur en cas d'échec
  }
};

module.exports = connectDB;     // Export de la fonction pour l'utiliser dans d'autres fichiers
