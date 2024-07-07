const express = require('express');

const router = express.Router();
const bookData = require('../data/books.json');
const { check, validationResult} = require('express-validator');
const { save  } = require('../services/save.services');

router.get('/', (req, res) => {
    res.json(bookData);
});

router.post('/', [
        check('name', 'Book name is requried').not().isEmpty(),
        check('author', 'Author name is require').not().isEmpty()
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { name, author } = req.body;

        bookData.push({
            name,
            author,
            id: Math.random()
        });

        const isSaved = save(bookData);

        if (!isSaved) {
            return res.status(500).json({
                error: true,
                message: 'could not save book'
            });
        }

        res.json({
            message: 'success'
        });
});

router.delete("/:bookId", (req, res) => {
    const {bookId} = req.params;
    const foundBook = bookData.find((book) => book.id == bookId);

    if (!foundBook) {
        return res.status(404).send({
            error: true, 
            message: 'Book not found'
        });
    }

    const updatedBooks = bookData.filter((book) => book.id != bookId);

    const isSaved = save(updatedBooks);

    if (!isSaved) {
        return res.status(500).json({
            error: true,
            message: 'could not save book'
        });
    }

    res.status(201).json({
        message: 'Success'
    });
});

router.put("/:bookId", (req, res) => {
    const { bookId } = req.params;
	const { name, author } = req.body;
	const foundBook = bookData.find((book) => book.id == bookId);

	if (!foundBook) {
		return res.status(404).send({
			error: true,
			message: 'Book not found'
		});
	}

	let updatedBook = null;

    const updatedBooks = bookData.map((book) => {
        if (book.id == bookId) {
            updatedBook = {
                ...book,
                name, 
                author
            };
            console.log(true);
            return updatedBook;
        }

        return book;
    });

    const isSaved = save(updatedBooks);

	if (!isSaved) {
		return res.status(500).json({
			error: true,
			message: 'could not save book'
		});
	}

	res.status(200).json(updatedBook);
});

module.exports = router;