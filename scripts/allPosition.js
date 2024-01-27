const { ethers } = require("hardhat");

async function main() {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const dcaAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Reemplaza con la dirección de tu contrato DCA

    const DCA = await ethers.getContractFactory("DCA");
    const dca = DCA.attach(dcaAddress).connect(provider);

    const users = await dca.getAllUsersWithPositions();
    for (const user of users) {
        const position = await dca.positions(user);
        console.log(position)
    }
    console.log(users)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});