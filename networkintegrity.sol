// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NetworkIntegrity {
    mapping(bytes32 => bool) public verifiedLogs;

    event LogStored(bytes32 indexed logHash);

    function storeLog(bytes32 logHash) public {
        verifiedLogs[logHash] = true;
        emit LogStored(logHash);
    }

    function verifyLog(bytes32 logHash) public view returns (bool) {
        return verifiedLogs[logHash];
    }
}
