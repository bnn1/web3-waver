// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WavePortal is Ownable {
    uint256 private seed;
    uint256 totalWaves;
    Waver[] wavers;

    mapping(address => uint256) private lastWavedAt;

    struct Waver {
        address waver;
        string message;
        uint256 timestamp;
    }

    event WinPrize(address waver);
    event WaveEvent(address waver, string message);

    constructor() payable {
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        totalWaves += 1;
        Waver memory waver = Waver(msg.sender, _message, block.timestamp);
        wavers.push(waver);
        lottery(msg.sender);
        lastWavedAt[msg.sender] = block.timestamp;
        emit WaveEvent(msg.sender, _message);
    }

    function lottery(address _waver) private {
        uint256 prizeAmount = 0.001 ether;

        if (prizeAmount <= address(this).balance) {
            seed = (block.timestamp + block.difficulty + seed) % 100;
            if (seed < 33) {
                (bool success, ) = (_waver).call{value: prizeAmount}("");
                assert(success);
                emit WinPrize(msg.sender);
            }
        }
    }

    function getTotalWaves() public view returns (uint256 waves) {
        return totalWaves;
    }

    function getWavers() public view returns (Waver[] memory) {
        return wavers;
    }

    function withdraw() public payable onlyOwner {
        (bool success, ) = (msg.sender).call{value: address(this).balance}("");
        require(success, "Couldn't withdraw funds");
    }
}
