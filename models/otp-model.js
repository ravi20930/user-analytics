const Sequelize = require("sequelize")
const sequelize = require("../utils/database");

const Otp = sequelize.define('OTP', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    otp: Sequelize.STRING,
    expiration_time: Sequelize.DATE,
    verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('now')
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('now')
    }
},
{
    tableName: 'OTP'
});

module.exports = Otp