const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
require('dotenv').config();

async function seedDatabase() {
    try {
        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbershop');
        console.log('Conectado ao MongoDB para seeding');

        // Limpar coleções
        await User.deleteMany({});
        await Service.deleteMany({});
        console.log('Coleções limpas');

        // Criar admin
        const admin = new User({
            name: 'Administrador',
            email: 'admin@barbearia.com',
            password: 'admin123',
            phone: '(11) 99999-9999',
            role: 'admin'
        });
        await admin.save();
        console.log('Admin criado');

        // Criar barbeiros
        const barbers = [
            {
                name: 'João Silva',
                email: 'joao@barbearia.com',
                password: 'barber123',
                phone: '(11) 98888-8888',
                role: 'barber'
            },
            {
                name: 'Pedro Santos',
                email: 'pedro@barbearia.com',
                password: 'barber123',
                phone: '(11) 97777-7777',
                role: 'barber'
            },
            {
                name: 'Carlos Oliveira',
                email: 'carlos@barbearia.com',
                password: 'barber123',
                phone: '(11) 96666-6666',
                role: 'barber'
            }
        ];

        for (const barberData of barbers) {
            const barber = new User(barberData);
            await barber.save();
        }
        console.log('Barbeiros criados');

        // Criar serviços
        const services = [
            {
                name: 'Corte de Cabelo',
                description: 'Corte moderno com técnicas profissionais',
                duration: 30,
                price: 35.00,
                category: 'haircut'
            },
            {
                name: 'Barba',
                description: 'Aparo e modelagem de barba com toalha quente',
                duration: 30,
                price: 25.00,
                category: 'beard'
            },
            {
                name: 'Corte + Barba',
                description: 'Corte de cabelo e barba com acabamento completo',
                duration: 60,
                price: 50.00,
                category: 'combo'
            },
            {
                name: 'Hidratação Capilar',
                description: 'Tratamento para cabelos ressecados',
                duration: 45,
                price: 40.00,
                category: 'other'
            },
            {
                name: 'Sobrancelha',
                description: 'Design e modelagem de sobrancelhas',
                duration: 20,
                price: 15.00,
                category: 'other'
            }
        ];

        for (const serviceData of services) {
            const service = new Service(serviceData);
            await service.save();
        }
        console.log('Serviços criados');

        // Criar cliente de exemplo
        const client = new User({
            name: 'Cliente Exemplo',
            email: 'cliente@exemplo.com',
            password: 'cliente123',
            phone: '(11) 95555-5555',
            role: 'client'
        });
        await client.save();
        console.log('Cliente exemplo criado');

        console.log('Seeding completado com sucesso!');
        console.log('\nCredenciais de acesso:');
        console.log('Admin: admin@barbearia.com / admin123');
        console.log('Cliente: cliente@exemplo.com / cliente123');
        console.log('Barbeiros: joao@barbearia.com / barber123');

        process.exit(0);
    } catch (error) {
        console.error('Erro no seeding:', error);
        process.exit(1);
    }
}

module.exports = seedDatabase;