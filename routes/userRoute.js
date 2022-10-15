const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const UserController = require('../controllers/UserController');

// @route     GET api/users
// @desc      Get All Users
// @access    Public
router.get('/', UserController.GetUsers);

// @route     GET api/users
// @desc      Get a user by id
// @access    Public
router.get(
  '/:id',
  check('id', 'ID is required').not().isEmpty(),
  check('id', 'ID parameter must be numberic').isNumeric(),
  UserController.GetUserById
);

// @route     POST api/users
// @desc      Create New User
// @access    Private
router.post(
  '/',
  check('name', 'Name is required').not().isEmpty(),
  check('name', 'Name field can be a maximum of 25 characters').isLength({
    max: 25,
  }),
  UserController.AddNewUser
);

// @route     POST api/users/:userId/borrow/:bookId
// @desc      Borrow Book
// @access    Public
router.post(
  '/:userId/borrow/:bookId',
  check('userId', 'User Id is required').not().isEmpty(),
  check('userId', 'User Id field must be numeric ').isNumeric(),
  check('bookId', 'Book Id is required').not().isEmpty(),
  check('bookId', 'Book Id field must be numeric').isNumeric(),
  UserController.BorrowBook
);

// @route     POST api/users/:userId/borrow/:bookId
// @desc      Return Book
// @access    Public
router.post(
  '/:userId/return/:bookId',
  check('userId', 'User Id is required').not().isEmpty(),
  check('userId', 'User Id field must be numeric ').isNumeric(),
  check('bookId', 'Book Id is required').not().isEmpty(),
  check('bookId', 'Book Id field must be numeric').isNumeric(),
  check('score', 'Score is required').not().isEmpty(),
  check('score', 'Score field must be numeric between 0-10 ').isFloat({
    min: 0,
    max: 10,
  }),
  UserController.ReturnBook
);

module.exports = router;
