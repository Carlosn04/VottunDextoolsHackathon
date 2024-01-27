const { ethers } = require("hardhat");

async function approveToken() {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const privateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
    const wallet = new ethers.Wallet(privateKey, provider);

    const stableCoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const dcaAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Reemplaza con la dirección de tu contrato DCA

    const DOC = await ethers.getContractFactory("DOC", wallet);
    const stableCoin = DOC.attach(stableCoinAddress);

    const amount = ethers.parseUnits("1000", 9); // La cantidad que deseas permitir que el contrato DCA maneje

    const tx = await stableCoin.approve(dcaAddress, amount);
    await tx.wait();

    console.log(`Approved ${amount.toString()} DOC tokens for the DCA contract`);
}

approveToken().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
