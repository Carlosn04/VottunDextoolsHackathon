const { ethers } = require('ethers');
const cron = require('node-cron');

// Configuración del proveedor y del contrato
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const contractAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_tokenB",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_totalDeposit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_swapAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_interval",
          "type": "uint256"
        }
      ],
      "name": "createPosition",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "executeSwap",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllUsersWithPositions",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_newSwapAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_newInterval",
          "type": "uint256"
        }
      ],
      "name": "modifyPosition",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "positions",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "contract IERC20",
          "name": "tokenB",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "swapAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountB",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "interval",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "nextSwapTime",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "terminatePosition",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "usersWithPositions",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
]; // ABI de tu contrato
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Mantén esto seguro y no lo expongas
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

// Función para ejecutar el swap si es necesario
async function checkAndExecuteSwaps() {
    try {
        // Obtener todas las direcciones de usuarios con posiciones
        const usersWithPositions = await contract.getAllUsersWithPositions();
        let swapsExecuted = 0;

        for (let i = 0; i < usersWithPositions.length; i++) {
            const userAddress = usersWithPositions[i];
            const position = await contract.positions(userAddress);
            // Comprobar si es el momento de ejecutar el swap
            if (block.timestamp >= position.nextSwapTime.toNumber()) {
                console.log(`Ejecutando swap para la dirección: ${userAddress}`);
                const tx = await contract.executeSwap(userAddress);
                await tx.wait();
                swapsExecuted++;
                console.log(`Swap ejecutado para la dirección: ${userAddress}, tx: ${tx.hash}`);
            }
        }

        // Si no se ejecutó ningún swap en este ciclo
        if (swapsExecuted === 0) {
            console.log("No se encontraron swaps para ejecutar en este momento.");
        }
    } catch (error) {
        console.error("Error al ejecutar los swaps:", error);
    }
}

// Programar la ejecución del bot
cron.schedule('*/15 * * * * *', () => { // Se ejecuta cada 15 segundos
    checkAndExecuteSwaps();
});

console.log("Bot iniciado...");
