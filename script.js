// --- CONFIGURACIÓN DE REGALOS ---
const regalosDisponibles = [
    "Bono del 150%",
    "Bono del 100%",
    "Bono del 200%",
    "555 fichas gratis",
    "777 fichas gratis",
    "1111 fichas gratis"
];

// FECHA OBJETIVO: 1 de enero de 2026 a las 00:00:00
const targetDate = new Date('January 1, 2026 00:00:00').getTime();

// --- AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    const cachedUser = localStorage.getItem('padrino_user');
    
    if (cachedUser) {
        const userObj = JSON.parse(cachedUser);
        const now = new Date().getTime();

        // Si ya es medianoche o más tarde, mostrar premio directamente
        if (now >= targetDate) {
            revelarRegalo();
        } else {
            mostrarPantallaEspera(userObj.nombre);
        }
    }
});

// --- REGISTRO DE INVITADOS ---
function handleAccion() {
    const userInput = document.getElementById('username');
    const user = userInput.value.trim();
    const conducta = document.getElementById('conducta-elegida').value;

    if (user === "") {
        userInput.style.borderColor = "#d4af37";
        alert("¡Epa! Poné tu nombre para recibir el regalo.");
        return;
    }

    const datosUsuario = {
        nombre: user,
        actitud: conducta,
        registroFecha: new Date().toISOString(),
        regaloAsignado: null 
    };
    localStorage.setItem('padrino_user', JSON.stringify(datosUsuario));

    lanzarFuegosDeGala(); 
    mostrarPantallaEspera(user);
}

// --- SELECCIÓN DE ACTITUD ---
function seleccionarConducta(btn, valor) {
    document.querySelectorAll('.btn-conducta').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('conducta-elegida').value = valor;
}

// --- PANTALLA DE ESPERA ---
function mostrarPantallaEspera(user) {
    document.getElementById('content-area').style.display = 'none';
    const successDiv = document.getElementById('success-message');
    
    successDiv.querySelector('h2').innerHTML = "¡DALE QUE ARRANCA! 🚀";
    document.getElementById('user-welcome').innerText = `¡Ya estás en la lista, ${user}!`;
    
    successDiv.querySelector('p:last-child').innerText = "Poné las bebidas en el freezer y aguantá la manija. Volvé exactamente a las 00:00 para descorchar tu sorpresa: el Padrino ya tiene algo preparado para que arranques el 2026 rompiendo la banca. ¡No te duermas!";
    
    successDiv.style.display = 'block';
}

// --- CONTADOR HACIA EL BRINDIS ---
const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const countdownEl = document.getElementById('countdown');

    if (distance <= 0) {
        clearInterval(timerInterval);
        countdownEl.innerHTML = "¡FELIZ 2026! 🥂";
        revelarRegalo();
    } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownEl.innerHTML = `faltan: ${hours}h ${minutes}m ${seconds}s para un nuevo año`;
    }
}, 1000);

// --- REVELACIÓN DEL REGALO ---
function revelarRegalo() {
    const cachedUser = localStorage.getItem('padrino_user');
    if (!cachedUser) return;

    let userObj = JSON.parse(cachedUser);

    // Asignación permanente del regalo
    if (!userObj.regaloAsignado) {
        const indiceAleatorio = Math.floor(Math.random() * regalosDisponibles.length);
        userObj.regaloAsignado = regalosDisponibles[indiceAleatorio];
        localStorage.setItem('padrino_user', JSON.stringify(userObj));
    }

    const successDiv = document.getElementById('success-message');
    document.getElementById('content-area').style.display = 'none';
    
    successDiv.innerHTML = `
        <div class="emoji-navidad">🍾</div>
        <h2 style="color: #d4af37; font-weight: 800;">¡FELIZ AÑO NUEVO!</h2>
        <p style="color: #fff; margin-bottom: 5px;">${userObj.nombre}, el Padrino te entrega:</p>
        
        <div style="background: #000; padding: 25px; border: 2px solid #d4af37; border-radius: 15px; margin: 20px 0; box-shadow: 0 0 20px rgba(212,175,55,0.4);">
            <span style="font-size: 1.8rem; font-weight: 900; color: #ffd700; text-shadow: 0 0 10px rgba(212,175,55,0.6);">
                ${userObj.regaloAsignado}
            </span>
        </div>

        <p style="font-size: 1.1rem; color: #fff; font-weight: 700; line-height: 1.4; margin: 20px 0; padding: 0 10px;">
            ¡COMPARTINOS TU PREMIO POR MENSAJE CON UNA CAPTURA PARA PODER DÁRTELO! 📸
        </p>

        <button id="main-button" onclick="location.reload()" style="margin-top: 10px; width: auto; padding: 10px 40px;">
            ACTUALIZAR
        </button>
    `;
    successDiv.style.display = 'block';
    
    // Confeti de gala
    confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.7 },
        colors: ['#d4af37', '#ffffff', '#ffd700']
    });
}

// --- FUEGOS ARTIFICIALES ---
function lanzarFuegosDeGala() {
    var duration = 4 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        var particleCount = 40 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 }, 
            colors: ['#d4af37', '#ffffff'] 
        }));
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 }, 
            colors: ['#ffd700', '#f9f295'] 
        }));
    }, 250);
}

// --- MÚSICA ---
let playing = false;
function toggleSoundCloud() {
    const widget = SC.Widget(document.getElementById('sc-widget'));
    if (!playing) { 
        widget.play(); 
        document.getElementById('music-icon').innerText = "🔊"; 
    } else { 
        widget.pause(); 
        document.getElementById('music-icon').innerText = "🔇"; 
    }
    playing = !playing;
}