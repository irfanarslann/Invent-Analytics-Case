const Db = require('../config/db');
const Books = Db.Books;
const { validationResult } = require('express-validator');

const GetBooks = async (req, res, next) => {
  try {
    const books = await Books.findAll({
      attributes: ['id', 'name', 'createdAt', 'borrowed', 'score'],
    });
    return res.status(200).json(books);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

const GetBookById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.params;
  try {
    const book = await Books.findOne({
      where: { id },
      attributes: ['id', 'name', 'createdAt', 'borrowed', 'score'],
    });
    if (!book) {
      return res.status(400).json({ err: 'Book Not Found ' });
    }

    return res.status(200).json(book);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

const CreateBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name } = req.body;
  try {
    //Check if book exists
    const isExists = await Books.findOne({ where: { name } });
    if (isExists) {
      return res
        .status(400)
        .json({ success: false, msg: 'Book aldready exists' });
    }
    const book = await Books.create({ name });
    return res
      .status(200)
      .json({ success: true, msg: ` Book created with id : ${book.id} ` });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
};

module.exports = { GetBookById, GetBooks, CreateBook };
