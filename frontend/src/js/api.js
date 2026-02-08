const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            // Verificar se a resposta é JSON
            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || 'Erro na requisição');
            }

            if (!response.ok) {
                throw new Error(data.error || data.message || `Erro ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    // Auth
    async login(email, password) {
        try {
            const data = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            this.setToken(data.token);
            return data.user;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    async register(userData) {
        try {
            const data = await this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData),
            });
            this.setToken(data.token);
            return data.user;
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.request('/auth/me');
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw error;
        }
    }

    // Services
    async getServices() {
        try {
            return await this.request('/services');
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
            return []; // Retorna array vazio em caso de erro
        }
    }

    // Barbers
    async getBarbers() {
        try {
            return await this.request('/barbers');
        } catch (error) {
            console.error('Erro ao buscar barbeiros:', error);
            return []; // Retorna array vazio em caso de erro
        }
    }

    // Appointments
    async getAvailableSlots(barberId, date) {
        try {
            return await this.request(`/appointments/available-slots?barberId=${barberId}&date=${date}`);
        } catch (error) {
            console.error('Erro ao buscar horários:', error);
            return [];
        }
    }

    async createAppointment(appointmentData) {
        try {
            return await this.request('/appointments', {
                method: 'POST',
                body: JSON.stringify(appointmentData),
            });
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            throw error;
        }
    }

    async getMyAppointments() {
        try {
            return await this.request('/appointments/my-appointments');
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
            return [];
        }
    }

    async cancelAppointment(appointmentId) {
        try {
            return await this.request(`/appointments/${appointmentId}/cancel`, {
                method: 'PUT',
            });
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error);
            throw error;
        }
    }
}

// Cria a instância global
window.api = new ApiService();