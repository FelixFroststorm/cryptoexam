// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract TokenExchange is ReentrancyGuard {
    address public owner;

    IERC20 public immutable tokenA;
    IERC20 public immutable tokenB;

    uint256 public rateNum; // Numerator of the exchange rate
    uint256 public rateDenom; // Denominator of the exchange rate

    error InsufficientLiquidity(); // Custom error for insufficient liquidity

    event SwapExecuted(
        address indexed user,
        uint256 amountIn,
        uint256 amountOut,
        uint256 rateNum,
        uint256 rateDenom
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(
        address _tokenA,
        address _tokenB,
        uint256 _rateNum,
        uint256 _rateDenom
    ) {
        require(_rateDenom > 0, "Invalid denominator");
        owner = msg.sender;
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        rateNum = _rateNum;
        rateDenom = _rateDenom;
    }

    function exchange(uint256 amountIn, uint256 minAmountOut) external nonReentrant returns (uint256) {
        
        require(amountIn > 0, "Invalid input amount");

        // Calculate the expected output based on the exchange rate
        uint256 numerator = amountIn * rateNum;
        uint256 denominator = rateDenom;
        uint256 amountOut = (numerator + denominator / 2) / denominator;

        
        // Ensure sufficient liquidity exists in the contract
        uint256 contractLiquidity = tokenB.balanceOf(address(this));
        
        if (contractLiquidity < amountOut) {
            
            revert InsufficientLiquidity(); // Emit custom error
        }

        // Ensure slippage tolerance is respected
        require(amountOut >= minAmountOut, "Slippage exceeded");

        // Transfer tokens and execute the swap
        tokenA.transferFrom(msg.sender, address(this), amountIn);
        tokenB.transfer(msg.sender, amountOut);

        emit SwapExecuted(msg.sender, amountIn, amountOut, rateNum, rateDenom);
        
                
        return amountOut;
    }

    function updateRate(uint256 newNum, uint256 newDenom) external onlyOwner {
        require(newDenom > 0, "Invalid denominator");

        rateNum = newNum;
        rateDenom = newDenom;
    }
}
