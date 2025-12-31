// --- 1. CONFIGURACIÓN GENERAL ---
const regalosDisponibles = ["Bono del 150%", "Bono del 100%", "Bono del 200%", "555 fichas gratis", "777 fichas gratis", "1111 fichas gratis"];
const WEBHOOK_URL = "https://discordapp.com/api/webhooks/1455998458422104146/uN8YFRcHH3Ynd7R14BZRr_5c3kfcro_a-62kWwaLVDPoHrFt0Pp3YuHrH4oEFlKnFj9O";

// FECHA OBJETIVO: 1 de Enero de 2026 00:00:00
const targetDate = new Date(2026, 0, 1, 0, 0, 0).getTime();

// --- 2. INICIO DEL CONTADOR ---
function actualizarTimer() {
    const countdownEl = document.getElementById('countdown');
    
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            clearInterval(interval);
            if(countdownEl) countdownEl.innerHTML = "¡FELIZ 2026! 🥂";
            revelarRegalo();
        } else {
            const h = Math.floor(distance / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);
            if(countdownEl) countdownEl.innerText = `faltan: ${h}h ${m}m ${s}s para un nuevo año`;
        }
    }, 1000);
}

// --- 3. LÓGICA DE USUARIO ---
document.addEventListener('DOMContentLoaded', () => {
    actualizarTimer();

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

function seleccionarConducta(btn, valor) {
    document.querySelectorAll('.btn-conducta').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('conducta-elegida').value = valor;
}

function handleAccion() {
    const user = document.getElementById('username').value.trim();
    const conducta = document.getElementById('conducta-elegida').value;

    if (user === "") return alert("Poné tu nombre.");

    const datosUsuario = { nombre: user, actitud: conducta, regaloAsignado: null };

    localStorage.setItem('padrino_user', JSON.stringify(datosUsuario));
    enviarADiscord(user, conducta);
    lanzarFuegosDeGala();
    mostrarPantallaEspera(user);
}

function enviarADiscord(nombre, actitud) {
    const embed = {
        username: "Padrino Latino Bot",
        embeds: [{
            title: "✨ ¡Nuevo Registro 2026!",
            description: `**${nombre}** llegó para celebrar el 2026 con nosotros.`,
            color: 13938487,
            fields: [
                { name: "👤 Usuario", value: nombre, inline: true },
                { name: "🔥 Actitud", value: actitud, inline: true }
            ],
            timestamp: new Date()
        }]
    };
    fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(embed) });
}

function mostrarPantallaEspera(user) {
    const content = document.getElementById('content-area');
    const successDiv = document.getElementById('success-message');
    if(content) content.style.display = 'none';
    if(successDiv) {
        document.getElementById('user-welcome').innerText = `¡Ya estás en la lista, ${user}!`;
        successDiv.style.display = 'block';
    }
}

function revelarRegalo() {
    const cachedUser = localStorage.getItem('padrino_user');
    if (!cachedUser) return;
    let userObj = JSON.parse(cachedUser);

    if (!userObj.regaloAsignado) {
        userObj.regaloAsignado = regalosDisponibles[Math.floor(Math.random() * regalosDisponibles.length)];
        localStorage.setItem('padrino_user', JSON.stringify(userObj));
    }

    const content = document.getElementById('content-area');
    const successDiv = document.getElementById('success-message');
    if(content) content.style.display = 'none';
    if(successDiv) {
        successDiv.innerHTML = `
            <div class="emoji-navidad" style="font-size: 1.5rem;">🍾</div>
            <h2 style="color: var(--gold); font-weight: 800; font-size: 1.1rem; margin: 5px 0;">¡FELIZ AÑO NUEVO!</h2>
            <p style="color: #ccc; font-size: 0.75rem; margin: 0;">${userObj.nombre}, el Padrino te entrega:</p>
            <div class="box-premio"><span class="premio-texto">${userObj.regaloAsignado}</span></div>
            <p class="instruccion-captura">¡COMPARTINOS TU PREMIO CON UNA CAPTURA PARA DÁRTELO!</p>
            <div style="font-size: 1.2rem; margin-top: 5px;">📸</div>
            <button id="main-button" onclick="location.reload()" style="width: auto; padding: 8px 30px; border-radius: 50px; font-size: 0.8rem;">RECARGAR</button>
        `;
        successDiv.style.display = 'block';
    }
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.7 } });
}

function lanzarFuegosDeGala() { confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } }); }

function toggleSoundCloud() {
    const widget = SC.Widget(document.getElementById('sc-widget'));
    const icon = document.getElementById('music-icon');
    widget.toggle();
    icon.innerText = icon.innerText === "🔇" ? "🔊" : "🔇";
}