// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IERC20.sol";

contract UniqueEdition is ERC721, ERC721URIStorage {
    constructor() ERC721("BATANUNIQUE", "BATLA") {}

    function safeMint(
        uint256 tokenId,
        string memory uri,
        uint256 price,
        IERC20 _tokenAddress
    ) public {
        require(price > 0, "Token price is less than zero");
        _tokenAddress.transferFrom(msg.sender, address(this), price);
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
