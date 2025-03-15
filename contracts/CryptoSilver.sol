// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CryptoSilver is ERC20 {
    constructor() ERC20("CryptoSilver", "CSLV") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
