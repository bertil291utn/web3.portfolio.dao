// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MultipleEdition is ERC1155, ERC1155Supply, Ownable {
    string private _uri;
    mapping(uint256 => uint256) private tokenPrice;

    constructor() ERC1155("") {}

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

    function uri(
        uint256 _tokenId
    ) public view override returns (string memory) {
        bytes memory uriBytes = bytes(_uri);
        if (!exists(_tokenId) || uriBytes.length == 0) return "";
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
    ) internal virtual override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
