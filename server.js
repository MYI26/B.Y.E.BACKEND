const express = require('express');     // Importation d'Express
const dotenv = require('dotenv');       // Importation de dotenv pour charger les variables d'environnement/ pour + de sécurité
const connectDB = require('./config/db');   // Importation de la fonction de connexion à la base de données MongoDB

dotenv.config();        // Charge les variables d'environnement

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Pour lire les JSON

connectDB();             // Connexion MongoDB

app.get('/', (req, res) => {             // Route de base pour vérifier que le serveur fonctionne
  res.send('API Bourse MongoDB ✅');
});

const authRoutes = require('./routes/authRoutes');      // Importation des routes d'authentification
app.use('/api/auth', authRoutes);       // Utilisation des routes d'authentification

const protectedRoute = require('./routes/protectedRoute');      // Importation des routes protégées
app.use('/api/protected', protectedRoute);          // Utilisation des routes protégées

const adminRoutes = require('./routes/adminRoutes');    // Importation des routes d'administration
app.use('/api/admin', adminRoutes);       // Utilisation des routes d'administration

const stockRoutes = require('./routes/stockRoutes');   // Importation des routes pour les données des actions
app.use('/api/stocks', stockRoutes);    // Utilisation des routes pour les données des actions

const transactionRoutes = require('./routes/transactionRoutes');   // Importation des routes pour les transactions
app.use('/api/transactions', transactionRoutes);    // Utilisation des routes pour les transactions

const portfolioRoutes = require('./routes/portfolioRoutes');  // Importation des routes pour le portefeuille
app.use('/api/portfolio', portfolioRoutes);   // Utilisation des routes pour le portefeuille

const aiRoutes = require('./routes/aiRoutes');  // Importation des routes pour l'IA 
app.use('/api/ai', aiRoutes);    // Utilisation des routes pour l'IA 

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
