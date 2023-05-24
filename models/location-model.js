const sequelize = require("../utils/database");
const { DataTypes } = require('sequelize');
const User = require('./user-model');

const Location = sequelize.define('userLocation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    }
}, {
    tableName: 'userLocations',
    timestamps: true,
});

// Establish relationship between Location and User
Location.belongsTo(User);
User.hasMany(Location);

module.exports = Location;
