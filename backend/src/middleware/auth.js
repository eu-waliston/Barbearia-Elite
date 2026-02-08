const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
    try {
        // Obter token do header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo_aqui');

        // Buscar usuário
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado.' });
        }

        // Adicionar usuário à requisição
        req.user = user;
        next();
    } catch (error) {
        console.error('Erro na autenticação:', error);
        res.status(401).json({ error: 'Token inválido.' });
    }
};