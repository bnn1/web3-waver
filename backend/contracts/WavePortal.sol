// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
  uint256 totalWaves;
  address[] wavers;

  struct Waver {
    address waver;
    uint8 count;
  }

  constructor() {
    console.log("You're about to emerge... To emerge as a solidity developer. He-he-he-he.");
  }

  function wave() public {
    totalWaves += 1;
    wavers.push(msg.sender);

    console.log("%s says hi!", msg.sender);
  }

  function getTotalWaves() public view returns(uint256 waves) {
    console.log("%d people total said hi :))", totalWaves);
    return totalWaves;
  }

  function getWavers() public view returns(address[] memory) {
    return wavers;
  }
}

