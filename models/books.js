const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Book = sequelize.define(
    'Books',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      score: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },
      borrowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      borrowDate: { type: DataTypes.DATE, allowNull: true },
    },
    {
      updatedAt: false,
    }
  );

  return Book;
};
