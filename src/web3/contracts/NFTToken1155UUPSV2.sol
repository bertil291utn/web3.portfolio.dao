// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./NFTToken1155UUPS.sol";

contract NFTToken1155UUPSV2 is NFTToken1155UUPS {
    uint256 constant tokenPrice = 0.55 ether;

    function ownerMintv2(
        uint256[] calldata ids,
        uint256[] calldata amounts,
        address claimableAddress
    ) public onlyOwner {
        _mintBatch(msg.sender, ids, amounts, "");
        setApprovalForAll(claimableAddress, true);
    }

    function getCollectionTokenPrice() public pure returns (uint256) {
        return tokenPrice;
    }
}
