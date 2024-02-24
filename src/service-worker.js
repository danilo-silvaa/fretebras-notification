const checkingInterval = 10; // Intervalo de verificação em segundos
const url = 'https://site-bff.fretebras.com.br/freights?per_page=1&hashed_origin_id=yL0a&hashed_origin_state_id=ze&vehicle_bodies[]=Cs&vehicle_types[]=5p';

const lastFreight = {};

function checkFreights() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.data || !data.data.freights || !data.data.freights.length) {
                return console.error('Erro ao buscar dados da API ou nenhum frete encontrado! :(');
            }

            const [freight] = data.data.freights;
            if (freight.id === lastFreight.id || (lastFreight.register_date && freight.register_date < lastFreight.register_date)) {
                return;
            }
            
            showNotification(freight);
            lastFreight.id = freight.id;
            lastFreight.register_date = freight.register_date;
        })
        .catch(error => console.error('Erro ao processar a resposta da API:', error));
}

function showNotification(freight) {
    const relativeTime = convertTimestampToRelative(new Date(freight.register_date));

    const options = {
        body: `Produto: ${freight.load}\nDestino: ${freight.destination.city}-${freight.destination.state}\nAdicionado há: ${relativeTime}`,
        icon: '../images/icon.png',
        data: {
            url: `https://www.fretebras.com.br/${freight.url_path}`,
        },
    };

    self.registration.showNotification('Novo Frete:', options);
}

function convertTimestampToRelative(timestampSeconds) {
    const now = new Date();
    now.toLocaleString('pt-BR');

    const timestampMilliseconds = timestampSeconds * 1000;
    const timeDifferenceMilliseconds = now.getTime() - timestampMilliseconds;

    const minutes = Math.floor(timeDifferenceMilliseconds / (60 * 1000));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} dia${days > 1 ? 's' : ''} atrás`;
    } else if (hours > 0) {
        return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    } else if (minutes > 0) {
        return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
    } else {
        return 'Alguns segundos atrás';
    }
}

addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.notification.data && event.notification.data.url) {
        clients.openWindow(event.notification.data.url);
    }
});

checkFreights();
setInterval(checkFreights, checkingInterval * 1000);