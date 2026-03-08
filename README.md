# API de Pedidos

API REST em Node.js para gerenciamento de pedidos, com autenticacao JWT, PostgreSQL e documentacao Swagger.

## Tecnologias

- Node.js 20
- Express
- Sequelize (ORM)
- PostgreSQL 16
- JWT para autenticacao
- Swagger para documentacao
- Docker e Docker Compose

## Pre-requisitos

- Docker e Docker Compose instalados

## Como rodar

1. Clone o repositorio:

```bash
git clone <url-do-repositorio>
cd apinode
```

2. Crie o arquivo `.env` copiando o exemplo (ja vem com os valores prontos para uso local):

```bash
cp .env.example .env
```

Conteudo do `.env.example`:

```
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=jitterbit
DB_USER=jitterbit
DB_PASSWORD=jitterbit

JWT_SECRET=KvR5tJFUpjVz9BnBlQtDaaWN
JWT_EXPIRES_IN=15m
JWT_USER=admin
JWT_PASSWORD=admin123
```

3. Suba os containers:

```bash
docker compose up --build
```

A API vai estar disponivel em `http://localhost:3000` e o banco de dados e criado automaticamente pelo Sequelize.

## Documentacao da API

Acesse o Swagger UI em:

```
http://localhost:3000/api-docs
```

## Endpoints

### Autenticacao

| Metodo | Rota           | Descricao              | Auth |
|--------|----------------|------------------------|------|
| POST   | /auth/login    | Obter token JWT        | Nao  |

### Pedidos

| Metodo | Rota                    | Descricao              | Auth |
|--------|-------------------------|------------------------|------|
| POST   | /order                  | Criar pedido           | Sim  |
| GET    | /order/list             | Listar todos os pedidos| Sim  |
| GET    | /order/:numeroPedido    | Buscar pedido por ID   | Sim  |
| PUT    | /order/:numeroPedido    | Atualizar pedido       | Sim  |
| DELETE | /order/:numeroPedido    | Remover pedido         | Sim  |

## Passo a passo de uso

### 1. Obter o token

Faca uma requisicao POST para `/auth/login`:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Resposta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Copie o valor do token. Ele expira em 15 minutos.

### 2. Criar um pedido

Use o token no header `Authorization`:

```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "valorTotal": 10000,
    "dataCriacao": "2026-03-07T12:00:00.000+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }'
```

### 3. Listar pedidos

```bash
curl http://localhost:3000/order/list \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 4. Buscar pedido por numero

```bash
curl http://localhost:3000/order/NUMERO_DO_PEDIDO \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 5. Atualizar pedido

```bash
curl -X PUT http://localhost:3000/order/NUMERO_DO_PEDIDO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "valorTotal": 15000,
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 2,
        "valorItem": 7500
      }
    ]
  }'
```

### 6. Remover pedido

```bash
curl -X DELETE http://localhost:3000/order/NUMERO_DO_PEDIDO \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Estrutura do projeto

```
apinode/
  server.js                      # Ponto de entrada
  Dockerfile                     # Imagem Docker da API
  docker-compose.yml             # Orquestracao dos containers
  src/
    app.js                       # Configuracao do Express e rotas
    config/
      database.js                # Conexao com PostgreSQL via Sequelize
    controllers/
      authController.js          # Login e geracao de token
      orderController.js         # CRUD de pedidos
    middlewares/
      auth.js                    # Validacao do token JWT
    models/
      Order.js                   # Modelo de pedido
      Item.js                    # Modelo de item do pedido
    routes/
      authRoutes.js              # Rotas de autenticacao
      orderRoutes.js             # Rotas de pedidos (com Swagger)
```

## Variaveis de ambiente

| Variavel       | Descricao                    | Exemplo        |
|----------------|------------------------------|----------------|
| PORT           | Porta da API                 | 3000           |
| DB_HOST        | Host do PostgreSQL           | localhost      |
| DB_PORT        | Porta do PostgreSQL          | 5432           |
| DB_NAME        | Nome do banco                | jitterbit      |
| DB_USER        | Usuario do banco             | jitterbit      |
| DB_PASSWORD    | Senha do banco               | jitterbit      |
| JWT_SECRET     | Chave secreta do JWT         | (string)       |
| JWT_EXPIRES_IN | Tempo de expiracao do token  | 15m            |
| JWT_USER       | Usuario para login           | admin          |
| JWT_PASSWORD   | Senha para login             | admin123       |
