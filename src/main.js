async function notifyMe() {
    if (!('Notification' in window)) {
        return alert('Este navegador não suporta notificações!');
    }

    if (!('serviceWorker' in navigator)) {
        return alert('Este navegador não suporta service worker!');
    }

    try {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            await registerServiceWorker();
        }
    } catch (error) {
        alert('Erro ao solicitar permissão de notificação!');
        console.error('Erro ao solicitar permissão de notificação:', error);
    }
}

async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('src/service-worker.js');
        alert('Service Worker registrado com sucesso.');
        console.log('Service Worker registrado com sucesso:', registration);
    } catch (error) {
        alert('Erro ao registrar o Service Worker!');
        console.error('Erro ao registrar o Service Worker:', error);
    }
}