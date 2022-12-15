// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.7.3/token/ERC20/ERC20.sol";

contract BertilTokens is ERC20 {
    uint256 internal fullAmountTokens = 10000 * 10**decimals();

    constructor(address _claimableToken) ERC20("BertilTokens", "BATL") {
        _mint(_claimableToken, fullAmountTokens);
    }
}
