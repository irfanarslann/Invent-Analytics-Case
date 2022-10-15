const Db = require('../config/db');
const Users = Db.Users;
const Books = Db.Books;
const Borrows = Db.Borrows;
const { validationResult } = require('express-validator');

const GetUsers = async (req, res, next) => {
  try {
    const users = await Users.findAll({
      include: ['Active Borrows', 'Borrow History'],
    });
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

const GetUserById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  try {
    const user = await Users.findOne({
      include: ['Active Borrows', 'Borrow History'],
      where: { id },
    });
    if (!user) {
      return res.status(400).json({ err: 'User Not Found ' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

const AddNewUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name } = req.body;
  try {
    const newUser = await Users.create({ name });
    return res
      .status(200)
      .json({ success: true, msg: ` User Created with id : ${newUser.id} ` });
  } catch (err) {
    return res.status(500).send('Server Error');
  }
};

const BorrowBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { userId, bookId } = req.params;

  try {
    const user = await Users.findOne({ where: { id: userId } });
    //Check if user exists
    if (!user) {
      return res.status(400).json({ err: 'User not found with given ID' });
    }

    const book = await Books.findOne({ where: { id: bookId } });
    //Check if book exists
    if (!book) {
      return res.status(400).json({ err: 'Book not found with given ID' });
    }

    //Check if book borrowed before
    if (book.borrowed) {
      return res
        .status(400)
        .json({ err: 'This book already borrowed before.' });
    }

    await Books.update(
      { borrowed: true, UserId: user.id, borrowDate: new Date() },
      { where: { id: book.id } }
    );

    return res.status(200).json({
      success: true,
      msg: `Book with name ${book.name} borrowed to user with name ${user.name}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

const ReturnBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { userId, bookId } = req.params;
  const { score } = req.body;

  try {
    //Check if user exists
    const user = await Users.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ err: 'User not found with given ID' });
    }

    const book = await Books.findOne({
      where: { id: bookId },
    });
    //Check if book exists
    if (!book) {
      return res.status(400).json({
        err: 'Book not found with given ID',
      });
    }

    //Check if this book borrowed to this book
    if (book.borrowed == true && book.UserId !== user.id) {
      return res.status(400).json({
        err: 'Book did not borrowed to this user',
      });
    }

    await Books.update(
      {
        borrowed: false,
        UserId: null,
        borrowDate: null,
        score: book.score == 0 ? score : (book.score + score) / 2,
      },
      { where: { id: book.id } }
    );

    await Borrows.create({
      borrowDate: book.borrowDate,
      returnDate: new Date(),
      bookId: book.id,
      bookName: book.name,
      UserId: user.id,
    });

    return res.status(200).json({
      success: true,
      msg: `Book with id ${book.id} (${book.name}) returned from user ${user.name}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

module.exports = { GetUsers, GetUserById, AddNewUser, BorrowBook, ReturnBook };
