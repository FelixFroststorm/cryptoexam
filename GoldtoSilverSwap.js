const { ethers } = require("hardhat");

async function main() {
    const [user] = await ethers.getSigners();

    // Get contract instances
    const tokenAAddress = "0xC772CA584BDD329713B9eA8298f0Bb2261D4c696";
    const tokenBAddress = "0x554274f68A271E9449ef8B0e7531a9Cc03807006";
    const exchangeAddress = "0xc91D2d58D11FB74bAfde237ce5D9ffcBf4999B66";

    const tokenA = await ethers.getContractAt("IERC20", tokenAAddress, user);
    const tokenB = await ethers.getContractAt("IERC20", tokenBAddress, user);
    const exchange = await ethers.getContractAt("TokenExchange", exchangeAddress, user);

    // Approve TokenExchange to spend user's CryptoGold tokens
    const amountIn = ethers.parseUnits("100", 18); // Example: 100 tokens
    await tokenA.approve(exchangeAddress, amountIn);

    // Perform the swap
    const minAmountOut = ethers.parseUnits("100", 18); // Example: minimum acceptable output
    const tx = await exchange.exchange(amountIn, minAmountOut);
    await tx.wait();

    console.log(`Swapped ${amountIn.toString()} CryptoGold for CryptoSilver`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
