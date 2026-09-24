# Simulador Educativo de Nim: Minimax con Poda Alfa-Beta

Aplicación web interactiva y didáctica diseñada para visualizar y comprender paso a paso el funcionamiento del algoritmo **Minimax con Poda Alfa-Beta ($\alpha$-$\beta$ pruning)** aplicado al juego clásico de **Nim** con configuración inicial `[1, 3]`.

---

## 📌 Formulación del Problema

* **Estado Inicial:** `[1, 3]` (Fila 1: 1 objeto, Fila 2: 3 objetos).
* **Reglas del Juego (Convención Normal):**
  * En cada turno, un jugador retira **1 o más objetos de una única fila**.
  * Gana el jugador que retira el **último objeto del tablero** (el jugador sin jugadas legales pierde).
* **Jugadores:**
  * 🔵 **MAX:** Jugador que inicia la partida y busca **maximizar** la función de utilidad ($+1$).
  * 🔴 **MIN:** Jugador adversario que busca **minimizar** la utilidad ($-1$).
* **Función de Utilidad:**
  * $+1$ si el juego termina con victoria para **MAX**.
  * $-1$ si el juego termina con victoria para **MIN**.
* **Orden de Exploración Estricto (Árbol de Decisión):**
  1. Probar retiros de la **Fila 1** (índice 0).
  2. Probar retiros de la **Fila 2** (índice 1).
  3. En cada fila, retirar en orden ascendente: primero 1 objeto, luego 2, luego 3...

---

## ✂️ Minimax con Poda Alfa-Beta

El algoritmo optimiza el árbol de búsqueda tradicional mediante dos cotas dinámicas:
* **Alfa ($\alpha$):** El mejor valor (máximo) que el jugador MAX tiene garantizado hasta el momento a lo largo del camino explorado (inicialmente $-\infty$).
* **Beta ($\beta$):** El mejor valor (mínimo) que el jugador MIN tiene garantizado hasta el momento (inicialmente $+\infty$).
* **Condición de Poda:** Si en cualquier nodo se cumple que:
  $$\alpha \ge \beta$$
  El jugador en turno no permitirá que el juego llegue a ese estado alternativo o ya cuenta con una mejor opción garantizada. Las ramas restantes bajo ese nodo **se podan**, evitando cálculos redundantes.

---

## 🎯 Características Educativas del Simulador

1. **Exploración Paso a Paso Didáctica:**
   * Desglose completo de la ejecución en **89 frames cronológicos**.
   * Explicación detallada en lenguaje natural de cada micro-paso: visita de nodos, evaluación terminal, llamadas recursivas, actualización de cotas $[\alpha, \beta]$, retroceso (*backtracking*) y activación de cortes.

2. **Tablero Físico en Tiempo Real:**
   * Representación visual de las dos filas con sus fichas activas e inactivas.
   * Indicador del turno actual, rol de optimización y cotas vigentes.

3. **Árbol Vectorial SVG Dinámico con Pan & Zoom:**
   * Representación gráfica de todos los estados del juego (26 nodos únicos).
   * Desplazamiento libre (*drag & pan*) y acercamiento/alejamiento (*zoom*) mediante botones y rueda del ratón (`wheel`).
   * Etiquetas determinísticas en cada arista con la acción jugada (ej. `F1 - 1`, `F2 - 2`, `F2 - 3`).
   * Distinción visual de nodos evaluados con insignias de valor Minimax ($+1$ verde / $-1$ rojo).
   * **Visualización de Poda Alfa-Beta:** Al activarse $\alpha \ge \beta$, se resalta el corte con tijeras ✂️, insignia de corte y ramificaciones podadas tachadas en rojo.

4. **Controles de Reproducción y Atajos:**
   * Botones de navegación: **Paso Anterior**, **Siguiente Paso**, **AutoPlay** con control de velocidad (0.5x, 1x, 2x) y reinicio.
   * Barra de progreso interactiva (*seek bar*).
   * Atajos de teclado:
     * `→` / `Espacio`: Siguiente paso.
     * `←`: Paso anterior.
     * `R`: Reiniciar simulación.

---

## 📂 Estructura del Proyecto

```text
MINIMAX/
├── index.html         # Interfaz web interactiva con Tailwind CSS y SVG vectorial
├── nimAnalyzer.js     # Motor algorítmico puro de Minimax con poda Alfa-Beta y generador de frames
├── test_analyzer.js   # Suite de pruebas automatizadas en Node.js
├── .gitignore         # Configuración de exclusiones de Git
└── README.md          # Documentación técnica y educativa
```

---

## 🚀 Cómo Ejecutar

El proyecto es totalmente autocontenido y funciona de forma directa sin necesidad de instalar frameworks o servidores:

1. **En el Navegador:**
   * Abre directamente el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Firefox, Safari).

2. **Pruebas Automatizadas del Motor Algorítmico:**
   * Con Node.js instalado, ejecuta desde la carpeta `MINIMAX`:
   ```bash
   node test_analyzer.js
   ```
   * Verificará la victoria de MAX ($v = +1$), la apertura óptima (`F2 - 2` hacia `[1, 1]`), la propagación correcta de valores y la detección precisa del corte Alfa-Beta.

---

## 🛠️ Tecnologías

* **HTML5 Semántico**
* **Tailwind CSS v3** (vía CDN)
* **JavaScript Moderno (ES6+)**
* **SVG Vectorial Dinámico**

---
