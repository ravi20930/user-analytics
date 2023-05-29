import { Sequelize, DataTypes } from 'sequelize';
import sequelize from "../utils/database.js";
import User from './user-model.js';
import Location from './location-model.js';
export const Token = sequelize.define('token', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastUsed: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    totalUsageDuration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    averageUsageDuration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    maxUsageDuration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    minUsageDuration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    apiCallCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // other token columns
  }
);

Token.belongsTo(User);
User.hasMany(Token);
Token.belongsTo(Location);
Location.hasOne(Token);
export default Token;