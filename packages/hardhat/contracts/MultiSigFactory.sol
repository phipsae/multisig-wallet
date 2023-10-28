// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import './MultiSigWallet.sol';

contract MultiSigFactory {

    event NewMultiSigContract(address indexed creator, uint256 signaturesRequired );

    // address public deployedContract;
    address[] public deployedContracts;
    address public newContract;
    uint256 public signaturesRequired;
    mapping(address => address[]) public multiSigContracts;

    function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }

    function createContract(uint _signaturesRequired) public {
        require(_signaturesRequired > 0, "signatures must be greater than 0");
        newContract = address(new MultiSigWallet(msg.sender, _signaturesRequired));
        deployedContracts.push(newContract);
        multiSigContracts[msg.sender].push(newContract);
        emit NewMultiSigContract(msg.sender, _signaturesRequired);   
    }
}


