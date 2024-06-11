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
    /*ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [
        // Replace with your Ganache accounts private keys
        "0x32b754b97bc889c70183df65698f55b37b27a88185fb13a8b155a878c7c1e725"
      ]
    }*/
    sepolia: {
      url: "https://rpc.sepolia.org",
      chainId: 11155111, // Sepolia testnet chain ID
      accounts: ["1096b8c0344457022f83d02f890de480197187794982fde5808bb9d8ac00dca5"]
    }
  }
};

