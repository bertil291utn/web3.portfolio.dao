// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable@4.8.1/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable@4.8.1/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable@4.8.1/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable@4.8.1/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable@4.8.1/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable@4.8.1/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BatlDaoTokens is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuard
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    uint256 private constant MAXIMUM_MINTED_AMOUNT = 5;
    uint256 private constant TOKEN_PRICE = 0.27 ether;

    CountersUpgradeable.Counter private _tokenIdCounter;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC721_init("BATL DAO tokens", "BAT");
        __ERC721URIStorage_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function getPriceToken() public pure returns (uint256) {
        return TOKEN_PRICE;
    }

    function safeMint(string memory uri) public payable {
        require(
            balanceOf(msg.sender) < MAXIMUM_MINTED_AMOUNT,
            "MAXIMUM MINTED TOKEN REACHED"
        );
        require(msg.value >= TOKEN_PRICE, "INSUFFICIENT ETH FOR TOKEN PRICE");
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}

    function withdraw() public onlyOwner nonReentrant {
        (bool success, ) = address(owner()).call{value: address(this).balance}(
            ""
        );
        require(success, "withdraw failed to send");
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    receive() external payable {}

    fallback() external payable {}
}
