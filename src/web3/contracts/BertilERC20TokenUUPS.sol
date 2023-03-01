// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IERC1155.sol";

contract BertilERC20TokensUUPS is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuard
{
    uint256 public constant TOKENS_PER_NFT = 35 * 10**18;
    uint256 public constant MAX_TOTAL_SUPPLY = 10000 * 10**18;
    uint256 public constant TOKEN_PRICE = 0.001 ether;
    mapping(address => bool) private _claimed;

    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC20_init("BertilToken", "BATL");
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function getPriceToken() public pure returns (uint256) {
        return TOKEN_PRICE;
    }

    function mint(uint256 amount) public payable {
        uint256 _requiredAmount = TOKEN_PRICE * amount;
        require(msg.value == _requiredAmount, "INSUFFICIENT ETH AMOUNT");
        uint256 amountWithDecimals = amount * 10**18;
        require(
            (totalSupply() + amountWithDecimals) <= MAX_TOTAL_SUPPLY,
            "MAX SUPPLY REACHED."
        );
        _mint(msg.sender, amountWithDecimals);
    }

    function claim(IERC1155 nftaddress) public {
        require(!_claimed[msg.sender], "ALREADY CLAIMED");
        uint256 balance = nftaddress.balanceOfByOwner(msg.sender);
        require(balance > 0, "NO OWNED TOKENS");

        uint256 tokensToMint = balance * TOKENS_PER_NFT;
        require(
            totalSupply() + tokensToMint <= MAX_TOTAL_SUPPLY,
            "MAX SUPPLY REACHED"
        );

        _mint(msg.sender, balance * TOKENS_PER_NFT);
        _claimed[msg.sender] = true;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}

    receive() external payable {}

    fallback() external payable {}

    function withdraw() public onlyOwner nonReentrant {
        // Ensure that the owner is an EOA (not a contract)
        address payable ownerAddress = payable(owner());
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(ownerAddress)
        }
        require(codeSize == 0, "Cannot withdraw to a contract");

        (bool success, ) = ownerAddress.call{value: address(this).balance}("");
        require(success, "withdraw failed to send");
    }
}
//goerli 0xbF8d6064DF0ADe6b52b08B75b1D0CaBaf29F8F07