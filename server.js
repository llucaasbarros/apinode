require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');

require('./src/models/Order');
require('./src/models/Item');

const PORT = process.env.PORT || 3000;

sequelize
    .sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1);
    });
