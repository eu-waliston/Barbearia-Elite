const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const User = require('../models/User');

exports.createAppointment = async (req, res) => {
    try {
        const { barber, service, date, startTime, notes } = req.body;

        // Verificar se barbeiro existe
        const barberUser = await User.findById(barber);
        if (!barberUser || barberUser.role !== 'barber') {
            return res.status(404).json({ error: 'Barbeiro não encontrado' });
        }

        // Verificar se serviço existe
        const serviceData = await Service.findById(service);
        if (!serviceData) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }

        // Calcular horário de término
        const [hours, minutes] = startTime.split(':').map(Number);
        const start = new Date(date);
        start.setHours(hours, minutes, 0, 0);

        const end = new Date(start.getTime() + serviceData.duration * 60000);
        const endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;

        // Verificar conflitos de horário
        const conflictingAppointment = await Appointment.findOne({
            barber,
            date: new Date(date),
            $or: [
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime }
                }
            ],
            status: { $nin: ['cancelled'] }
        });

        if (conflictingAppointment) {
            return res.status(400).json({ error: 'Horário indisponível' });
        }

        const appointment = new Appointment({
            client: req.user.id,
            barber,
            service,
            date: new Date(date),
            startTime,
            endTime,
            notes,
        });

        await appointment.save();

        // Popular dados relacionados
        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('client', 'name email phone')
            .populate('barber', 'name email phone')
            .populate('service', 'name price duration');

        res.status(201).json(populatedAppointment);
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
};

exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ client: req.user.id })
            .populate('barber', 'name')
            .populate('service', 'name price')
            .sort({ date: -1, startTime: -1 });

        res.json(appointments);
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
};

exports.getBarberAppointments = async (req, res) => {
    try {
        const { barberId } = req.params;
        const { date } = req.query;

        const query = { barber: barberId };
        if (date) {
            query.date = new Date(date);
        }

        const appointments = await Appointment.find(query)
            .populate('client', 'name phone')
            .populate('service', 'name')
            .sort({ date: 1, startTime: 1 });

        res.json(appointments);
    } catch (error) {
        console.error('Erro ao buscar agendamentos do barbeiro:', error);
        res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findOne({
            _id: id,
            client: req.user.id
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        if (appointment.status === 'cancelled') {
            return res.status(400).json({ error: 'Agendamento já cancelado' });
        }

        // Verificar se pode cancelar (pelo menos 2 horas antes)
        const appointmentDate = new Date(appointment.date);
        const appointmentTime = appointment.startTime.split(':');
        appointmentDate.setHours(parseInt(appointmentTime[0]), parseInt(appointmentTime[1]), 0, 0);

        const now = new Date();
        const twoHoursBefore = new Date(appointmentDate.getTime() - 2 * 60 * 60 * 1000);

        if (now > twoHoursBefore) {
            return res.status(400).json({ error: 'Só é possível cancelar até 2 horas antes do horário marcado' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.json({ message: 'Agendamento cancelado com sucesso', appointment });
    } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
        res.status(500).json({ error: 'Erro ao cancelar agendamento' });
    }
};

exports.getAvailableSlots = async (req, res) => {
    try {
        const { barberId, date } = req.query;

        if (!barberId || !date) {
            return res.status(400).json({ error: 'Barbeiro e data são obrigatórios' });
        }

        const barber = await User.findById(barberId);
        if (!barber || barber.role !== 'barber') {
            return res.status(404).json({ error: 'Barbeiro não encontrado' });
        }

        // Buscar agendamentos existentes para a data
        const appointments = await Appointment.find({
            barber: barberId,
            date: new Date(date),
            status: { $nin: ['cancelled'] }
        });

        // Gerar slots disponíveis (9h às 18h, intervalos de 30 minutos)
        const slots = [];
        const workStart = 9; // 9:00
        const workEnd = 18; // 18:00
        const slotDuration = 30; // minutos

        for (let hour = workStart; hour < workEnd; hour++) {
            for (let minute = 0; minute < 60; minute += slotDuration) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

                // Verificar se o slot está disponível
                const isAvailable = !appointments.some(apt => {
                    const aptStart = apt.startTime;
                    const aptEnd = apt.endTime;
                    return time >= aptStart && time < aptEnd;
                });

                if (isAvailable) {
                    slots.push(time);
                }
            }
        }

        res.json(slots);
    } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        res.status(500).json({ error: 'Erro ao buscar horários disponíveis' });
    }
};