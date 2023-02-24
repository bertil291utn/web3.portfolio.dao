// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable@4.8.1/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";

contract BatlDaoTokens is
    Initializable,
    ERC1155Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuard,
    ERC1155SupplyUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    uint256 private constant MAXIMUM_MINTED_AMOUNT = 5;
    uint256 private constant TOKEN_PRICE = 0.27 ether;
    mapping(uint256 => string) private _tokenURIs;

    CountersUpgradeable.Counter private _tokenIdCounter;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC1155_init("");
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function getPriceToken() public pure returns (uint256) {
        return TOKEN_PRICE;
    }

    function mint(uint256 amount, string calldata _uri) public payable {
        require(
            balanceOf(msg.sender) < MAXIMUM_MINTED_AMOUNT,
            "MAXIMUM MINTED TOKEN REACHED"
        );
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        require(
            msg.value >= TOKEN_PRICE * amount,
            "INSUFFICIENT ETH AMOUNT"
        );
        _mint(msg.sender, tokenId, amount, "");
        _setURI(tokenId, _uri);
    }

    function balanceOf(address owner) public view returns (uint256) {
        uint256 totalBalance = 0;
        for (uint256 i = 1; i <= _tokenIdCounter.current(); i++) {
            totalBalance += balanceOf(owner, i);
        }
        return totalBalance;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        bytes memory tokenURIBtyes = bytes(_tokenURIs[tokenId]);

        string memory _uri;
        if (tokenURIBtyes.length == 0) {
            _uri = "";
        } else {
            _uri = string(tokenURIBtyes);
        }

        return _uri;
    }

    function _setURI(uint256 tokenId, string memory _uri) private {
        _tokenURIs[tokenId] = _uri;
        emit URI(_uri, tokenId);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}

    //overrides
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155Upgradeable, ERC1155SupplyUpgradeable) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    receive() external payable {}

    fallback() external payable {}
}

//goerli 0xDE6dA1E62C8c65F91b70DB1280bc495A87F68dC2
