const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Health check simples
router.get('/', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        memory: process.memoryUsage(),
        nodeVersion: process.version
    });
});

// Health check detalhado
router.get('/health', async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const dbStatus = dbState === 1 ? 'healthy' : 'unhealthy';

        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                database: {
                    status: dbStatus,
                    connectionState: dbState
                },
                api: {
                    status: 'healthy',
                    responseTime: 'normal'
                }
            },
            system: {
                uptime: process.uptime(),
                memory: {
                    rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
                    heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
                    heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
                },
                nodeVersion: process.version
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

module.exports = router;