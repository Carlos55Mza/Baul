importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDEwSHLN9du40_SkzU7IzONQdSow9CBqu0",
    authDomain: "estacion-zuniga.firebaseapp.com",
    projectId: "estacion-zuniga",
    storageBucket: "estacion-zuniga.firebasestorage.app",
    messagingSenderId: "717556109707",
    appId: "1:717556109707:web:e48a9bc10ac6ec86909f8e"
});

const messaging = firebase.messaging();

// Este código escucha cuando llega la alerta y la muestra en el celu
messaging.onBackgroundMessage((payload) => {
  console.log('Alerta recibida en segundo plano: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'icono-estacion.png' // Asegurate de tener este logo o cambiale el nombre
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});