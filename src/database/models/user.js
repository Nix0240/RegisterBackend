import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailOtp: DataTypes.INTEGER,
    isVerified: DataTypes.BOOLEAN,
    role: {
      type: DataTypes.ENUM('admin', 'customer'),  
      defaultValue: 'customer',  
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
