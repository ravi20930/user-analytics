import sequelize from "../utils/database.js";
import { Sequelize } from 'sequelize';

export const Otp = sequelize.define('OTP', {
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
    }
},
{
    tableName: 'OTP'
});
export default Otp;