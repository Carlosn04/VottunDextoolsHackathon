const { ethers } = require("hardhat");

async function main() {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const privateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
    const wallet = new ethers.Wallet(privateKey, provider);

    const stableCoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const dcaAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"
    const mockEthAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Dirección nula para simular ETH

    const DCA = await ethers.getContractFactory("DCA", wallet);
    const dca = DCA.attach(dcaAddress);

    const tokenA = stableCoinAddress;
    const totalDeposit = ethers.parseUnits("150", 18);
    const amountPerInterval = ethers.parseUnits("10", 18); 
    const interval = 60 // 60 * 60 * 24 === cada 24 horas
    const tx = await dca.createPosition(tokenA, totalDeposit, amountPerInterval, interval);
    await tx.wait();

    console.log(`Deposit executed with ${totalDeposit.toString()} of StableCoin`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
