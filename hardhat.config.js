require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/b4b503c2c8664aa083e59f51a36ea677",
      accounts: ["f2bf6b6add835e285a204c37685bb8bc81aab202e1ce597a191b7f57625f1d69"],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: "5EB1F1I7G28ZHHFAFURE3TCDKR4EGQ6RH4", 
    },
  },
};
