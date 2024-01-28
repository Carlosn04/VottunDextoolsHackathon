const { ethers } = require("hardhat");

async function main() {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const dcaAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"; // Reemplaza con la dirección de tu contrato DCA

    const DCA = await ethers.getContractFactory("DCA");
    const dca = DCA.attach(dcaAddress).connect(provider);

    const userAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Reemplaza con la dirección del usuario cuya posición quieres ver
    const position = await dca.positions(userAddress);
    console.log(`Detalles de la posición para ${userAddress}:`);
    console.log(`Token A (stablecoin): ${position.tokenA}`);
    console.log(`Token B (RBTC): ${position.tokenB}`);
    console.log(`Cantidad de Token A: ${position.amountA.toString()}`);
    console.log(`Cantidad de Token B: ${position.amountB.toString()}`);
    console.log(`Cantidad del DCA: ${position.swapAmount}`)
    console.log(`Intervalo: ${position.interval}`);
    console.log(`Próximo Swap: ${new Date(Number(position.nextSwapTime) * 1000).toLocaleString()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});