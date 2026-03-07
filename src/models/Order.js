const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    value: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'orders',
    timestamps: false,
});

module.exports = Order;
