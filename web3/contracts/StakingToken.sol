// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IERC20.sol";

contract StakingToken is ReentrancyGuard {
    mapping(address => uint256) internal stakeholders;
    uint256 private _totalSupply;

    /*========VIEWS==========*/
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return stakeholders[account];
    }

    /*========FUNCTIONS==========*/
    function stake(uint256 amount, IERC20 tokenAddress) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        require(tokenAddress.balanceOf(msg.sender) > 0, "Empty balance");
        _totalSupply += amount;
        stakeholders[msg.sender] += amount;
        tokenAddress.transferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount, IERC20 tokenAddress) public nonReentrant {
        require(amount > 0, "Cannot withdraw 0");
        _totalSupply -= amount;
        stakeholders[msg.sender] -= amount;
        tokenAddress.transfer(msg.sender, amount);
        emit Unstake(msg.sender, amount);
    }

    /*========EVENTS==========*/
    event Staked(address indexed user, uint256 amount);
    event Unstake(address indexed user, uint256 amount);
}
