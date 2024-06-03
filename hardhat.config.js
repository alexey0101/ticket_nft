/*require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
//module.exports = {
//  solidity: "0.8.24",
//};

require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.1",
      },
      {
        version: "0.8.17", // Add any other versions you might need
      }
    ]
  },
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [
        // Replace with your Ganache accounts private keys
        "0x5e201decd1def95ae66206eb41c4b95e35cc324ad6900634a03e8ad2544a5dcf"
      ]
    }
  }
};

