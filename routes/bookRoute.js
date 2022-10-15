const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const BookController = require('../controllers/BookController');

// @route     GET api/books
// @desc      Get All Books
// @access    Public
router.get('/', BookController.GetBooks);

// @route     GET api/books
// @desc      Get a book by id
// @access    Public
router.get(
  '/:id',
  check('id', 'Id field is required').not().isEmpty(),
  check('id', 'Id field must be numeric').isNumeric(),
  BookController.GetBookById
);

// @route     POST api/books
// @desc      Create New book
// @access    Public
router.post(
  '/',
  check('name', 'Name is Required').not().isEmpty(),
  check('name', 'Name field can be a maximum of 50 characters').isLength({
    max: 50,
  }),
  BookController.CreateBook
);

module.exports = router;
