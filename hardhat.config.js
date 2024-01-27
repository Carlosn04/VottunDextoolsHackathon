require("@nomicfoundation/hardhat-toolbox");

const PRIVATE_KEY = "0a7cc0ccae150f5d166df4a7476a070fa71d1320769b3d339ab3d2341a23332c"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
      {
        version: "0.5.8"
      },
    ],
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    rsk: {
      url: "https://go.getblock.io/ce13cd1a9cfb494e819effc0f8c15d3f",
      chainId: 31, 
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
