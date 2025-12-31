// --- CONFIGURACIÓN DE REGALOS ---
const regalosDisponibles = [
    "Bono del 150%",
    "Bono del 100%",
    "Bono del 200%",
    "555 fichas gratis",
    "777 fichas gratis",
    "1111 fichas gratis"
];

// --- PRUEBA PILOTO: Finaliza hoy 31 de Dic a las 15:05 ---
const targetDate = new Date('December 31, 2025 15:06:00').getTime();

// --- AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    const cachedUser = localStorage.getItem('padrino_user');
    
    if (cachedUser) {
        const userObj = JSON.parse(cachedUser);
        const now = new Date().getTime();

        if (now >= targetDate) {
            revelarRegalo();
        } else {
            mostrarPantallaEspera(userObj.nombre);
        }
    }
});

// --- FUNCIÓN DE REGISTRO ---
function handleAccion() {
    const userInput = document.getElementById('username');
    const user = userInput.value.trim();
    const conducta = document.getElementById('conducta-elegida').value;

    if (user === "") {
        userInput.style.borderColor = "red";
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
    
    successDiv.querySelector('p:last-child').innerText = "Poné las bebidas en el freezer y aguantá la manija. Volvé exactamente a las 15:05 para descorchar tu sorpresa: el Padrino ya tiene algo preparado para que arranques el 2026 rompiendo la banca.";
    
    successDiv.style.display = 'block';
}

// --- CONTADOR EN TIEMPO REAL ---
const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const countdownEl = document.getElementById('countdown');

    if (distance <= 0) {
        clearInterval(timerInterval);
        countdownEl.innerHTML = "¡PRUEBA FINALIZADA! 🥂";
        revelarRegalo();
    } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownEl.innerHTML = `TEST: ${minutes}m ${seconds}s restantes`;
    }
}, 1000);

// --- REVELACIÓN DEL REGALO ---
function revelarRegalo() {
    const cachedUser = localStorage.getItem('padrino_user');
    if (!cachedUser) return;

    let userObj = JSON.parse(cachedUser);

    if (!userObj.regaloAsignado) {
        const indiceAleatorio = Math.floor(Math.random() * regalosDisponibles.length);
        userObj.regaloAsignado = regalosDisponibles[indiceAleatorio];
        localStorage.setItem('padrino_user', JSON.stringify(userObj));
    }

    const successDiv = document.getElementById('success-message');
    document.getElementById('content-area').style.display = 'none';
    
    successDiv.innerHTML = `
        <div class="emoji-navidad">🍾</div>
        <h2 style="color: #d4af37; font-weight: 800;">¡PRUEBA EXITOSA!</h2>
        <p style="color: #fff; margin-bottom: 5px;">${userObj.nombre}, simulamos tu premio:</p>
        
        <div style="background: #000; padding: 25px; border: 2px solid #d4af37; border-radius: 15px; margin: 20px 0; box-shadow: 0 0 20px rgba(212,175,55,0.4);">
            <span style="font-size: 1.8rem; font-weight: 900; color: #ffd700; text-shadow: 0 0 10px rgba(212,175,55,0.6);">
                ${userObj.regaloAsignado}
            </span>
        </div>

        <p style="font-size: 1.1rem; color: #fff; font-weight: 700; line-height: 1.4; margin: 20px 0; padding: 0 10px;">
            ¡COMPARTINOS TU PREMIO POR MENSAJE CON UNA CAPTURA PARA PODER DÁRTELO! 📸
        </p>

        <button id="main-button" onclick="localStorage.clear(); location.reload();" style="margin-top: 10px; width: auto; padding: 10px 40px; background: #444; color: white;">
            RESETEAR TEST (Borrar memoria)
        </button>
    `;
    successDiv.style.display = 'block';
    
    confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.7 },
        colors: ['#d4af37', '#ffffff', '#ffd700']
    });
}

// --- FUEGOS DE GALA ---
function lanzarFuegosDeGala() {
    var duration = 4 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        var particleCount = 40 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 }, colors: ['#d4af37', '#ffffff'] }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 }, colors: ['#ffd700', '#f9f295'] }));
    }, 250);
}

// --- MÚSICA ---
let playing = false;
function toggleSoundCloud() {
    const widget = SC.Widget(document.getElementById('sc-widget'));
    if (!playing) { widget.play(); document.getElementById('music-icon').innerText = "🔊"; } 
    else { widget.pause(); document.getElementById('music-icon').innerText = "🔇"; }
    playing = !playing;
}