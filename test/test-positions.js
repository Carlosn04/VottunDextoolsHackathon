const positions = require('./positions.js');

async function testDCA() {
  try {
    // Crea una posición
    await positions.createPosition("tokenA_address", "tokenB_address", "1000000000000000000", 3600); // 1 token, intervalo de 1 hora

    // Modifica la posición
    await positions.modifyPosition("2000000000000000000", 7200); // 2 tokens, intervalo de 2 horas

    // Termina la posición
    await positions.terminatePosition();
  } catch (error) {
    console.error(error);
  }
}

testDCA();
