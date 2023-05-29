import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';
import User from './user-model.js';
import Token from './token-model.js';

const UserDevice = sequelize.define('userDevice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  deviceName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  browser: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  version: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  os: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
UserDevice.belongsTo(User);
User.hasMany(UserDevice);
Token.hasOne(UserDevice);
UserDevice.belongsTo(Token);
export default UserDevice;