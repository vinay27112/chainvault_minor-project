// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DocumentRegistry{

  struct Document {
    string cid;
    address owner;
    uint256 timestamp;
  }

  mapping(address => Document[]) private documents;
  mapping(string => address) private registeredCIDs;

  event DocumentRegistered(address indexed owner, string cid, uint256 timestamp);

  function registerDocument(string memory cid) public {

    if(registeredCIDs[cid] != address(0)){
      revert("CID already registered");
    }
  documents[msg.sender].push(Document(cid, msg.sender, block.timestamp));
  registeredCIDs[cid] = msg.sender;
  emit DocumentRegistered(msg.sender, cid, block.timestamp);
  }

  function getMyDocuments() public view returns (Document[] memory) {
    return documents[msg.sender];
  }

  function verifyCID(string memory cid) public view returns (address owner, uint256 timestamp, bool isValid) {
    address docOwner = registeredCIDs[cid];
    Document[] memory ownerDocs = documents[docOwner];

    for (uint i = 0; i < ownerDocs.length; i++) {
      if (keccak256(bytes(ownerDocs[i].cid)) == keccak256(bytes(cid))) {
        return (docOwner, ownerDocs[i].timestamp, true);
    }
    }
    return (address(0), 0, false);
  }
}
