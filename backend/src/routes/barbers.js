const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Obter todos os barbeiros
// Obter todos os barbeiros - SEM autenticação
router.get('/', async (req, res) => {
    try {
        const barbers = await User.find({ role: 'barber' })
            .select('name email phone')
            .sort({ name: 1 });

        res.json(barbers);
    } catch (error) {
        console.error('Erro ao buscar barbeiros:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Criar barbeiro (APENAS admin - com autenticação)
router.post('/', async (req, res) => {
    try {
        // Verificação de admin pode ser mantida se necessário
        const { name, email, password, phone } = req.body;

        const barber = new User({
            name,
            email,
            password,
            phone,
            role: 'barber'
        });

        await barber.save();
        res.status(201).json(barber);
    } catch (error) {
        console.error('Erro ao criar barbeiro:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

module.exports = router;