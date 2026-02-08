const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

// Criar agendamento
router.post('/',
    auth,
    [
        check('barber', 'Barbeiro é obrigatório').not().isEmpty(),
        check('service', 'Serviço é obrigatório').not().isEmpty(),
        check('date', 'Data é obrigatória').not().isEmpty(),
        check('startTime', 'Horário é obrigatório').not().isEmpty(),
    ],
    appointmentController.createAppointment
);

// Obter meus agendamentos
router.get('/my-appointments', auth, appointmentController.getMyAppointments);

// Obter agendamentos de um barbeiro
router.get('/barber/:barberId', auth, appointmentController.getBarberAppointments);

// Cancelar agendamento
router.put('/:id/cancel', auth, appointmentController.cancelAppointment);

// Obter horários disponíveis
router.get('/available-slots', auth, appointmentController.getAvailableSlots);

module.exports = router;