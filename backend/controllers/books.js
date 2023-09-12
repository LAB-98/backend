const Book = require('../models/book');
const fs = require('fs');

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

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
};