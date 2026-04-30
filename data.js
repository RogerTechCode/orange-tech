/**
 * Orange FC Data Management
 * Handles localStorage and default data
 */

const DEFAULT_DATA = {
    news: [
        {
            id: '1',
            title: 'Vitória no Clássico Sub-17',
            date: '2024-03-24',
            excerpt: 'Orange FC vence rival em partida emocionante no final de semana...',
            content: 'Nossa equipe sub-17 conquistou uma vitória importante neste final de semana contra o rival local. Com um placar de 3 a 1, os atletas demonstraram garra e aplicação tática impecável.',
            imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80',
            isFeatured: true
        },
        {
            id: '2',
            title: 'Inauguração do Novo CT',
            date: '2024-03-20',
            excerpt: 'Novo Centro de Treinamento conta com tecnologia de ponta para a base...',
            content: 'O Orange Futebol Clube inaugurou hoje suas novas instalações. O espaço conta com equipamentos modernos e campos de padrão internacional.',
            imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
            isFeatured: false
        }
    ],
    managers: [
        { id: 'm1', name: 'Rodrigo Cesar', position: 'Presidente', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
        { id: 'm2', name: 'Julio Pereira', position: 'Diretora Executiva', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' }
    ],
    coaches: [
        { id: 'c1', name: 'Ricardo Silva', specialty: 'Treinador Principal', imageUrl: 'https://images.unsplash.com/photo-1519085185758-20ddbbd2ba09?w=400&h=400&fit=crop' },
        { id: 'c2', name: 'Marcos Ferreira', specialty: 'Auxiliar Técnico', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' }
    ],
    sponsors: [
        { id: 's1', name: 'Nike', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0yMSA3Yy00LjUtLjUtNyAyLTkgNWwtMS0zYy00IDAtNyAyIDkgNS0yLjUgMS01IDMtNyA0IDIgNSAxMCAxIDExLjh6Ii8+PC9zdmc+' },
        { id: 's2', name: 'Adidas', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0zIDExaDRsMy02SDR6bTUgMGg0bDMtNkg5em01IDBoNGwzLTZIMTR6Ii8+PC9zdmc+' },
        { id: 's3', name: 'Puma', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0yIDEyaDIwYy0yLjUtMi01LTMtOC0zLTIuNSAwLTUgMS03IDMtMy41LTMtNi0zLTYtM3oiLz48L3N2Zz4=' },
        { id: 's4', name: 'Fensor', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAyTDQgNnYxMmw4IDQgOC00VjZ6bTAgMThsLTItMXYtMmw0IDJ6Ii8+PC9zdmc+' }
    ],
    locations: [
        {
            id: 'l1',
            name: 'Arena Principal',
            description: 'Nosso centro de excelência em treinamento e formação de novos talentos.',
            details: ['Campo Oficial', 'Vestiários', 'Academia', 'Lounge'],
            address: 'Rua das Flores, 123 - Recife, PE',
            phone: '(81) 98888-7777',
            imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop'
        },
        {
            id: 'l2',
            name: 'Unidade 2',
            description: 'Unidade estratégica para treinamentos táticos e fundamentos técnicos.',
            details: ['Campos de Treinamento', 'Área de Fundamentos', 'Suporte Técnico'],
            address: 'Av. Boa Viagem, 100 - Recife - PE',
            phone: '(81) 97777-6666',
            imageUrl: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&h=600&fit=crop'
        }
    ]
};

const DataManager = {
    init: () => {
        if (!localStorage.getItem('ofc_data_init_v3')) {
            Object.keys(DEFAULT_DATA).forEach(key => {
                localStorage.setItem(key, JSON.stringify(DEFAULT_DATA[key]));
            });
            localStorage.setItem('ofc_data_init_v3', 'true');
        }
    },
    get: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
};

DataManager.init();
