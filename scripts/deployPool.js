const { ethers } = require("hardhat");

async function main() {
    // Reemplaza 'TokenA_Address' con la dirección real de tu token ERC20
    const tokenAAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    // Desplegar el contrato SimplePool
    const SimplePool = await ethers.getContractFactory("SimplePool");
    const simplePool = await SimplePool.deploy(tokenAAddress);

    console.log("SimplePool deployed to:", simplePool.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});