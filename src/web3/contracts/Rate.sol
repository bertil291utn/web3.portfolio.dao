// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Rate {
    mapping(address => mapping(uint256 => bool)) internal _rates;

    //VIEWS

    function isRatedProject(uint256 projectId) external view returns (bool) {
        return _rates[msg.sender][projectId];
    }

    function rateProject(uint256 projectId, bool value) public {
        require(msg.sender != address(0), "Invalid wallet address");
        require(projectId != 0, "Invalid project Id");

        _rates[msg.sender][projectId] = value;
        emit RatedProject(msg.sender, value);
    }

    //EVENTS
    event RatedProject(address, bool);
}
