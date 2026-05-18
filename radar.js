// =========================================================================
// MÓDULO RADAR MULTICAPA ORIGINAL - ESTACIÓN ZÚÑIGA 🛰️
// =========================================================================

function anexarMóduloRadar() {
    const contenedor = document.getElementById('contenedor-radar');
    if (!contenedor) return;

    // Inyectamos los estilos de Leaflet y la tarjeta transparente adaptada
    contenedor.innerHTML = `
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        
        <style>
            /* REFUERZO DE COLOR ORIGINAL DE TU APP */
            .capa-clima-fuerte {
                filter: saturate(4) contrast(1.5) brightness(1.1) !important;
            }
            .satelite-fondo { 
                filter: brightness(0.6) contrast(1.1); 
            }
            /* Adaptamos el selector de capas original al estilo del búnker */
            .leaflet-control-layers {
                background: rgba(0, 0, 0, 0.75) !important;
                color: white !important;
                border: 1px solid rgba(255, 255, 255, 0.3) !important;
                border-radius: 10px !important;
                font-family: 'Segoe UI', sans-serif !important;
                font-size: 0.8rem !important;
                text-align: left !important;
            }
        </style>

        <div class="card-transparente" style="margin-top: 25px; max-width: 650px; width: 100%; margin-left: auto; margin-right: auto; padding: 15px;">
            <div style="font-size: 0.9rem; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; border-bottom: 1px solid var(--glass-border); padding-bottom: 8px;">
                🛰️ MONITOR MULTICAPA ZÚÑIGA
            </div>
            
            <div id="mapa-sistema" style="width: 100%; height: 420px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 5;"></div>
            
            <p style="font-size: 0.8rem; color: #ced4da; margin-top: 10px; font-style: italic;">
                Seleccioná la capa en el menú arriba a la derecha ↗️
            </p>
        </div>
    `;

    // Carga segura de la librería Leaflet
    const scriptLeaflet = document.createElement('script');
    scriptLeaflet.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    document.head.appendChild(scriptLeaflet);

    // Cuando Leaflet se activa, disparamos TU configuración original
    scriptLeaflet.onload = function() {
        var apiKey = "bd5e378503939ddaee76f12ad7a97608";

        // 1. Capas Base de tu archivo original
        var satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            className: 'satelite-fondo'
        });

        var calles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png');

        // 2. Capas de Clima tuyas con los filtros reforzados
        var lluvia = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            className: 'capa-clima-fuerte', opacity: 0.9
        });

        var nubes = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            className: 'capa-clima-fuerte', opacity: 0.8
        });

        var temperatura = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            className: 'capa-clima-fuerte', opacity: 0.7
        });

        // 3. Inicializar Mapa centrado en tu posición exacta
        var map = L.map('mapa-sistema', {
            center: [-33.085, -68.468],
            zoom: 8,
            layers: [satelite, calles, lluvia] // Las que arrancan por defecto
        });

        // 4. Tu selector flotante de la esquina derecha
        var capasBase = {
            "Vista Satelital": satelite
        };

        var capasClima = {
            "⛈️ Lluvia": lluvia,
            "☁️ Nubes": nubes,
            "🌡️ Temperatura": temperatura
        };

        L.control.layers(capasBase, capasClima, { collapsed: false }).addTo(map);

        // 5. El marcador de la casa en San Martín
        L.circleMarker([-33.085, -68.468], {
            radius: 7, fillColor: "#f1c40f", color: "#fff", weight: 2, fillOpacity: 1
        }).addTo(map).bindPopup('<b>Estación Zúñiga</b>');
    };
}

// Inicialización automática al cargar la web
document.addEventListener("DOMContentLoaded", function() {
    anexarMóduloRadar();
});