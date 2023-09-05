const express = require('express');
const router = express.Router();

const booksCtrl = require('../controllers/books');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.post('/', auth, multer, booksCtrl.createBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.get('/:id', auth, booksCtrl.getOneBook);
router.get('/', auth, booksCtrl.getAllBook);

module.exports = router;