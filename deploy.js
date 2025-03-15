const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  // Deploy CryptoGold
  const TokenA = await ethers.getContractFactory("CryptoGold");
  const tokenA = await TokenA.deploy();
  await tokenA.waitForDeployment();
  console.log(`CryptoGold deployed to: ${await tokenA.getAddress()}`);

  // Deploy CryptoSilver
  const TokenB = await ethers.getContractFactory("CryptoSilver");
  const tokenB = await TokenB.deploy();
  await tokenB.waitForDeployment();
  console.log(`CryptoSilver deployed to: ${await tokenB.getAddress()}`);

  // Deploy TokenExchange
  const Exchange = await ethers.getContractFactory("TokenExchange");
  const exchange = await Exchange.deploy(await tokenA.getAddress(), await tokenB.getAddress(), 2, 1);
  await exchange.waitForDeployment();
  console.log(`TokenExchange deployed to: ${await exchange.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
