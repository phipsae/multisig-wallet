// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import './MetaMultiSigWallet.sol';

contract MultiSigFactory {

    event NewMultiSigContract(address indexed owner, address[] owners, uint256 signaturesRequired, uint chainId );
    event OwnerAdded(address indexed owner);

    address public deployedContract;
    uint256 public chainId;
    address[] public owners; 
    uint256 public signaturesRequired;

    function remove(uint _index) internal {
        require(_index < owners.length, "index out of bound");

        for (uint i = _index; i < owners.length - 1; i++) {
            owners[i] = owners[i + 1];
        }
        owners.pop();
    }

    function addOwner(address _owner) public {
        require(msg.sender != _owner, "you cannot add yourself");
        require(_owner != address(0), "zero address...");
        for (uint256 index = 0; index < owners.length; index++) {
            require(owners[index] != _owner, "address already added");
        }
        owners.push(_owner);
        emit OwnerAdded(_owner);
    }

    function removeOwner(address _owner) public {
        require(msg.sender != _owner, "you cannot remove yourself");
        require(_owner != address(0), "zero address..");
        for (uint256 index = 0; index < owners.length; index++) {
            if (owners[index] == _owner) {
                console.log(index);
                remove(index);
            }
        }

    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function createContract(uint256 _chainId, uint _signaturesRequired) public {
        owners.push(msg.sender);
        require(_signaturesRequired > 0, "signatures must be greater than 0");
        require(owners.length >= _signaturesRequired, "owner amount must be equal or greater than required signatures");
        deployedContract = address(new MetaMultiSigWallet(_chainId, owners, _signaturesRequired)); 
        emit NewMultiSigContract(msg.sender, owners, _signaturesRequired, _chainId);   
        owners.pop();
    }
}


