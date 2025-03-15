// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CryptoGold is ERC20 {
    constructor() ERC20("CryptoGold", "CGLD") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
