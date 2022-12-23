// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BertilERC20TokensUUPS is Initializable, ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable  {
    
    constructor() {
        _disableInitializers();
    }

    function initialize(address _claimableToken) initializer public {
        __ERC20_init("BertilToken", "BATL");
        __Ownable_init();
        __UUPSUpgradeable_init();

        _mint(_claimableToken, 10000 * 10**decimals());
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}
