const { ethers } = require("hardhat");

async function main() {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Reemplaza con tu clave privada
    const wallet = new ethers.Wallet(privateKey, provider);

    const stableCoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Dirección de tu DOC
    const StableCoin = await ethers.getContractFactory("DOC", wallet);
    const stableCoin = StableCoin.attach(stableCoinAddress);

    const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Dirección del destinatario
    const amount = ethers.parseUnits("1000", 18); // Cantidad de tokens a acuñar

    const tx = await stableCoin.mint(recipient, amount);
    await tx.wait();

    console.log(`Minted ${amount.toString()} tokens to ${recipient}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
