const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Borrow = sequelize.define(
    'Borrows',
    {
      bookName: { type: DataTypes.STRING, allowNull: true },
      borrowDate: { type: DataTypes.DATE, allowNull: true },
      returnDate: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
  );

  return Borrow;
};
