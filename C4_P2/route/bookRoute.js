const express = require('express');

const router = express.Router(); // create a new router instance

// install express validator to validate data
const { body, param, validationResult } = require('express-validator');

let { books, nextId } = require('../books'); // import books data from books.js

// validation rules
const validateIDParam = [
    param('id').isInt({ gt: 0 }).withMessage('Invalid ID')
];

const validateBook = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer')
];

// ---Middleware to handle validation results---
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); // proceed to the next middleware or route handler
};

router.get('/', (req, res) => {
    try {
        res.json(books); // send the books array as a JSON response
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error'); // send a 500 error response
    }
});

router.get('/:id', validateIDParam, handleValidationErrors, (req, res) => {
    const id = parseInt(req.params.id); // parse the id from the request parameters
    const book = books.find((b) => b.id === id); // find the book with the given id
    if (!book) {
        return res.status(404).send('Book not found'); // send a 404 error response if not found
    }
    res.json(book); // send the book as a JSON response
});

router.post('/', validateBook, handleValidationErrors, (req, res) => {
    const newBook = { id: nextId++, ...req.body }; // create a new book object with the next id and request body
    books.push(newBook); // add the new book to the books array
    res.status(201).json(newBook); // send the new book as a JSON response with a 201 status code
});

router.put('/:id', validateIDParam, validateBook, handleValidationErrors, (req, res) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(book => book.id === id);
    if (index == -1) {
        return res.status(404).json({ error: 'Book not found' });
    }
    const updatedBook = {
        ...books[index],
        name: req.body.name,
        author: req.body.author,
        price: req.body.price,
        quantity: req.body.quantity
    };
    books[index] = updatedBook;
    res.json(updatedBook);
});

router.delete('/:id', validateIDParam, handleValidationErrors, (req, res) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(book => book.id === id);
    if (index == -1) {
        return res.status(404).json({ error: "Book not found" });
    }
    books.splice(index, 1);
    res.sendStatus(204);
});

module.exports = router; // Export the router