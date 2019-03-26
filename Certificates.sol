pragma solidity >=0.4.22 <0.6.0;

contract Certificates{
    
    mapping (uint => bytes32) public certificates;
    address owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    constructor() public{
        owner = msg.sender;
    }
    
    function publish(uint year, bytes32 root) public onlyOwner{
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
    
    function verify(uint year) public returns (bool){         //TODO : Add merkle path in the parameter and then call oraclize
                                        //       here to get encrypted hash and then create merkle root 
    }                                   //       verify. Also get tokens as a fee
}