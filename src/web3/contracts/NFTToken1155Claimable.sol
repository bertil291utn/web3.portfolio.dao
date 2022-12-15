// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC20.sol";
import "./IERC1155.sol";

contract MultipleEditionClaimable is ReentrancyGuard, Ownable {
    function mintUser(
        uint256 id,
        IERC1155 tokenERC1155Address,
        IERC20 _tokenERC20Address,
        address owner
    ) public {
        if (tokenERC1155Address.getTokenPrice(id) > 0) {
            //approve for this contract address to transfer funds
            _tokenERC20Address.transferFrom(
                msg.sender,
                address(this),
                tokenERC1155Address.getTokenPrice(id)
            );
        }
        tokenERC1155Address.safeTransferFrom(owner, msg.sender, id, 1, "");
    }

    function withdraw() public onlyOwner nonReentrant {
        (bool success, ) = address(msg.sender).call{
            value: address(this).balance
        }("");
        require(success, "withdraw failed to send");
    }
}
