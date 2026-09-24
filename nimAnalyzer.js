/**
 * NimAnalyzer - Motor algorítmico de Minimax con Poda Alfa-Beta para Nim.
 * 
 * Reglas del juego:
 * - Estado inicial por defecto: [1, 3] (Fila 1: 1 objeto, Fila 2: 3 objetos).
 * - En cada turno, un jugador retira 1 o más objetos de una sola fila.
 * - Orden de exploración ESTRICTO:
 *    1. Probar retiros de la Fila 1 (índice 0).
 *    2. Probar retiros de la Fila 2 (índice 1).
 *    3. Para cada fila, retirar en orden ascendente: 1, luego 2, luego 3...
 * - Convención Normal de Juego: Gana quien retira el último objeto.
 * - Función de Utilidad:
 *    +1 si gana MAX.
 *    -1 si gana MIN.
 * - Inicia MAX.
 */

class NimAnalyzer {
  /**
   * @param {number[]} [initialState=[1, 3]] - Estado inicial del juego de Nim [fila1, fila2].
   */
  constructor(initialState = [1, 3]) {
    this.initialState = [...initialState];
    this.frames = [];
    this.nodeCounter = 0;
  }

  /**
   * Determina si un estado es terminal (no quedan objetos en ninguna fila).
   * @param {number[]} state
   * @returns {boolean}
   */
  isTerminal(state) {
    return state.every(count => count === 0);
  }

  /**
   * Calcula el string descriptivo de la acción realizada entre dos estados consecutivos
   * basándose estrictamente en la diferencia de fichas por fila:
   * - Fila 1: parentState[0] - childState[0]
   * - Fila 2: parentState[1] - childState[1]
   * 
   * @param {number[]} parentState - Estado previo [f1, f2]
   * @param {number[]} childState - Estado resultante [f1, f2]
   * @returns {string} String formateado de la acción (ej. "F1 - 1", "F2 - 2", "F2 - 3")
   */
  static getActionString(parentState, childState) {
    if (!parentState || !childState) return '';
    const diffRow1 = parentState[0] - childState[0];
    const diffRow2 = parentState[1] - childState[1];

    if (diffRow1 > 0) {
      return `F1 - ${diffRow1}`;
    }
    if (diffRow2 > 0) {
      return `F2 - ${diffRow2}`;
    }
    return '';
  }

  /**
   * Método de instancia auxiliar para cálculo de la acción a partir de la diferencia de estados.
   * @param {number[]} parentState
   * @param {number[]} childState
   * @returns {string}
   */
  getActionString(parentState, childState) {
    return NimAnalyzer.getActionString(parentState, childState);
  }

  /**
   * Genera los movimientos legales siguiendo el ORDEN ESTRICTO:
   * 1. Fila 1 (índice 0), luego Fila 2 (índice 1).
   * 2. En cada fila, retirar primero 1, luego 2, etc.
   * Cada jugada incluye explícitamente su string de acción calculado por diferencia de estado.
   * 
   * @param {number[]} state
   * @returns {Array<{row: number, rowIndex: number, count: number, action: string, resultingState: number[]}>}
   */
  getLegalMoves(state) {
    const moves = [];

    // Fila 1 (índice 0)
    for (let c = 1; c <= state[0]; c++) {
      const resultingState = [state[0] - c, state[1]];
      moves.push({
        row: 1,
        rowIndex: 0,
        count: c,
        action: `F1 - ${c}`,
        resultingState
      });
    }

    // Fila 2 (índice 1)
    for (let c = 1; c <= state[1]; c++) {
      const resultingState = [state[0], state[1] - c];
      moves.push({
        row: 2,
        rowIndex: 1,
        count: c,
        action: `F2 - ${c}`,
        resultingState
      });
    }

    return moves;
  }

  /**
   * Ejecuta el análisis Minimax con Poda Alfa-Beta y retorna el historial completo de frames.
   * @returns {{
   *   initialState: number[],
   *   rootValue: number,
   *   bestMove: {row: number, count: number, action: string, resultingState: number[]}|null,
   *   totalNodes: number,
   *   totalFrames: number,
   *   frames: Array<Object>
   * }}
   */
  analyze() {
    this.frames = [];
    this.nodeCounter = 0;

    const rootResult = this.minimax(
      this.initialState,
      'MAX',
      -Infinity,
      Infinity,
      null, // parentNodeID
      null, // moveFromParent
      0,    // depth
      null  // parentState
    );

    return {
      initialState: [...this.initialState],
      rootValue: rootResult.value,
      bestMove: rootResult.bestMove,
      totalNodes: this.nodeCounter,
      totalFrames: this.frames.length,
      frames: this.frames
    };
  }

  /**
   * Función recursiva Minimax con Poda Alfa-Beta y registro detallado de frames.
   * 
   * @param {number[]} boardState - Estado actual del tablero [f1, f2].
   * @param {'MAX'|'MIN'} currentPlayer - Jugador al que le corresponde el turno.
   * @param {number} alpha - Mejor valor encontrado hasta ahora para MAX.
   * @param {number} beta - Mejor valor encontrado hasta ahora para MIN.
   * @param {string|null} parentId - ID del nodo padre.
   * @param {Object|null} moveFromParent - Movimiento que condujo a este estado.
   * @param {number} depth - Profundidad en el árbol de búsqueda.
   * @param {number[]|null} [parentState=null] - Estado del tablero del nodo padre.
   * @returns {{value: number, bestMove: Object|null}}
   */
  minimax(boardState, currentPlayer, alpha, beta, parentId, moveFromParent, depth, parentState = null) {
    const isMax = currentPlayer === 'MAX';
    const nodeId = `node_${++this.nodeCounter}`;
    const actionFromParent = parentState ? NimAnalyzer.getActionString(parentState, boardState) : null;
    
    let currentValue = isMax ? -Infinity : Infinity;
    let currentAlpha = alpha;
    let currentBeta = beta;
    let bestMove = null;

    // Movimiento entrante enriquecido con su string de acción determinístico
    const enrichedMoveFromParent = moveFromParent ? {
      ...moveFromParent,
      action: actionFromParent || moveFromParent.action || `F${moveFromParent.row} - ${moveFromParent.count}`
    } : null;

    // -------------------------------------------------------------
    // FRAME: VISITING (Al ingresar a un nodo antes de expandir o evaluar)
    // -------------------------------------------------------------
    this.recordFrame({
      nodeID: nodeId,
      boardState: [...boardState],
      currentPlayer,
      actionType: 'visiting',
      action: actionFromParent,
      currentAlpha,
      currentBeta,
      currentValue,
      prunedBranches: [],
      depth,
      parentId,
      moveFromParent: enrichedMoveFromParent,
      description: `Visitando nodo ${nodeId} con estado [${boardState}] en turno ${currentPlayer}`
    });

    // -------------------------------------------------------------
    // CASO TERMINAL: No quedan objetos en el tablero [0, 0]
    // -------------------------------------------------------------
    if (this.isTerminal(boardState)) {
      // Regla: Gana el jugador que retira el último objeto.
      // - Si currentPlayer es MAX, significa que MIN acaba de jugar y retiró el último objeto -> Gana MIN (-1).
      // - Si currentPlayer es MIN, significa que MAX acaba de jugar y retiró el último objeto -> Gana MAX (+1).
      currentValue = isMax ? -1 : 1;

      // FRAME: EVALUATING (Evaluación de hoja terminal)
      this.recordFrame({
        nodeID: nodeId,
        boardState: [...boardState],
        currentPlayer,
        actionType: 'evaluating',
        action: actionFromParent,
        currentAlpha,
        currentBeta,
        currentValue,
        prunedBranches: [],
        depth,
        parentId,
        moveFromParent: enrichedMoveFromParent,
        isTerminal: true,
        winner: currentValue === 1 ? 'MAX' : 'MIN',
        description: `Estado terminal alcanzado [0, 0]. Gana ${currentValue === 1 ? 'MAX' : 'MIN'} (Utilidad = ${currentValue})`
      });

      // FRAME: BACKTRACKING (Retorno de valor terminal al padre)
      this.recordFrame({
        nodeID: nodeId,
        boardState: [...boardState],
        currentPlayer,
        actionType: 'backtracking',
        action: actionFromParent,
        currentAlpha,
        currentBeta,
        currentValue,
        prunedBranches: [],
        depth,
        parentId,
        moveFromParent: enrichedMoveFromParent,
        isTerminal: true,
        description: `Backtracking desde hoja terminal ${nodeId} retornando valor ${currentValue}`
      });

      return { value: currentValue, bestMove: null };
    }

    // -------------------------------------------------------------
    // GENERACIÓN Y EXPLORACIÓN DE RAMAS HIJAS
    // -------------------------------------------------------------
    const legalMoves = this.getLegalMoves(boardState);
    const nextPlayer = isMax ? 'MIN' : 'MAX';

    for (let i = 0; i < legalMoves.length; i++) {
      const move = legalMoves[i];
      const moveAction = NimAnalyzer.getActionString(boardState, move.resultingState);
      const childMovePayload = {
        ...move,
        action: moveAction
      };

      // Llamada recursiva en profundidad pasando boardState actual como parentState
      const childResult = this.minimax(
        move.resultingState,
        nextPlayer,
        currentAlpha,
        currentBeta,
        nodeId,
        childMovePayload,
        depth + 1,
        boardState
      );

      // Actualización de valores según MAX o MIN
      let updatedBestMove = false;
      if (isMax) {
        if (childResult.value > currentValue) {
          currentValue = childResult.value;
          bestMove = childMovePayload;
          updatedBestMove = true;
        }
        currentAlpha = Math.max(currentAlpha, currentValue);
      } else {
        if (childResult.value < currentValue) {
          currentValue = childResult.value;
          bestMove = childMovePayload;
          updatedBestMove = true;
        }
        currentBeta = Math.min(currentBeta, currentValue);
      }

      // FRAME: EVALUATING (Actualización del nodo tras recibir respuesta del hijo)
      this.recordFrame({
        nodeID: nodeId,
        boardState: [...boardState],
        currentPlayer,
        actionType: 'evaluating',
        action: actionFromParent,
        currentAlpha,
        currentBeta,
        currentValue,
        prunedBranches: [],
        depth,
        parentId,
        evaluatedMove: childMovePayload,
        childReturnedValue: childResult.value,
        updatedBestMove,
        description: `${currentPlayer} evalúa jugada (${moveAction} -> [${move.resultingState}]) recibiendo ${childResult.value}. Mejor valor actual: ${currentValue}, α: ${currentAlpha}, β: ${currentBeta}`
      });

      // -------------------------------------------------------------
      // CONDICIÓN DE PODA ALFA-BETA: α >= β
      // -------------------------------------------------------------
      if (currentAlpha >= currentBeta) {
        const remainingMoves = legalMoves.slice(i + 1);

        if (remainingMoves.length > 0) {
          // FRAME: PRUNING (Poda de ramas restantes con su string de acción)
          this.recordFrame({
            nodeID: nodeId,
            boardState: [...boardState],
            currentPlayer,
            actionType: 'pruning',
            action: actionFromParent,
            currentAlpha,
            currentBeta,
            currentValue,
            prunedBranches: remainingMoves.map(m => {
              const prunedAction = NimAnalyzer.getActionString(boardState, m.resultingState);
              return {
                move: { row: m.row, count: m.count },
                action: prunedAction,
                resultingState: [...m.resultingState]
              };
            }),
            depth,
            parentId,
            cutoffCondition: `α (${currentAlpha}) >= β (${currentBeta})`,
            description: `¡Poda Alfa-Beta en nodo ${nodeId}! Condición cumplida: α (${currentAlpha}) >= β (${currentBeta}). Se podan ${remainingMoves.length} rama(s) restante(s).`
          });

          // Interrupción de exploración para este nodo
          break;
        }
      }
    }

    // -------------------------------------------------------------
    // FRAME: BACKTRACKING (Finalización del nodo y retorno al padre)
    // -------------------------------------------------------------
    this.recordFrame({
      nodeID: nodeId,
      boardState: [...boardState],
      currentPlayer,
      actionType: 'backtracking',
      action: actionFromParent,
      currentAlpha,
      currentBeta,
      currentValue,
      prunedBranches: [],
      depth,
      parentId,
      bestMove,
      description: `Backtracking desde nodo ${nodeId}: ${currentPlayer} retorna mejor valor ${currentValue} a su predecesor.`
    });

    return { value: currentValue, bestMove };
  }

  /**
   * Registra un paso (frame) en el historial de ejecución.
   * @param {Object} frameData
   */
  recordFrame(frameData) {
    this.frames.push({
      frameIndex: this.frames.length,
      ...frameData
    });
  }
}

// Exportación para entornos CommonJS / Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NimAnalyzer };
}

// Exportación para navegadores / Window global
if (typeof window !== 'undefined') {
  window.NimAnalyzer = NimAnalyzer;
}
