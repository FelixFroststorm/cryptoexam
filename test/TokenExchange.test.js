const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenExchange", function () {
  let tokenA, tokenB, exchange;
  let owner, user;

  before(async function () {
    [owner, user] = await ethers.getSigners();

    const TokenA = await ethers.getContractFactory("CryptoGold");
    tokenA = await TokenA.deploy();
    await tokenA.waitForDeployment();

    const TokenB = await ethers.getContractFactory("CryptoSilver");
    tokenB = await TokenB.deploy();
    await tokenB.waitForDeployment();

    const Exchange = await ethers.getContractFactory("TokenExchange");
    exchange = await Exchange.deploy(tokenA.target, tokenB.target, 2, 1);
    await exchange.waitForDeployment();

    // Fund the exchange with initial liquidity (5000 CryptoSilver)
    await tokenB.transfer(exchange.target, ethers.parseUnits("5000", 18));
  });

  it("Should allow users to swap tokens correctly", async function () {
    await tokenA.transfer(user.address, ethers.parseUnits("100", 18));
    await tokenA.connect(user).approve(exchange.target, ethers.parseUnits("50", 18));

    const balanceBefore = BigInt(await tokenB.balanceOf(user.address));
    
    const amountIn = ethers.parseUnits("50", 18);
    const minAmountOut = ethers.parseUnits("100", 18); // Expected output based on rate (2:1)
    
    await exchange.connect(user).exchange(amountIn, minAmountOut);
    
    const balanceAfter = BigInt(await tokenB.balanceOf(user.address));

    expect(balanceAfter - balanceBefore).to.equal(BigInt(ethers.parseUnits("100", 18)));
  });

  it("Should revert if the user tries to swap more tokens than they own", async function () {
    await tokenA.connect(user).approve(exchange.target, ethers.parseUnits("100", 18));

    const amountIn = ethers.parseUnits("200", 18);
    const minAmountOut = ethers.parseUnits("400", 18);

    await expect(
      exchange.connect(user).exchange(amountIn, minAmountOut)
    ).to.be.revertedWithCustomError(tokenA, "ERC20InsufficientAllowance");
  });
});
