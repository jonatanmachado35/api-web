# NestJS Auth API

Esta API foi construída com [NestJS](https://nestjs.com/) e fornece autenticação utilizando JWT e refresh tokens.

## Requisitos

- Node.js 18+
- npm

## Instalação

```bash
npm install
```

## Executar em modo desenvolvimento

```bash
npm run start:dev
```

A aplicação será executada em `http://localhost:3000`.

## Build e execução em produção

```bash
npm run build
npm start
```

## Endpoints principais

- `POST /auth/register` – Cria um novo usuário (email, senha e nome).
- `POST /auth/login` – Autentica um usuário e retorna tokens de acesso e refresh.
- `POST /auth/refresh` – Gera um novo par de tokens a partir de um refresh token válido.
- `GET /users/me` – Retorna o perfil do usuário autenticado (necessário enviar o Bearer Token de acesso).

## Variáveis de ambiente

- `JWT_ACCESS_SECRET` – Segredo utilizado na assinatura dos tokens de acesso (padrão: `access-secret`).
- `JWT_REFRESH_SECRET` – Segredo utilizado na assinatura dos refresh tokens (padrão: `refresh-secret`).
- `PORT` – Porta da aplicação (padrão: `3000`).

## Observação

Os usuários são armazenados em memória apenas para fins de demonstração.
