// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTToken1155UUPS is
    Initializable,
    ERC1155Upgradeable,
    ERC1155SupplyUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    string private _uri;
    mapping(uint256 => uint256) private tokenPrice;

    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC1155_init("");
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    //GETTERS

    function getTokenPrice(uint256 _tokenId) public view returns (uint256) {
        return tokenPrice[_tokenId];
    }

    function setTokenPrice(uint256 _tokenId, uint256 _price) private onlyOwner {
        if (_price != 0) {
            tokenPrice[_tokenId] = _price;
        }
    }

    function ownerMint(
        uint256[] calldata ids,
        uint256[] calldata amounts,
        uint256[] calldata prices,
        address claimableAddress
    ) public onlyOwner {
        _mintBatch(msg.sender, ids, amounts, "");
        for (uint256 i = 0; i < prices.length; i++) {
            setTokenPrice(ids[i], prices[i]);
        }
        setApprovalForAll(claimableAddress, true);
    }

    function setURI(string calldata newuri) public onlyOwner {
        _uri = newuri;
    }

    function uri(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        bytes memory uriBytes = bytes(_uri);
        if (uriBytes.length == 0) return "";
        return
            string(abi.encodePacked(_uri, Strings.toString(_tokenId), ".json"));
    }

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

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}
