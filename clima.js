// =========================================================================
// MOTOR ARQUITECTÓNICO CON VIENTO ANEXADO - ESTACIÓN ZÚÑIGA 🛰️
// =========================================================================

let coords = "-33.08,-68.47";
let ciudad = "SAN MARTÍN";

// FUNCIÓN ANEXADORA: Dibuja e inyecta la tarjeta del viento en el HTML principal
function anexarMóduloViento() {
    const contenedor = document.getElementById('contenedor-viento');
    if (!contenedor) return;

    // Le metemos la estructura visual transparente directo al enchufe
    contenedor.innerHTML = `
        <div class="card-transparente" style="margin-top: 25px;">
            <div style="font-size: 0.9rem; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; border-bottom: 1px solid var(--glass-border); padding-bottom: 8px;">
                Condiciones del Viento 🌀
            </div>
            <div style="display: flex; align-items: center; justify-content: space-around; margin: 15px 0;">
                <span id="wind-icon" class="material-symbols-outlined" style="font-size: 50px; color: #74b9ff; transition: transform 0.5s linear; display: inline-block;">air</span>
                <div style="text-align: left;">
                    <div style="font-size: 2.2rem; font-weight: 900; line-height: 1;" id="wind-speed">-- <span style="font-size: 1rem; font-weight: bold;">km/h</span></div>
                    <div style="font-size: 0.85rem; font-weight: bold; color: #ffbe76; margin-top: 4px;">Dirección: <span id="wind-dir">--</span></div>
                </div>
                <div style="text-align: right; border-left: 1px solid var(--glass-border); padding-left: 15px;">
                    <div style="font-size: 0.75rem; color: #ced4da; text-transform: uppercase; font-weight: bold;">Ráfaga Máx</div>
                    <div style="font-size: 1.3rem; font-weight: bold; color: #ff7675;" id="wind-gust">-- <span style="font-size: 0.8rem;">km/h</span></div>
                </div>
            </div>
        </div>
    `;
}

async function updateWeatherLocation(val) {
    if (!val) return;
    const parts = val.split(',');
    const lat = parts[0];
    const lon = parts[1];
    ciudad = parts[2];

    let tempFinal = "--";
    let stFinal = "--";
    let humFinal = "--";
    let iconText = "wb_sunny";

    let windSpeedFinal = "--";
    let windGustFinal = "--";
    let windDirFinal = "--";
    let uvFinal = "--"; // Nueva variable para capturar el UV

    let maxM = "--", minM = "--", maxP = "--", minP = "--";

    // 1. CONSULTA WEB GENERAL (Mantenemos las variables vivas)
    try {
        const urlMeteo = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
        const res = await fetch(urlMeteo);
        const data = await res.json();

        if (data && data.current) {
            tempFinal = Math.round(data.current.temperature_2m);
            stFinal = Math.round(data.current.apparent_temperature);
            humFinal = data.current.relative_humidity_2m;

            windSpeedFinal = Math.round(data.current.wind_speed_10m);
            windGustFinal = Math.round(data.current.wind_gusts_10m);
            windDirFinal = obtenerDireccionRosa(data.current.wind_direction_10m);

            const code = data.current.weather_code;
            if (code === 0) iconText = 'wb_sunny';
            else if (code <= 3) iconText = 'cloud';
            else iconText = 'umbrella';
        }
        
        // El pronóstico extendido se guarda acá y ya no se pisa
        if (data && data.daily) {
            maxM = Math.round(data.daily.temperature_2m_max[1]) + "°";
            minM = Math.round(data.daily.temperature_2m_min[1]) + "°";
            maxP = Math.round(data.daily.temperature_2m_max[2]) + "°";
            minP = Math.round(data.daily.temperature_2m_min[2]) + "°";
        }
    } catch (e) {
        console.log("Error en motor web:", e);
    }

    // 2. FILTRO EXCLUSIVO SAN MARTÍN (Tu búnker toma el control del tiempo actual)
    if (ciudad === "SAN MARTÍN") {
        try {
            const datoEstacion = await obtenerDatoEstacionReal();
            if (datoEstacion) {
                tempFinal = datoEstacion.temp;
                stFinal = datoEstacion.st;
                humFinal = datoEstacion.hum;
                
                windSpeedFinal = datoEstacion.vientoVel;
                windGustFinal = datoEstacion.vientoRaf;
                windDirFinal = obtenerDireccionRosa(datoEstacion.vientoDir);
                uvFinal = datoEstacion.uv; // Rescatamos el UV real del techo
            }
        } catch (errEst) {
            console.log("Consola offline:", errEst);
        }
    }

    // 3. IMPRESIÓN SOBERANA EN LAS TARJETAS
    if(document.getElementById('temp')) document.getElementById('temp').innerText = tempFinal;
    if(document.getElementById('st-val')) document.getElementById('st-val').innerText = stFinal;
    if(document.getElementById('hum-display')) document.getElementById('hum-display').innerText = `Hum: ${humFinal}%`;
    if(document.getElementById('city-display')) document.getElementById('city-display').innerText = ciudad;
    if(document.getElementById('weather-icon')) document.getElementById('weather-icon').innerText = iconText;

    // Inyección de datos en el bloque anexado
    if(document.getElementById('wind-speed')) document.getElementById('wind-speed').innerHTML = `${windSpeedFinal} <span style="font-size: 1rem; font-weight: bold;">km/h</span>`;
    if(document.getElementById('wind-dir')) document.getElementById('wind-dir').innerText = windDirFinal;
    if(document.getElementById('wind-gust')) document.getElementById('wind-gust').innerHTML = `${windGustFinal} <span style="font-size: 0.8rem;">km/h</span>`;

    // Si tenés o agregás un id="uv-display" en el HTML, te inyecta el índice UV directo en la home
    if(document.getElementById('uv-display')) document.getElementById('uv-display').innerText = `UV: ${uvFinal}`;

    // Animación del molino según la fuerza del viento
    const windIcon = document.getElementById('wind-icon');
    if (windIcon && windSpeedFinal !== "--" && windSpeedFinal > 0) {
        const velocidadRotacion = Math.max(0.2, 3 / (windSpeedFinal / 5)); // Más viento, gira más rápido
        windIcon.style.animation = `girar ${velocidadRotacion}s linear infinite`;
        
        if (!document.getElementById('estilo-giro')) {
            const style = document.createElement('style');
            style.id = 'estilo-giro';
            style.innerHTML = '@keyframes girar { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }
    } else if (windIcon) {
        windIcon.style.animation = 'none';
    }

    // Imprimimos el pronóstico extendido de forma segura
    if(document.getElementById('max-manana')) document.getElementById('max-manana').innerText = maxM;
    if(document.getElementById('min-manana')) document.getElementById('min-manana').innerText = minM;
    if(document.getElementById('max-pasado')) document.getElementById('max-pasado').innerText = maxP;
    if(document.getElementById('min-pasado')) document.getElementById('min-pasado').innerText = minP;
}

async function obtenerDatoEstacionReal() {
    const STATION_ID = "ISANMA322"; 
    const URL = `https://api.weather.com/v2/pws/observations/current?stationId=${STATION_ID}&format=json&units=m&apiKey=e1f10a1e78da46f5b10a1e78da96f525`;
    const respuesta = await fetch(URL);
    const json = await respuesta.json();
    if (json && json.observations && json.observations.length > 0) {
        const o = json.observations[0];
        return {
            temp: Math.round(o.metric.temp),
            hum: o.humidity,
            st: Math.round(o.metric.windChill || o.metric.temp),
            vientoVel: Math.round(o.metric.windSpeed),
            vientoRaf: Math.round(o.metric.windGust),
            vientoDir: o.winddir,
            uv: o.uv !== undefined && o.uv !== null ? o.uv : "--" // <--- ACÁ CAPTURAMOS EL UV DESDE EL SATÉLITE
        };
    }
    return null;
}

function obtenerDireccionRosa(grados) {
    if (grados === "--" || grados === null || grados === undefined) return "--";
    const direcciones = ["Norte ⬇️", "Nordeste ↙️", "Este ⬅️", "Sudeste ↖️", "Sur ⬆️", "Sudoeste ↗️", "Oeste ➡️", "Noroeste ↘️"];
    const indice = Math.round(grados / 45) % 8;
    return direcciones[indice];
}

// ARRANQUE SOBERANO
window.onload = function() {
    anexarMóduloViento(); // 1. Primero soldamos el anexo en la pantalla
    updateWeatherLocation("-33.08,-68.47,SAN MARTÍN"); // 2. Después lo llenamos con los datos
    
    setInterval(() => {
        const selector = document.getElementById("departamentos");
        if (selector) updateWeatherLocation(selector.value);
    }, 120000);
};

// =========================================================================
// MOTOR DE TIEMPO REAL (RELOJ Y FECHA) - ESTACIÓN ZÚÑIGA 🕒
// =========================================================================
function arrancarReloj() {
    setInterval(() => {
        const ahora = new Date();
        
        const horas = String(ahora.getHours()).padStart(2, '0');
        const minutos = String(ahora.getMinutes()).padStart(2, '0');
        const segundos = String(ahora.getSeconds()).padStart(2, '0');
        
        const relojContenedor = document.getElementById('reloj-digital');
        if (relojContenedor) {
            relojContenedor.innerText = `${horas}:${minutos}:${segundos}`;
        }

        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        const nombreDia = diasSemana[ahora.getDay()];
        const numeroDia = ahora.getDate();
        const nombreMes = meses[ahora.getMonth()];
        const anio = ahora.getFullYear();

        const fechaContenedor = document.getElementById('fecha-digital');
        if (fechaContenedor) {
            fechaContenedor.innerText = `${nombreDia}, ${numeroDia} de ${nombreMes} ${anio}`;
        }
    }, 1000);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancarReloj);
} else {
    arrancarReloj();
}