// Importer les modules nécessaires.
const express = require('express');    // Importer le module Express pour créer le serveur.
const mongoose = require("mongoose");  // Importer le module Mongoose pour interagir avec MongoDB.
const path = require("path");          // Importer le module Path pour manipuler les chemins de fichiers.
const helmet = require("helmet");      // Importer le module Helmet pour la sécurité des entêtes HTTP.

// Importer les routes pour les livres et les utilisateurs.
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

// Charger les variables d'environnement du fichier .env.
require("dotenv").config();

// Créer une nouvelle instance de l'application Express.
const app = express();


// Utiliser le middleware `helmet` avec Express pour configurer une Politique de Sécurité de Contenu (CSP).
app.use(
    helmet.contentSecurityPolicy({
      // Définir les directives pour la CSP.
      directives: {
        // Spécifier les sources autorisées pour charger des images.
        // Ici, seulement les images du même site (self) sont autorisées.
        imgSrc: ["'self'"],
      },
    })
  );

// Options pour la connexion à MongoDB via Mongoose.
// `useNewUrlParser`: Utilise le nouvel analyseur pour éviter les avertissements liés à l'URL de connexion.
// `useUnifiedTopology`: Utilise une seule nouvelle topologie pour le client de la base de données.
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Chaîne de connexion à MongoDB.
// Les informations d'identification et le nom du cluster sont récupérés depuis les variables d'environnement.
const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`;


// Middleware pour analyser les corps des requêtes en JSON.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Essayer de connecter à MongoDB.
async function connectToMongoDB() {
  try {
    await mongoose.connect(connectionString, mongooseOptions);
    console.log("Connexion à MongoDB établie avec succès !");
  } catch (error) {
    console.log("Erreur lors de la connexion à MongoDB.");
  }
}

connectToMongoDB();

// Configuration des en-têtes CORS pour gérer les requêtes cross-origin.
function setupCORSHeaders(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  const allowedHeaders = [
    "Origin", "X-Requested-With", "Content", "Accept", "Content-Type", "Authorization"
  ];
  res.header("Access-Control-Allow-Headers", allowedHeaders.join(', '));
  
  const allowedMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];
  res.header("Access-Control-Allow-Methods", allowedMethods.join(', '));
  
  next();
}

app.use(setupCORSHeaders);

// Configuration des routes.
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

// Configuration pour servir des fichiers statiques depuis le répertoire 'images'.
const imagesDirectoryPath = path.join(__dirname, "images");
app.use("/images", express.static(imagesDirectoryPath));

// Exporter l'application express pour une utilisation externe.
module.exports = app;

// app.use('/api/stuff', (req, res, next) => {
//     const stuff = [
//       {
//         _id: 'oeihfzeoi',
//         title: 'Milwaukee Mission',
//         author: 'Elder Cooper',
//         date: '2021',
//         imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//         genre: 'Policier',
//         rating: '3/5',
//         userId: 'qsomihvqios',
//       },
//       {
//         _id: 'oeihfzeoi',
//         title: 'Book for Esther',
//         author: 'Alabaster',
//         date: '2022',
//         imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//         genre: 'Paysage',
//         rating: '4/5',
//         userId: 'qsomihvqios',
//       },
//       {
//         _id: 'oeihfzeoi',
//         title: 'The Kinfolk Table',
//         author: 'Nathan Williams',
//         date: '2022',
//         imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//         genre: 'Cuisine',
//         rating: '3/5',
//         userId: 'qsomihvqios',
//       },
//     ];
//     res.status(200).json(stuff);
//   });