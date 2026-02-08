const express = require('express');
const router = express.Router();

// Rota principal da API
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🚀 API Barbearia Elite - Sistema de Agendamento',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        documentation: 'Todos os endpoints disponíveis abaixo',

        endpoints: {
            // Autenticação
            auth: {
                register: {
                    method: 'POST',
                    path: '/api/auth/register',
                    description: 'Registrar novo usuário',
                    body: {
                        name: 'string (obrigatório)',
                        email: 'string (obrigatório)',
                        password: 'string (obrigatório, min 6 caracteres)',
                        phone: 'string (obrigatório)',
                        role: 'string (opcional: client, barber, admin)'
                    }
                },
                login: {
                    method: 'POST',
                    path: '/api/auth/login',
                    description: 'Fazer login',
                    body: {
                        email: 'string (obrigatório)',
                        password: 'string (obrigatório)'
                    }
                },
                me: {
                    method: 'GET',
                    path: '/api/auth/me',
                    description: 'Obter usuário atual (requer token)',
                    headers: {
                        Authorization: 'Bearer <token>'
                    }
                }
            },

            // Serviços
            services: {
                list: {
                    method: 'GET',
                    path: '/api/services',
                    description: 'Listar todos os serviços'
                },
                create: {
                    method: 'POST',
                    path: '/api/services',
                    description: 'Criar novo serviço (apenas admin)',
                    body: {
                        name: 'string (obrigatório)',
                        description: 'string (obrigatório)',
                        duration: 'number (obrigatório, em minutos)',
                        price: 'number (obrigatório)',
                        category: 'string (obrigatório: haircut, beard, combo, other)'
                    }
                }
            },

            // Barbeiros
            barbers: {
                list: {
                    method: 'GET',
                    path: '/api/barbers',
                    description: 'Listar todos os barbeiros (requer token)'
                }
            },

            // Agendamentos
            appointments: {
                create: {
                    method: 'POST',
                    path: '/api/appointments',
                    description: 'Criar novo agendamento (requer token)',
                    body: {
                        barber: 'string (obrigatório, ID do barbeiro)',
                        service: 'string (obrigatório, ID do serviço)',
                        date: 'string (obrigatório, formato YYYY-MM-DD)',
                        startTime: 'string (obrigatório, formato HH:MM)',
                        notes: 'string (opcional)'
                    }
                },
                myAppointments: {
                    method: 'GET',
                    path: '/api/appointments/my-appointments',
                    description: 'Listar meus agendamentos (requer token)'
                },
                availableSlots: {
                    method: 'GET',
                    path: '/api/appointments/available-slots',
                    description: 'Consultar horários disponíveis (requer token)',
                    query: {
                        barberId: 'string (obrigatório, ID do barbeiro)',
                        date: 'string (obrigatório, formato YYYY-MM-DD)'
                    }
                },
                cancel: {
                    method: 'PUT',
                    path: '/api/appointments/:id/cancel',
                    description: 'Cancelar agendamento (requer token)'
                }
            },

            // Utilitários
            utilities: {
                status: {
                    method: 'GET',
                    path: '/api/status',
                    description: 'Verificar status do sistema'
                },
                health: {
                    method: 'GET',
                    path: '/api/health',
                    description: 'Health check do servidor'
                },
                seed: {
                    method: 'POST',
                    path: '/api/seed/create-test-data',
                    description: 'Criar dados de teste (apenas desenvolvimento)'
                }
            }
        },

        examples: {
            login: {
                curl: `curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"cliente@exemplo.com","password":"cliente123"}'`
            },
            listServices: {
                curl: `curl http://localhost:5000/api/services`
            },
            createAppointment: {
                curl: `curl -X POST http://localhost:5000/api/appointments \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <seu_token>" \\
  -d '{"barber":"<barber_id>","service":"<service_id>","date":"2024-01-15","startTime":"14:00"}'`
            }
        },

        frontend: 'http://localhost:3000',
        support: 'suporte@barbeariaelite.com'
    });
});

module.exports = router;