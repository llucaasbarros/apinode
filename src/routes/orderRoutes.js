const { Router } = require('express');
const {
    createOrder,
    getOrder,
    listOrders,
    updateOrder,
    deleteOrder,
} = require('../controllers/orderController');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Criar um novo pedido
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [valorTotal, dataCriacao, items]
 *             properties:
 *               valorTotal:
 *                 type: number
 *                 example: 10000
 *               dataCriacao:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-07-19T12:24:11.5299601+00:00"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idItem:
 *                       type: string
 *                       example: "2434"
 *                     quantidadeItem:
 *                       type: integer
 *                       example: 1
 *                     valorItem:
 *                       type: number
 *                       example: 1000
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Campos obrigatórios ausentes
 *       409:
 *         description: Pedido já existe
 *       500:
 *         description: Erro interno
 */
router.post('/', createOrder);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Listar todos os pedidos
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *       500:
 *         description: Erro interno
 */
router.get('/list', listOrders);

/**
 * @swagger
 * /order/{numeroPedido}:
 *   get:
 *     summary: Obter pedido pelo número
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: numeroPedido
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb-01
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno
 */
router.get('/:numeroPedido', getOrder);

/**
 * @swagger
 * /order/{numeroPedido}:
 *   put:
 *     summary: Atualizar um pedido pelo número
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: numeroPedido
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valorTotal:
 *                 type: number
 *               dataCriacao:
 *                 type: string
 *                 format: date-time
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idItem:
 *                       type: string
 *                     quantidadeItem:
 *                       type: integer
 *                     valorItem:
 *                       type: number
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno
 */
router.put('/:numeroPedido', updateOrder);

/**
 * @swagger
 * /order/{numeroPedido}:
 *   delete:
 *     summary: Deletar um pedido pelo número
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: numeroPedido
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno
 */
router.delete('/:numeroPedido', deleteOrder);

module.exports = router;
