const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const DOC = await hre.ethers.getContractFactory("DOC");
    const WRBTC = await hre.ethers.getContractFactory("WRBTC");

    // Desplegar el contrato con la dirección del deployer como initialOwner
    const tDOC = await DOC.deploy(deployer.address);
    const tWRTBC = await WRBTC.deploy(deployer.address);

    console.log("DOC deployed to:", tDOC.target);
    console.log("WRBTC deployed to:", tWRTBC.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});