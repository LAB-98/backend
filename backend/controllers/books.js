const Book = require('../models/book');
const fs = require('fs');

// Fonction pour créer un nouveau livre
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    const book = new Book({
        ...bookObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.compressedFilename}`
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré' }))
        .catch(error => res.status(400).json({ error }));
};

// Fonction pour modifier un livre
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? 
        {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.compressedFilename}`,
        }
      : { ...req.body };
    Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié' }))
        .catch(error => res.status(400).json({ error }));
};

// Fonction pour supprimer un livre
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({ _id: req.params.id })
                  .then(() => res.status(200).json({ message: "Objet supprimé" }))
                  .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));    
};

// Fonction pour récupérer un seul livre
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

// Fonction pour récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

// Fonction pour ajouter une note à un livre
exports.rateBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const userId = req.body.userId; // Assurez-vous de récupérer l'ID de l'utilisateur authentifié
        const grade = req.body.grade;
        
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        
        const existingRatingIndex = book.ratings.findIndex(rating => rating.userId === userId);
        
        if (existingRatingIndex !== -1) {
            book.ratings[existingRatingIndex].grade = grade;
        } else {
            book.ratings.push({ userId, grade });
        }
        
        const totalGrade = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
        const averageRating = totalGrade / book.ratings.length;
        
        book.averageRating = averageRating;
        
        await book.save();
        
        res.status(200).json({ message: 'Livre noté avec succès', averageRating });
    } catch (error) {
        res.status(500).json({ message: 'Une erreur s’est produite' });
    }
};

// Fonction pour récupérer les livres les mieux notés
exports.getBestRatedBooks = async (req, res, next) => {
    try {
        const books = await Book.find().sort({ averageRating: -1 }).limit(10);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Une erreur s’est produite' });
    }
};
