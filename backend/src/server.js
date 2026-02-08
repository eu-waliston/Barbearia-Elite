const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const barberRoutes = require('./routes/barbers');
const serviceRoutes = require('./routes/services');
const seedRoutes = require('./routes/seed'); // ← CORRIGIDO: './routes/seed'
const statusRoutes = require('./routes/status');

// Usar rotas
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/status', statusRoutes);

// Rota para teste rápido
app.get('/', (req, res) => {
    res.json({
        message: 'Bem-vindo à Barbearia Elite API! ✂️',
        description: 'Sistema de agendamento para barbearias',
        version: '1.0.0',
        documentation: 'Acesse /api para ver todos os endpoints',
        frontend: 'http://localhost:3000',
        api: 'http://localhost:5000/api',
        endpoints: {
            api: 'GET /api',
            auth: 'POST /api/auth/login, POST /api/auth/register',
            services: 'GET /api/services',
            barbers: 'GET /api/barbers',
            appointments: 'GET /api/appointments/available-slots, POST /api/appointments'
        },
        quickStart: 'Execute "npm run seed" no backend para criar dados de teste'
    });
});

// Conexão MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbershop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('✅ Conectado ao MongoDB');

        // Verificar dados iniciais
        const User = require('./models/User');
        const Service = require('./models/Service');

        const userCount = await User.countDocuments();
        const serviceCount = await Service.countDocuments();

        console.log(`📊 Estatísticas do banco:`);
        console.log(`   👥 Usuários: ${userCount}`);
        console.log(`   ✂️  Serviços: ${serviceCount}`);

        if (userCount === 0 || serviceCount === 0) {
            console.log('\n⚠️  Banco de dados vazio!');
            console.log('📝 Execute o comando para popular o banco:');
            console.log('   cd backend && npm run seed');
        }
    })
    .catch(err => {
        console.error('❌ Erro na conexão com MongoDB:', err.message);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Frontend: http://localhost:3000`);
    console.log(`🔧 API: http://localhost:5000`);
    console.log(`📚 Documentação: http://localhost:5000/api\n`);
});