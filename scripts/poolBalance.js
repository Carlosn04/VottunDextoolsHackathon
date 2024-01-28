const hre = require("hardhat");

async function main() {
    const simplePoolAddress = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'; // La dirección del contrato SimplePool

    // Conexión con el contrato SimplePool
    const SimplePool = await hre.ethers.getContractAt("SimplePool", simplePoolAddress);

    // Leer las reservas del pool
    const reserveA = await SimplePool.reserveA();
    const reserveNative = await SimplePool.reserveNative();

    console.log("Reservas en el pool:");
    console.log(`- Tokens DOC: ${hre.ethers.formatUnits(reserveA, 9)}`); // Asumiendo que DOC tiene 18 decimales
    console.log(`- Criptomoneda nativa: ${hre.ethers.formatEther(reserveNative)}`);

    // Si deseas obtener la dirección del tokenA (DOC) y leer balances u otra información:
    const tokenAAddress = await SimplePool.tokenA();
    console.log(`Dirección del token DOC: ${tokenAAddress}`);

    // Si deseas, puedes conectarte al tokenA y leer balances o información adicional
    // const DOC = await hre.ethers.getContractAt("ERC20", tokenAAddress);
    // ... (cualquier otra operación que desees realizar con el tokenA)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
