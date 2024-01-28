const hre = require("hardhat");

async function main() {
    // Configuración
    const docTokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // La dirección del token DOC
    const simplePoolAddress = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'; // La dirección del contrato SimplePool
    const ownerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Tu dirección, asegúrate de tener control sobre ella en tu wallet

    // Conexión con los contratos
    const DOC = await hre.ethers.getContractAt("DOC", docTokenAddress);
    const SimplePool = await hre.ethers.getContractAt("SimplePool", simplePoolAddress);

    // Cantidad de tokens DOC que quieres añadir al pool
    const amountDoc = hre.ethers.parseUnits('40000', 18); // Ajusta a 18 o al número de decimales de tu token

    // Aprobar que SimplePool pueda gastar tus tokens DOC
    console.log("Aprobando tokens...");
    const approveTx = await DOC.approve(simplePoolAddress, amountDoc);
    await approveTx.wait();
    console.log("Tokens aprobados.");

    // Añadir liquidez al pool
    console.log("Añadiendo liquidez...");
    const addLiquidityTx = await SimplePool.addLiquidity(amountDoc, { value: hre.ethers.parseEther('1'), from: ownerAddress });
    await addLiquidityTx.wait();
    console.log("Liquidez añadida al pool.");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
