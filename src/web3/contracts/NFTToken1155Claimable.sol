// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC20.sol";
import "./IERC1155.sol";

contract MultipleEditionClaimable is ReentrancyGuard, Ownable {
    function buyNFT(
        uint256 id,
        IERC1155 tokenERC1155Address,
        address NFTOwner
    ) public payable {
        require(
            msg.value >= tokenERC1155Address.getCollectionTokenPrice(),
            "INSUFFICIENT ETH FOR TOKEN PRICE"
        );
        tokenERC1155Address.safeTransferFrom(NFTOwner, msg.sender, id, 1, "");
    }

    function withdraw() public onlyOwner nonReentrant {
        (bool success, ) = address(owner()).call{value: address(this).balance}(
            ""
        );
        require(success, "withdraw failed to send");
    }
}
