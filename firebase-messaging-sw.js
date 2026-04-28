importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    // ACÁ PEGA TU CONFIGURACIÓN DE FIREBASE (la que ya tenés en el index)
    apiKey: "AIzaSyDEwSHLN9du40_SkzU7IzONQdSow9CBqu0"",
    projectId: "estacion-zuniga",
    messagingSenderId: "717556109707",
    appId: "1:717556109707:web:e48a9bc10ac6ec86909f8e"
});

const messaging = firebase.messaging();

// Este código recibe el sismo y muestra la alerta aunque la app esté cerrada
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icono.png', // Podés poner tu logo
        vibrate: [200, 100, 200], // Hace vibrar el celular
        tag: 'alerta-sismo'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});