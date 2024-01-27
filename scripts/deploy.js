const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const DCAContract = await hre.ethers.deployContract("DCA");
  const dca = await DCAContract.waitForDeployment()

  console.log("DCA deployed to:", dca.target);

  // Guardar los detalles del contrato en un archivo JSON
  const contractData = {
    contractName: "DCA",
    address: dca.target
  };

  fs.writeFileSync('./deployedContract.json', JSON.stringify(contractData, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
