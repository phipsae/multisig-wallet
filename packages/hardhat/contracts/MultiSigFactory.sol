// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import './MultiSigWallet.sol';

contract MultiSigFactory {

    event NewMultiSigContract(address indexed creator, uint256 signaturesRequired );

    MultiSigContract[] public multiSigContracts;
    address public newContract;

    struct MultiSigContract {
        address owner;
        address contractAddress;
        uint requiredConfirmations;
        bool shown;
    }

    function getMultiSigContracts() public view returns (MultiSigContract[] memory) {
        return multiSigContracts;
    }

    function createContract(uint _requiredConfirmations) public {
        require(_requiredConfirmations > 0, "signatures must be greater than 0");
        newContract = address(new MultiSigWallet(msg.sender, _requiredConfirmations));
        multiSigContracts.push(MultiSigContract({owner: msg.sender, contractAddress: newContract, requiredConfirmations: _requiredConfirmations, shown: true}));
    
        emit NewMultiSigContract(msg.sender, _requiredConfirmations);   
    }
}


