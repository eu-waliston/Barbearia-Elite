class BookingManager {
    constructor() {
        this.currentStep = 1;
        this.selectedService = null;
        this.selectedBarber = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.bookingData = {
            service: null,
            barber: null,
            date: null,
            startTime: null,
            notes: ''
        };
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        this.initialized = true;

        try {
            await this.loadServices();
            await this.loadBarbers();
            this.setupEventListeners();
            this.updateFormSteps();
        } catch (error) {
            console.error('Erro na inicialização:', error);
        }
    }

    async loadServices() {
        try {
            const services = await window.api.getServices();
            const container = document.getElementById('services-container');
            const selectContainer = document.getElementById('service-select');

            if (!container || !selectContainer) {
                setTimeout(() => this.loadServices(), 100);
                return;
            }

            container.innerHTML = '';
            selectContainer.innerHTML = '';

            if (services.length === 0) {
                container.innerHTML = '<p>Nenhum serviço disponível</p>';
                selectContainer.innerHTML = '<p>Nenhum serviço disponível</p>';
                return;
            }

            services.forEach(service => {
                // Card para exibição
                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <div class="service-card-icon">
                        <i class="fas ${this.getServiceIcon(service.category)}"></i>
                    </div>
                    <h3 class="service-card-title">${service.name}</h3>
                    <p class="service-card-description">${service.description}</p>
                    <div class="service-card-price">R$ ${service.price.toFixed(2)}</div>
                    <div class="service-card-duration">${service.duration} minutos</div>
                `;
                container.appendChild(card);

                // Opção para seleção
                const option = document.createElement('div');
                option.className = 'service-option';
                option.dataset.serviceId = service._id;
                option.innerHTML = `
                    <h4>${service.name}</h4>
                    <p>R$ ${service.price.toFixed(2)}</p>
                    <p>${service.duration} min</p>
                `;

                option.addEventListener('click', () => this.selectService(service._id));
                selectContainer.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
        }
    }

async loadBarbers() {
    try {
        // Tenta buscar da API
        let barbers = [];
        try {
            barbers = await window.api.getBarbers();
        } catch (apiError) {
            console.warn('API error, using mock data:', apiError);
            // Dados mock para desenvolvimento
            barbers = [
                {
                    _id: '1',
                    name: 'João Silva',
                    email: 'joao@barbearia.com',
                    phone: '(11) 98888-8888',
                    rating: 4.5
                },
                {
                    _id: '2',
                    name: 'Pedro Santos',
                    email: 'pedro@barbearia.com',
                    phone: '(11) 97777-7777',
                    rating: 4.8
                },
                {
                    _id: '3',
                    name: 'Carlos Oliveira',
                    email: 'carlos@barbearia.com',
                    phone: '(11) 96666-6666',
                    rating: 4.7
                }
            ];
        }

        const container = document.getElementById('barbers-container');
        const selectContainer = document.getElementById('barber-select');

        if (!container || !selectContainer) {
            setTimeout(() => this.loadBarbers(), 100);
            return;
        }

        container.innerHTML = '';
        selectContainer.innerHTML = '';

        if (barbers.length === 0) {
            container.innerHTML = '<p>Nenhum barbeiro disponível no momento</p>';
            selectContainer.innerHTML = '<p>Nenhum barbeiro disponível</p>';
            return;
        }

        barbers.forEach(barber => {
            // Card para exibição
            const card = document.createElement('div');
            card.className = 'barber-card';
            card.innerHTML = `
                <div class="barber-card-avatar">
                    <i class="fas fa-user-circle fa-3x"></i>
                </div>
                <h3 class="barber-card-title">${barber.name}</h3>
                <p class="barber-card-description">Especialista em cortes modernos</p>
                <div class="barber-card-rating">
                    ${this.generateStars(barber.rating || 4.5)}
                </div>
            `;
            container.appendChild(card);

            // Opção para seleção
            const option = document.createElement('div');
            option.className = 'barber-option';
            option.dataset.barberId = barber._id || barber.id;
            option.innerHTML = `
                <h4>${barber.name}</h4>
                <p>${barber.phone || 'Disponibilidade: Seg-Sex'}</p>
                <div class="barber-rating">${this.generateStars(barber.rating || 4.5)}</div>
            `;

            option.addEventListener('click', () => this.selectBarber(barber._id || barber.id));
            selectContainer.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar barbeiros:', error);
    }
}
    getServiceIcon(category) {
        const icons = {
            'haircut': 'fa-cut',
            'beard': 'fa-leaf',
            'combo': 'fa-spa',
            'other': 'fa-scissors'
        };
        return icons[category] || 'fa-scissors';
    }

    generateStars(rating) {
        const stars = Math.round(rating);
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= stars) {
                html += '<i class="fas fa-star" style="color: #FFD700;"></i>';
            } else {
                html += '<i class="far fa-star" style="color: #FFD700;"></i>';
            }
        }
        return html;
    }

    selectService(serviceId) {
        this.selectedService = serviceId;
        this.bookingData.service = serviceId;

        // Remover seleção anterior
        document.querySelectorAll('.service-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Adicionar seleção atual
        const selected = document.querySelector(`.service-option[data-service-id="${serviceId}"]`);
        if (selected) selected.classList.add('selected');

        // Avançar para próximo passo
        setTimeout(() => {
            this.goToStep(2);
        }, 300);
    }

    selectBarber(barberId) {
        this.selectedBarber = barberId;
        this.bookingData.barber = barberId;

        // Remover seleção anterior
        document.querySelectorAll('.barber-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Adicionar seleção atual
        const selected = document.querySelector(`.barber-option[data-barber-id="${barberId}"]`);
        if (selected) selected.classList.add('selected');

        // Avançar para próximo passo
        setTimeout(() => {
            this.goToStep(3);
        }, 300);
    }

    async selectDate(date) {
        if (!date) return;

        this.selectedDate = date;
        this.bookingData.date = date;

        // Atualizar input de data
        const dateInput = document.getElementById('appointment-date');
        if (dateInput) {
            dateInput.value = date;
            // Definir data mínima (hoje)
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }

        // Carregar horários disponíveis
        await this.loadAvailableSlots();
    }

    async loadAvailableSlots() {
        if (!this.selectedBarber || !this.selectedDate) return;

        try {
            const slots = await window.api.getAvailableSlots(this.selectedBarber, this.selectedDate);
            const container = document.getElementById('time-slots');

            if (!container) return;

            if (slots.length === 0) {
                container.innerHTML = '<p class="no-slots">Nenhum horário disponível para esta data</p>';
                return;
            }

            container.innerHTML = '';

            slots.forEach(slot => {
                const slotElement = document.createElement('div');
                slotElement.className = 'time-slot';
                slotElement.textContent = slot;
                slotElement.dataset.time = slot;

                slotElement.addEventListener('click', () => this.selectTime(slot));
                container.appendChild(slotElement);
            });
        } catch (error) {
            console.error('Erro ao carregar horários:', error);
        }
    }

    selectTime(time) {
        this.selectedTime = time;
        this.bookingData.startTime = time;

        // Remover seleção anterior
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Adicionar seleção atual
        const selected = document.querySelector(`.time-slot[data-time="${time}"]`);
        if (selected) selected.classList.add('selected');

        // Avançar para confirmação
        setTimeout(() => {
            this.goToStep(4);
            this.updateSummary();
        }, 300);
    }

    async createAppointment() {
        try {
            if (!window.auth.currentUser) {
                window.showNotification('Faça login para agendar', 'error');
                window.auth.openModal();
                return;
            }

            if (!this.bookingData.service || !this.bookingData.barber || !this.bookingData.date || !this.bookingData.startTime) {
                window.showNotification('Preencha todos os campos', 'error');
                return;
            }

            const appointment = await window.api.createAppointment(this.bookingData);
            window.showNotification('Agendamento criado com sucesso!', 'success');

            // Resetar formulário
            this.resetForm();

            return appointment;
        } catch (error) {
            window.showNotification(error.message || 'Erro ao criar agendamento', 'error');
        }
    }

    updateSummary() {
        const summaryContainer = document.querySelector('.appointment-summary');
        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <h4>Resumo do Agendamento</h4>
                <p><strong>Serviço:</strong> ${this.selectedService || 'Não selecionado'}</p>
                <p><strong>Barbeiro:</strong> ${this.selectedBarber || 'Não selecionado'}</p>
                <p><strong>Data:</strong> ${this.selectedDate || 'Não selecionada'}</p>
                <p><strong>Horário:</strong> ${this.selectedTime || 'Não selecionado'}</p>
            `;
        }
    }

    goToStep(step) {
        if (step < 1 || step > 4) return;
        this.currentStep = step;
        this.updateFormSteps();
    }

    updateFormSteps() {
        // Esconder todos os passos
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // Mostrar passo atual
        const stepName = this.getStepName(this.currentStep);
        const currentStep = document.getElementById(`step-${stepName}`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
    }

    getStepName(step) {
        const steps = {
            1: 'service',
            2: 'barber',
            3: 'date',
            4: 'confirm'
        };
        return steps[step] || 'service';
    }

    resetForm() {
        this.currentStep = 1;
        this.selectedService = null;
        this.selectedBarber = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.bookingData = {
            service: null,
            barber: null,
            date: null,
            startTime: null,
            notes: ''
        };

        // Resetar seleções visuais
        document.querySelectorAll('.service-option, .barber-option, .time-slot').forEach(el => {
            el.classList.remove('selected');
        });

        // Limpar inputs
        const dateInput = document.getElementById('appointment-date');
        if (dateInput) dateInput.value = '';

        const timeSlots = document.getElementById('time-slots');
        if (timeSlots) timeSlots.innerHTML = '';

        // Voltar para primeiro passo
        this.updateFormSteps();
    }

    setupEventListeners() {
        // Data picker
        const dateInput = document.getElementById('appointment-date');
        if (dateInput) {
            dateInput.addEventListener('change', (e) => {
                this.selectDate(e.target.value);
            });
        }

        // Botão "Agendar Agora"
        const bookNow = document.getElementById('book-now');
        if (bookNow) {
            bookNow.addEventListener('click', () => {
                this.goToStep(1);
                const bookingSection = document.getElementById('booking');
                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Botão de confirmação
        const confirmBtn = document.getElementById('confirm-booking');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', async () => {
                await this.createAppointment();
            });
        }

        // Adicionar navegação entre passos
        this.addNavigationButtons();
    }

    addNavigationButtons() {
        // Adicionar botões de próximo/anterior se não existirem
        const steps = document.querySelectorAll('.form-step');
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            if (!step.querySelector('.form-navigation')) {
                const nav = document.createElement('div');
                nav.className = 'form-navigation';

                if (stepNumber > 1) {
                    const prevBtn = document.createElement('button');
                    prevBtn.className = 'btn btn-outline';
                    prevBtn.textContent = 'Anterior';
                    prevBtn.onclick = () => this.goToStep(stepNumber - 1);
                    nav.appendChild(prevBtn);
                }

                if (stepNumber < 4) {
                    const nextBtn = document.createElement('button');
                    nextBtn.className = 'btn btn-primary';
                    nextBtn.textContent = 'Próximo';
                    nextBtn.onclick = () => this.goToStep(stepNumber + 1);
                    nav.appendChild(nextBtn);
                }

                step.appendChild(nav);
            }
        });
    }
}

// Cria a instância global
window.bookingManager = new BookingManager();

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.bookingManager.init();
});