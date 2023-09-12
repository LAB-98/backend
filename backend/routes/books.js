const express = require('express');
const router = express.Router();

const booksCtrl = require('../controllers/books');
const auth = require('../middlewares/auth');
const sharp = require('../middlewares/sharp');
const multer = require('../middlewares/multer-config');

// Routes existantes
router.post('/', auth, multer, sharp, booksCtrl.createBook);
router.put('/:id', auth, multer, sharp, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.get('/:id', booksCtrl.getOneBook);
router.get('/', booksCtrl.getAllBooks);

// Nouvelles routes pour la notation des livres
router.post('/:id/rating', auth, booksCtrl.rateBook); // Ajout d'un vote
router.get('/bestrating', booksCtrl.getBestRatedBooks); // Récupérer les livres les mieux notés

module.exports = router;
