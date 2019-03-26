pragma solidity >=0.4.22 <0.6.0;

import "./MyToken.sol";

contract Certificates{
    
    mapping (uint => bytes32) public certificates;
    address owner;
    MyToken public tokenContract;
    uint256 verificationValue = 30;
    uint decimals = 18;
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
        //function to verify the merkle root generated with hash of leaf
    function verifyProof(bytes32[] memory proof, 
        bytes32 root, 
        bytes32 leaf) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash < proofElement) {
                // Hash(current computed hash + current element of the proof)
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                // Hash(current element of the proof + current computed hash)
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }

        // Check if the computed hash (root) is equal to the provided root
        return computedHash;
    }

    
    constructor(MyToken token) public payable{
        owner = msg.sender;
        tokenContract = token;
    }
    
    /*used to publish the merkle root of a particular years
      Can only be called by the owner of the contract*/
    function publish(uint year, bytes32 root) public onlyOwner{
        if(certificates[year] == 0x0)
            certificates[year] = root;
    }
    
    function getHash(uint year) view public returns (bytes32){
        return certificates[year];
    }
    
    function _verify(uint year, bytes32 merkleRoot) view internal returns (bool){
        if(certificates[year] == merkleRoot)
            return true;
        else
            return false;
    }
    
    function verify(bytes32[] memory proof, bytes32 hash, uint year) public payable returns (bytes32){
        require(tokenContract.balanceOf(msg.sender) >= verificationValue * 10 ** uint256(decimals));
        bytes32 root = certificates[year];
        
        bytes32 isValid = verifyProof(proof, root, hash);
        
        //Accept the fee for verifying the certificate
        tokenContract.acceptFee(msg.sender, verificationValue * 10 ** uint256(decimals));
        
        return isValid;
    }
}