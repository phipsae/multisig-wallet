// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import './MultiSigWallet.sol';
import './IMultiSigFactory.sol';

contract MultiSigFactory is IMultiSigFactory {

    event NewMultiSigContract(address indexed creator, uint256 signaturesRequired );

    MultiSigContract[] public multiSigContracts;
    address public newContract;

    struct MultiSigContract {
        address owner;
        address contractAddress;
        uint requiredConfirmations;
        bool shown;
        address[] signers;
    }

    function getMultiSigContracts() public view returns (MultiSigContract[] memory) {
        return multiSigContracts;
    }

    function updateSigners(address _contractAddress, address[] memory _newSigners) public {
        console.log("AM I CALLLED? multisigfactory");
        for (uint i = 0; i < multiSigContracts.length; i++) {
            if (multiSigContracts[i].contractAddress == _contractAddress) {
                address[] storage existingSigners = multiSigContracts[i].signers;

                for (uint j = 0; j < _newSigners.length; j++) {
                    address signerToAdd = _newSigners[j];

                    bool signerExists = false;
                    for (uint k = 0; k < existingSigners.length; k++) {
                        if (existingSigners[k] == signerToAdd) {
                            signerExists = true;
                            break;
                        }
                    }
                    if (!signerExists) {
                        existingSigners.push(signerToAdd);
                    }
                }
            }
        }
    }

    function removeSigners(address _contractAddress, address _signerToRemove) public {
    console.log("Removing signer from MultiSigFactory");
        for (uint i = 0; i < multiSigContracts.length; i++) {
            if (multiSigContracts[i].contractAddress == _contractAddress) {
                address[] storage existingSigners = multiSigContracts[i].signers;

                for (uint j = 0; j < existingSigners.length; j++) {
                    if (existingSigners[j] == _signerToRemove) {
                        // Remove signer from array
                        removeSignerAtIndex(existingSigners, j);
                        return;
                    }
                }
            }
        }
    }

    function removeSignerAtIndex(address[] storage _signers, uint _index) internal {
        require(_index < _signers.length, "index out of bound");
        for (uint i = _index; i < _signers.length - 1; i++) {
            _signers[i] = _signers[i + 1];
        }
        _signers.pop();
    }

    function createContract(uint _requiredConfirmations) public {
        require(_requiredConfirmations > 0, "signatures must be greater than 0");
        newContract = address(new MultiSigWallet(msg.sender, _requiredConfirmations, address(this)));
        // multiSigContracts.push(MultiSigContract({owner: msg.sender, contractAddress: newContract, requiredConfirmations: _requiredConfirmations, shown: true, signers: [msg.sender]}));
        MultiSigContract storage msc = multiSigContracts.push();
        msc.owner = msg.sender;
        msc.contractAddress = newContract;
        msc.requiredConfirmations = _requiredConfirmations;
        msc.shown = true;
        msc.signers.push(msg.sender);
    
        emit NewMultiSigContract(msg.sender, _requiredConfirmations);   
    }
}