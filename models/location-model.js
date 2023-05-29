import sequelize from "../utils/database.js";
import { DataTypes } from 'sequelize';
import User from './user-model.js';

export const Location = sequelize.define('userLocation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    range: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    eu: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timezone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ll: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        allowNull: false,
    },
    metro: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    area: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

// Establish relationship between Location and User
Location.belongsTo(User);
User.hasMany(Location);
export default Location;
