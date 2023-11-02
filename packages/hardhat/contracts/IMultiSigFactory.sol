// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IMultiSigFactory {
    function updateSigners(address _contractAddress, address[] memory _signers) external;
    function removeSigners(address _contractAddress, address _signerToRemove) external;
}