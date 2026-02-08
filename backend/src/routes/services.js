const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// Obter todos os serviços
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({ active: true });
        res.json(services);
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Criar serviço (apenas admin)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const { name, description, duration, price, category } = req.body;

        const service = new Service({
            name,
            description,
            duration,
            price,
            category
        });

        await service.save();
        res.status(201).json(service);
    } catch (error) {
        console.error('Erro ao criar serviço:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

module.exports = router;