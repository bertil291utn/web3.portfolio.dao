// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IERC20.sol";

contract Claimable {
    uint256 internal claimableAmount = 100 * 1e18;

    function claim(IERC20 _tokenAddress) external {
        require(msg.sender != address(0), "Invalid address");
        require(
            _tokenAddress.balanceOf(msg.sender) <= 0,
            "Tokens already claimed"
        );
        _tokenAddress.transfer(msg.sender, claimableAmount);
    }
}
