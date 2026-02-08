# 🚀 Barbearia Elite — Sistema de Agendamento Fullstack

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)

![Status](https://img.shields.io/badge/status-estável-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

> ✂️ Transformando cortes em experiências digitais.  
Sistema completo de agendamento para barbearias modernas.

---

## ✨ Visão Geral

O **Barbearia Elite** é um sistema de agendamento **Fullstack JavaScript**, desenvolvido para digitalizar o funcionamento de barbearias.  
Clientes podem agendar horários online, barbeiros organizam suas agendas e administradores gerenciam o negócio de forma centralizada.

---

## 🎯 Funcionalidades

### 👤 Cliente
- Cadastro e login
- Visualização de serviços e barbeiros
- Agendamento online
- Cancelamento de horários
- Histórico de agendamentos

### ✂️ Barbeiro
- Visualização da agenda diária
- Gerenciamento de disponibilidade
- Confirmação de atendimentos

### 👑 Administrador
- Gerenciamento de serviços
- Cadastro de barbeiros
- Monitoramento do sistema

---

## 🏗️ Arquitetura do Projeto

```

barber-shop-app/
├── 📂 backend/                 # API Node.js + Express
│   ├── 📂 src/
│   │   ├── 📂 models/         # Modelos Mongoose
│   │   ├── 📂 routes/         # Rotas da API
│   │   ├── 📂 controllers/    # Lógica de negócio
│   │   └── 📄 server.js       # Servidor principal
│   └── 📄 package.json
│
├── 📂 frontend/                # Interface Web
│   ├── 📂 src/
│   │   ├── 📂 css/           # Estilos Sass
│   │   ├── 📂 js/            # JavaScript
│   │   └── 📄 index.html     # Página principal
│   └── 📄 package.json
│
└── 📄 README.md

````
## 🗺️ Diagrama da Arquitetura

<img width="2143" height="2433" alt="Image" src="https://github.com/user-attachments/assets/6b27265a-7d1e-48fa-a80c-957dae3c26c2" />


---

## 🚀 Tecnologias Utilizadas

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT (Autenticação)
- Bcrypt (Criptografia)
- Express Validator

### Frontend
- JavaScript Vanilla
- Sass / SCSS
- Font Awesome
- CSS Grid e Flexbox

### Ferramentas
- Docker (MongoDB)
- Nodemon
- Git
- Concurrently

---

## ⚙️ Instalação e Execução

### 📋 Pré-requisitos
- Node.js 14+
- MongoDB
- Git
- NPM ou Yarn

### 🔧 Passo a passo

```bash
git clone https://github.com/seu-usuario/barber-shop-app.git
cd barber-shop-app
```

### Backend
```
cd backend
npm install
cp .env.example .env
npm run dev
```
### Frontend
```
cd frontend
npm install
npm start
```

### MongoDB com Docker
```
docker run -d -p 27017:27017 --name mongodb mongo
```

## 📡 API — Principais Endpoints

| Método | Endpoint           | Descrição           |
| ------ | ------------------ | ------------------- |
| POST   | /api/auth/register | Registrar usuário   |
| POST   | /api/auth/login    | Login               |
| GET    | /api/auth/me       | Usuário autenticado |


## 📅 Agendamentos

| Método | Endpoint                          | Descrição            |
| ------ | --------------------------------- | -------------------- |
| GET    | /api/appointments/available-slots | Horários disponíveis |
| POST   | /api/appointments                 | Criar agendamento    |
| PUT    | /api/appointments/:id/cancel      | Cancelar agendamento |

## 🧪 Credenciais de Teste

```

Admin:
  email: admin@barbearia.com
  senha: admin123

Cliente:
  email: cliente@exemplo.com
  senha: cliente123
```

<div align="center">

Desenvolvido com ❤️
2024 — Código afiado como navalha ✂️

⭐ Se curtiu, deixa uma estrela no repositório!

</div> ```
