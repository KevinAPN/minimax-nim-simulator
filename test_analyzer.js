const { NimAnalyzer } = require('./nimAnalyzer.js');

console.log('========================================================');
console.log('--- TEST DE VERIFICACIÓN: NimAnalyzer [1, 3] ---');
console.log('========================================================\n');

const analyzer = new NimAnalyzer([1, 3]);
const analysis = analyzer.analyze();

console.log('1. RESULTADO GLOBAL MINIMAX:');
console.log('- Valor de la raíz (MAX):', analysis.rootValue, analysis.rootValue === 1 ? '✅ (MAX Gana)' : '❌');
console.log('- Mejor movimiento de apertura:', analysis.bestMove);
console.log('- Total de nodos únicos:', analysis.totalNodes);
console.log('- Total de frames generados:', analysis.totalFrames);

console.log('\n2. VERIFICACIÓN DE TRANSICIONES DESDE LA RAÍZ [1, 3]:');
const rootChildren = analysis.frames.filter(f => f.parentId === 'node_1' && f.actionType === 'visiting');
rootChildren.forEach(c => {
  const computedAction = NimAnalyzer.getActionString([1, 3], c.boardState);
  console.log(`  -> Nodo ${c.nodeID} [${c.boardState}]: acción en frame = '${c.action}' | calculada = '${computedAction}'`);
});

// Verificaciones específicas de Bug 1
const transTo11 = rootChildren.find(c => c.boardState[0] === 1 && c.boardState[1] === 1);
const transTo10 = rootChildren.find(c => c.boardState[0] === 1 && c.boardState[1] === 0);

if (transTo11 && transTo11.action === 'F2 - 2') {
  console.log('  ✅ [1, 3] -> [1, 1] correctamente mapeado a: "F2 - 2"');
} else {
  console.error('  ❌ ERROR: [1, 3] -> [1, 1] no es "F2 - 2":', transTo11?.action);
}

if (transTo10 && transTo10.action === 'F2 - 3') {
  console.log('  ✅ [1, 3] -> [1, 0] correctamente mapeado a: "F2 - 3"');
} else {
  console.error('  ❌ ERROR: [1, 3] -> [1, 0] no es "F2 - 3":', transTo10?.action);
}

console.log('\n3. VERIFICACIÓN DE PROPAGACIÓN MINIMAX EN SUB-ÁRBOL [1, 2] (node_15):');
const node15Children = analysis.frames.filter(f => f.parentId === 'node_15' && f.actionType === 'visiting');
node15Children.forEach(child => {
  const childBt = analysis.frames.find(f => f.nodeID === child.nodeID && f.actionType === 'backtracking');
  console.log(`  - Hijo ${child.nodeID} [${child.boardState}] (${child.currentPlayer}) retornó valor: ${childBt.currentValue}`);
});

const node15Bt = analysis.frames.find(f => f.nodeID === 'node_15' && f.actionType === 'backtracking');
console.log(`  -> Valor Minimax evaluado de node_15 [1, 1] (MAX): ${node15Bt.currentValue}`);

if (node15Bt.currentValue === -1) {
  console.log('  ✅ max(-1, -1) = -1. node_15 [1, 1] tiene valor -1 (Rojo en UI, jamás +1).');
} else {
  console.error('  ❌ ERROR: node_15 [1, 1] tiene valor corrupto:', node15Bt.currentValue);
}

console.log('\n4. VERIFICACIÓN DE PODA ALFA-BETA:');
const pruningFrames = analysis.frames.filter(f => f.actionType === 'pruning');
console.log(`Total eventos de poda: ${pruningFrames.length}`);
pruningFrames.forEach((frame, idx) => {
  console.log(`  [Poda #${idx + 1}] en ${frame.nodeID} [${frame.boardState}] (${frame.currentPlayer}):`);
  console.log(`  - Condición: ${frame.cutoffCondition}`);
  console.log(`  - Ramas podadas:`, frame.prunedBranches);
});
