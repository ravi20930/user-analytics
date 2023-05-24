const sequelize = require("../utils/database");
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    accessToken: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Add additional fields for token usage and analytics data
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    totalUsageDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    totalLoginCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    averageUsageDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    maxUsageDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    minUsageDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'users',
    timestamps: true,
});

module.exports = User;
