// ==========================================
// UTILIDAD GENERAL: FORMATEAR TIEMPO
// ==========================================
// Convierte los segundos totales a formato de reloj "MM:SS" (Ej: 75 segundos -> "01:15")
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60); // Saca los minutos enteros
  const seconds = totalSeconds % 60; // Saca el residuo de los segundos
  // padStart asegura que siempre tenga 2 dígitos (ej: "5" se vuelve "05")
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


// ==========================================
// LÓGICA DEL PUNTO 1: CRONÓMETROS EN CADENA
// ==========================================

// 1. Capturamos los elementos del HTML del Punto 1
const inputTime1 = document.getElementById('input-time');
const btnPlay1 = document.getElementById('btn-play-1');

const timer1Card = document.getElementById('timer-1');
const display1 = timer1Card.querySelector('.time-display');
const status1 = timer1Card.querySelector('.status-badge');

const timer2Card = document.getElementById('timer-2');
const display2 = timer2Card.querySelector('.time-display');
const status2 = timer2Card.querySelector('.status-badge');

let isRunning1 = false; // Bandera para evitar múltiples clics mientras corre

// 2. Evento Click del botón Play 1
btnPlay1.addEventListener('click', () => {
  if (isRunning1) return; // Si ya está corriendo, no hace nada
  
  const targetSeconds = parseInt(inputTime1.value); // Leemos el tiempo ingresado por el usuario
  
  // Validación de seguridad por si el campo está vacío o es negativo
  if (isNaN(targetSeconds) || targetSeconds <= 0) {
    alert('Por favor, ingresa un tiempo válido mayor a 0 segundos.');
    return;
  }

  isRunning1 = true;
  btnPlay1.disabled = true; // Desactivamos el botón para evitar doble inicio
  btnPlay1.style.opacity = '0.5';

  display1.textContent = formatTime(0);
  display2.textContent = formatTime(0);
  
  // Iniciamos la secuencia del primer cronómetro
  runTimerSequence1(targetSeconds);
});

// 3. Función del Cronómetro 1
function runTimerSequence1(maxSeconds) {
  let current1 = 0;
  
  // Cambiamos estados visuales: el 1 corre, el 2 espera en pausa
  status1.textContent = 'Ejecutándose...';
  status1.className = 'status-badge status-running';
  status2.textContent = 'En Pausa';
  status2.className = 'status-badge status-paused';

  // Usamos setInterval para sumar 1 segundo cada 1000 milisegundos
  const int1 = setInterval(() => {
    current1++;
    display1.textContent = formatTime(current1);

    // CONDICIÓN DE FIN DEL CRONÓMETRO 1: Cuando llega al límite digitado
    if (current1 >= maxSeconds) {
      clearInterval(int1); // Detenemos este intervalo
      
      status1.textContent = 'En Pausa';
      status1.className = 'status-badge status-paused';

      // ENCADENAMIENTO: Inmediatamente arranca el Cronómetro 2
      runTimerSecond1(maxSeconds);
    }
  }, 1000);
}

// 4. Función del Cronómetro 2 (Encadenado)
function runTimerSecond1(maxSeconds) {
  let current2 = 0;

  // Cambiamos el estado del cronómetro 2 a ejecución
  status2.textContent = 'Ejecutándose...';
  status2.className = 'status-badge status-running';

  const int2 = setInterval(() => {
    current2++;
    display2.textContent = formatTime(current2);

    // CONDICIÓN DE FIN DEL CRONÓMETRO 2
    if (current2 >= maxSeconds) {
      clearInterval(int2); // Detenemos el intervalo
      
      status2.textContent = 'En Pausa';
      status2.className = 'status-badge status-paused';

      // Fin de todo el proceso del punto 1: Reactivamos el botón Play
      isRunning1 = false;
      btnPlay1.disabled = false;
      btnPlay1.style.opacity = '1';
    }
  }, 1000);
}



// ==========================================
// LÓGICA DEL PUNTO 2: TRES CRONÓMETROS SIMULTÁNEOS
// ==========================================

// 1. Capturamos los elementos del HTML del Punto 2
const btnPlay2 = document.getElementById('btn-play-2');

const cardA = document.getElementById('timer-a');
const displayA = cardA.querySelector('.time-display');
const statusA = cardA.querySelector('.status-badge');

const cardB = document.getElementById('timer-b');
const displayB = cardB.querySelector('.time-display');
const statusB = cardB.querySelector('.status-badge');

const cardC = document.getElementById('timer-c');
const displayC = cardC.querySelector('.time-display');
const statusC = cardC.querySelector('.status-badge');

let isRunning2 = false;

// 2. Definimos los tiempos fijos para cada uno (en segundos)
const timeA = 55;  // 55 segundos
const timeB = 145; // 02:25 (2 minutos y 25 segundos)
const timeC = 25;  // 25 segundos

// 3. Evento Click del botón Play 2
btnPlay2.addEventListener('click', () => {
  if (isRunning2) return;
  isRunning2 = true;
  btnPlay2.disabled = true;
  btnPlay2.style.opacity = '0.5';

  displayA.textContent = formatTime(0);
  displayB.textContent = formatTime(0);
  displayC.textContent = formatTime(0);

  // Ejecutamos los tres cronómetros EN PARALELO (simultáneos)
  runSingleTimer(cardA, displayA, statusA, timeA, () => checkAllFinished2());
  runSingleTimer(cardB, displayB, statusB, timeB, () => checkAllFinished2());
  runSingleTimer(cardC, displayC, statusC, timeC, () => checkAllFinished2());
});

// 4. Función reutilizable para correr un cronómetro individual de forma independiente
function runSingleTimer(card, display, statusBadge, limitSeconds, onFinish) {
  let current = 0;
  
  statusBadge.textContent = 'Ejecutándose...';
  statusBadge.className = 'status-badge status-running';

  const timerInterval = setInterval(() => {
    current++;
    display.textContent = formatTime(current);

    // Cuando este cronómetro individual llega a su meta
    if (current >= limitSeconds) {
      clearInterval(timerInterval);
      
      statusBadge.textContent = 'En Pausa';
      statusBadge.className = 'status-badge status-paused';
      
      // Ejecutamos la función de aviso de que este terminó
      if (onFinish) onFinish();
    }
  }, 1000);
}

// 5. Controlador para saber cuándo terminan los tres y reactivar el botón
let finishedCount = 0;
function checkAllFinished2() {
  finishedCount++; // Suma 1 cada vez que un cronómetro finaliza
  
  // Como son 3 cronómetros, cuando el contador llega a 3 significa que todos terminaron
  if (finishedCount === 3) {
    finishedCount = 0; // Reiniciamos el contador para la próxima vez
    isRunning2 = false;
    btnPlay2.disabled = false; // Volvemos a habilitar el botón principal
    btnPlay2.style.opacity = '1';
  }
}