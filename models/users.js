const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const User = sequelize.define(
    'Users',
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
  );
  return User;
};
