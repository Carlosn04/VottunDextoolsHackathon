const ethers = require('ethers');
const fs = require('fs');

// Carga los detalles del contrato desplegado
const contractData = JSON.parse(fs.readFileSync('./deployedContract.json', 'utf8'));

// Configura el proveedor y el signer
const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const signer = provider.getSigner();

const dcaContract = new ethers.Contract(contractData.address, contractData.abi, signer);

module.exports = {
  createPosition: async (tokenA, tokenB, amount, interval) => {
    // Lógica para crear una posición
    const tx = await dcaContract.deposit(tokenA, tokenB, amount, interval);
    await tx.wait();
    console.log(`Position created with ${amount} of tokenA for interval ${interval}`);
  },

  modifyPosition: async (newAmount, newInterval) => {
    // Lógica para modificar una posición
    const tx = await dcaContract.modifyPosition(newAmount, newInterval);
    await tx.wait();
    console.log(`Position modified to ${newAmount} and interval ${newInterval}`);
  },

  terminatePosition: async () => {
    // Lógica para terminar una posición
    const tx = await dcaContract.terminatePosition();
    await tx.wait();
    console.log("Position terminated");
  }
};
