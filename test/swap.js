const { ethers } = require('ethers');

// Obtener la instancia predeterminada de AbiCoder
const abiCoder = new ethers.AbiCoder();

// Parámetros de la función y tipos
const types = ['uint256', 'address'];
const values = [
  '9000000000000000000', // docAmount
  '0xf69287f5ca3cc3c6d3981f2412109110cb8af076', // vendorAccount
];

// Codificar los argumentos
const encodedData = abiCoder.encode(types, values);
console.log(`Encoded Data: ${encodedData}`);

// La firma de la función
const functionSignature = 'redeemFreeDocVendors(uint256,address)';

// Calcular el identificador de la función
const functionSelector = ethers.keccak256(ethers.toUtf8Bytes(functionSignature)).slice(0, 10);
console.log(`Function Selector: ${functionSelector}`)

// Configuración del proveedor y el firmante
const provider = new ethers.JsonRpcProvider('https://go.getblock.io/ce13cd1a9cfb494e819effc0f8c15d3f'); // Reemplazar con la URL de tu nodo o proveedor de RPC
const signer = new ethers.Wallet('0a7cc0ccae150f5d166df4a7476a070fa71d1320769b3d339ab3d2341a23332c', provider); // Reemplazar con tu llave privada

// Dirección del contrato
const contractAddress = '0x2820f6D4d199B8d8838a4B26f9917754b86A0C1F';

// Crear los datos de la transacción
const txData = functionSelector + encodedData.slice(2); // Quita el '0x' de los datos codificados

async function sendTransaction() {
    const tx = {
        to: contractAddress,
        data: txData,
        // Las siguientes propiedades son opcionales, dependiendo de la red y el contrato podrías necesitar especificarlas
        // gasPrice: ethers.utils.parseUnits('10', 'gwei'),  // El precio del gas que estás dispuesto a pagar
        // gasLimit: 100000, // El límite de gas para la transacción
        value: ethers.parseEther('0'), // En caso de que la función requiera ETH
    };

    const txResponse = await signer.sendTransaction(tx);
    console.log(`Transaction Hash: ${txResponse.hash}`);

    // Esperar a que la transacción sea confirmada
    const receipt = await txResponse.wait();
    console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}

sendTransaction().catch(console.error);
