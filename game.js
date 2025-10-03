// =====================
// Variables iniciales
// =====================
let hambre = 100;
let energia = 100;
let higiene = 100;
let diversion = 100;
let escenarioActual = "comedor";
let lamparaEncendida = true; // empieza encendida

// Monedas y objetos
let huesitos = 0;
const inventario = {
  trajes: [],
  collares: [],
  camas: [],
  juguetes: []
};

// =====================
// Elementos HTML
// =====================
const hambreBarra = document.getElementById("hambre-barra");
const energiaBarra = document.getElementById("energia-barra");
const higieneBarra = document.getElementById("higiene-barra");
const diversionBarra = document.getElementById("diversion-barra");
const petImg = document.getElementById("gmail");
const comida = document.getElementById("comida");
const jabon = document.getElementById("jabon");
const trapo = document.getElementById("trapo");
const lampara = document.getElementById("lampara");
const escenarioContainer = document.getElementById("escenario-container");
const oscuridad = document.getElementById("oscuridad");

// Crear contenedor para mostrar huesitos
const huesitosDisplay = document.createElement("div");
huesitosDisplay.id = "huesitos-display";
huesitosDisplay.style.fontSize = "1.2em";
huesitosDisplay.style.margin = "10px";
huesitosDisplay.innerText = `🦴 Huesitos: ${huesitos}`;
document.body.insertBefore(huesitosDisplay, document.getElementById("stats"));

// =====================
// Funciones de acciones
// =====================
function alimentar() { hambre = Math.min(100, hambre + 20); actualizar(); }
function dormir() { energia = Math.min(100, energia + 20); actualizar(); }
function banar() { higiene = Math.min(100, higiene + 20); actualizar(); }
function jugar() { diversion = Math.min(100, diversion + 20); actualizar(); }

// =====================
// Reducir stats con el tiempo
// =====================
setInterval(() => {
  if (escenarioActual === "habitacion" && !lamparaEncendida) {
    energia = Math.min(100, energia + 1);
    hambre = Math.max(0, hambre - 1);
    higiene = Math.max(0, higiene - 0.5);
    diversion = Math.max(0, diversion - 0.5);
  } else {
    hambre = Math.max(0, hambre - 0.02);
    energia = Math.max(0, energia - 0.015);
    higiene = Math.max(0, higiene - 0.03);
    diversion = Math.max(0, diversion - 0.01);
  }
  actualizar();
}, 1000);

// =====================
// Función para actualizar barras y Gmail
// =====================
function actualizar() {
  hambreBarra.style.width = hambre + "%";
  energiaBarra.style.width = energia + "%";
  higieneBarra.style.width = higiene + "%";
  diversionBarra.style.width = diversion + "%";

  hambreBarra.style.backgroundColor = getColor(hambre);
  energiaBarra.style.backgroundColor = getColor(energia);
  higieneBarra.style.backgroundColor = getColor(higiene);
  diversionBarra.style.backgroundColor = getColor(diversion);

  actualizarGmail();
  darRecompensa(); // dar huesitos si está todo alto
  actualizarHuesitos();
}

// =====================
// Función de emociones de Gmail
// =====================
function actualizarGmail() {
  if (escenarioActual === "habitacion" && !lamparaEncendida) {
    petImg.src = "./assets/gmail_dormido.jpg";
    petImg.style.width = "150px";
    oscuridad.style.opacity = 1;
    return;
  }

  if (hambre <= 20) petImg.src = "./assets/gmail_triste.png";
  else if (energia <= 20) petImg.src = "./assets/gmail_sueno.png";
  else if (higiene <= 20) petImg.src = "./assets/gmail_sucio.png";
  else if (diversion <= 20) petImg.src = "./assets/gmail_triste.png";
  else if (diversion >= 80) petImg.src = "./assets/gmail_feliz.png"; // más expresivo
  else petImg.src = "./assets/gmail_feliz.png";

  petImg.style.width = "300px";
  oscuridad.style.opacity = 0;
}

// =====================
// Función de color según valor
// =====================
function getColor(valor) {
  if (valor > 60) return "#4caf50";
  if (valor > 30) return "#ffeb3b";
  return "#f44336";
}

// =====================
// Drag & Drop
// =====================
[comida, jabon, trapo].forEach(item => {
  item.addEventListener("dragstart", e => {
    e.dataTransfer.setData("tipo", item.id);
    const rect = item.getBoundingClientRect();
    e.dataTransfer.setDragImage(item, rect.width / 2, rect.height / 2);
  });
});

petImg.addEventListener("dragover", e => e.preventDefault());
petImg.addEventListener("drop", e => {
  e.preventDefault();
  const tipo = e.dataTransfer.getData("tipo");
  if(tipo === "comida" && escenarioActual === "comedor") hambre = Math.min(100, hambre + 20);
  else if(tipo === "jabon" && escenarioActual === "bano") mostrarEspuma();
  else if(tipo === "trapo" && escenarioActual === "bano") quitarEspuma();
  actualizar();
});

// =====================
// Higiene con burbujas
// =====================
function mostrarEspuma() {
  petImg.style.filter = "brightness(1.2) saturate(1.5)";
  for (let i = 0; i < 30; i++) {
    const burbuja = document.createElement("div");
    burbuja.classList.add("burbuja");
    const x = Math.random() * (petImg.width - 20);
    const y = Math.random() * (petImg.height - 20);
    burbuja.style.left = x + "px";
    burbuja.style.top = y + "px";
    escenarioContainer.appendChild(burbuja);
    setTimeout(() => { burbuja.style.transform = `translateY(-60px)`; burbuja.style.opacity = 0; }, 50);
    setTimeout(() => burbuja.remove(), 4000);
  }
}
function quitarEspuma() { petImg.style.filter = "none"; higiene = Math.min(100, higiene + 20); }

// =====================
// Sistema de huesitos
// =====================
let ultimaRecompensa = Date.now();

function darRecompensa() {
  let ahora = Date.now();
  if (hambre >= 80 && energia >= 80 && higiene >= 80 && diversion >= 80) {
    if (ahora - ultimaRecompensa >= 30000) { // cada 30 segundos
      huesitos += 5;
      ultimaRecompensa = ahora;
    }
  }
}

function actualizarHuesitos() {
  huesitosDisplay.innerText = `🦴 Huesitos: ${huesitos}`;
}

function comprarObjeto(tipo, nombre, costo) {
  if (huesitos >= costo) {
    huesitos -= costo;
    inventario[tipo].push(nombre);
    actualizarHuesitos();
    alert(`¡Compraste ${nombre}!`);
  } else {
    alert("No tienes suficientes huesitos 🦴");
  }
}

function equiparObjeto(tipo, nombre) {
  if (inventario[tipo].includes(nombre)) {
    if(tipo === "trajes") petImg.src = `./assets/${nombre}.png`;
  }
}

// =====================
// Cambiar escenario con fade
// =====================
function cambiarEscenario(escenario) {
  escenarioContainer.classList.add("fade-out");

  setTimeout(() => {
    escenarioActual = escenario;

    escenarioContainer.className = "";
    if (escenario === "comedor") escenarioContainer.classList.add("escenario-comedor");
    else if (escenario === "bano") escenarioContainer.classList.add("escenario-bano");
    else escenarioContainer.classList.add("escenario-habitacion");

    comida.style.display = (escenario === "comedor") ? "block" : "none";
    jabon.style.display = (escenario === "bano") ? "block" : "none";
    trapo.style.display = (escenario === "bano") ? "block" : "none";
    lampara.style.display = (escenario === "habitacion") ? "block" : "none";

    if (escenario === "comedor") comida.style.left = "50%";
    if (escenario === "bano") { jabon.style.left = "40%"; trapo.style.left = "60%"; }
    if (escenario === "habitacion") lampara.style.left = "50%";

    if (escenario === "habitacion") {
      lamparaEncendida = true;
      lampara.src = "./assets/lampara.png";
    }

    escenarioContainer.classList.remove("fade-out");
    actualizar();
  }, 500);
}

// =====================
// Encender/apagar lámpara
// =====================
lampara.addEventListener("click", () => {
  lamparaEncendida = !lamparaEncendida;
  lampara.src = lamparaEncendida ? "./assets/lampara.png" : "./assets/lampara_off.png";
  actualizar();
});
// =====================
// Drag & Drop para celular (touch events)
// =====================
function enableTouchDrag(item, onDropCallback) {
  let touchItem = null;

  item.addEventListener("touchstart", (e) => {
    e.preventDefault();
    touchItem = item.cloneNode(true); // clonamos para arrastrar
    touchItem.style.position = "absolute";
    touchItem.style.pointerEvents = "none";
    touchItem.style.width = item.offsetWidth + "px";
    touchItem.style.zIndex = 9999;
    document.body.appendChild(touchItem);
  });

  item.addEventListener("touchmove", (e) => {
    if (!touchItem) return;
    let touch = e.touches[0];
    touchItem.style.left = (touch.pageX - touchItem.offsetWidth / 2) + "px";
    touchItem.style.top = (touch.pageY - touchItem.offsetHeight / 2) + "px";
  });

  item.addEventListener("touchend", (e) => {
    if (!touchItem) return;

    // posición final
    let rectPet = petImg.getBoundingClientRect();
    let rectItem = touchItem.getBoundingClientRect();

    // detectar colisión con el perrito
    if (
      rectItem.left < rectPet.right &&
      rectItem.right > rectPet.left &&
      rectItem.top < rectPet.bottom &&
      rectItem.bottom > rectPet.top
    ) {
      onDropCallback(); // ejecutar acción
    }

    touchItem.remove();
    touchItem = null;
  });
}

// Activar drag touch para cada objeto
enableTouchDrag(comida, () => {
  if (escenarioActual === "comedor") {
    hambre = Math.min(100, hambre + 20);
    actualizar();
  }
});

enableTouchDrag(jabon, () => {
  if (escenarioActual === "bano") mostrarEspuma();
});

enableTouchDrag(trapo, () => {
  if (escenarioActual === "bano") quitarEspuma();
});


// =====================
// Inicializar
// =====================
cambiarEscenario("comedor");
