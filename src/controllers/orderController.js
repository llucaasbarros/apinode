const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');
const Item = require('../models/Item');
const sequelize = require('../config/database');

async function createOrder(req, res) {
    const { valorTotal, dataCriacao, items } = req.body;

    if (!valorTotal || !dataCriacao || !items || !items.length) {
        return res.status(400).json({ error: 'valorTotal, dataCriacao e items são obrigatórios.' });
    }

    const transaction = await sequelize.transaction();

    try {
        const orderId = uuidv4();

        const order = await Order.create({
            orderId,
            value: valorTotal,
            creationDate: dataCriacao,
        }, { transaction });

        const itemsData = items.map((item) => ({
            orderId,
            productId: item.idItem,
            quantity: item.quantidadeItem,
            price: item.valorItem,
        }));

        await Item.bulkCreate(itemsData, { transaction });

        await transaction.commit();

        const created = await Order.findOne({
            where: { orderId },
            include: { model: Item, as: 'items' },
        });

        return res.status(201).json(formatOrder(created));
    } catch (err) {
        await transaction.rollback();
        return res.status(500).json({ error: 'Erro ao criar pedido.', details: err.message });
    }
}

async function getOrder(req, res) {
    const { numeroPedido } = req.params;

    try {
        const order = await Order.findOne({
            where: { orderId: numeroPedido },
            include: { model: Item, as: 'items' },
        });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        return res.status(200).json(formatOrder(order));
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao buscar pedido.', details: err.message });
    }
}

async function listOrders(req, res) {
    try {
        const orders = await Order.findAll({
            include: { model: Item, as: 'items' },
            order: [['creationDate', 'DESC']],
        });

        return res.status(200).json(orders.map(formatOrder));
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao listar pedidos.', details: err.message });
    }
}

async function updateOrder(req, res) {
    const { numeroPedido } = req.params;
    const { valorTotal, dataCriacao, items } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const order = await Order.findOne({ where: { orderId: numeroPedido } });

        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        await order.update({
            ...(valorTotal !== undefined && { value: valorTotal }),
            ...(dataCriacao !== undefined && { creationDate: dataCriacao }),
        }, { transaction });

        if (items && items.length) {
            await Item.destroy({ where: { orderId: numeroPedido }, transaction });

            const itemsData = items.map((item) => ({
                orderId: numeroPedido,
                productId: item.idItem,
                quantity: item.quantidadeItem,
                price: item.valorItem,
            }));

            await Item.bulkCreate(itemsData, { transaction });
        }

        await transaction.commit();

        const updated = await Order.findOne({
            where: { orderId: numeroPedido },
            include: { model: Item, as: 'items' },
        });

        return res.status(200).json(formatOrder(updated));
    } catch (err) {
        await transaction.rollback();
        return res.status(500).json({ error: 'Erro ao atualizar pedido.', details: err.message });
    }
}

async function deleteOrder(req, res) {
    const { numeroPedido } = req.params;

    const transaction = await sequelize.transaction();

    try {
        const order = await Order.findOne({ where: { orderId: numeroPedido } });

        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        await Item.destroy({ where: { orderId: numeroPedido }, transaction });
        await order.destroy({ transaction });

        await transaction.commit();

        return res.status(200).json({ message: 'Pedido removido com sucesso.' });
    } catch (err) {
        await transaction.rollback();
        return res.status(500).json({ error: 'Erro ao deletar pedido.', details: err.message });
    }
}

function formatOrder(order) {
    return {
        numeroPedido: order.orderId,
        valorTotal: order.value,
        dataCriacao: order.creationDate,
        items: order.items?.map((item) => ({
            idItem: String(item.productId),
            quantidadeItem: item.quantity,
            valorItem: item.price,
        })) || [],
    };
}

module.exports = { createOrder, getOrder, listOrders, updateOrder, deleteOrder };
