pragma solidity >=0.4.22 <0.6.0;

import "./MyToken.sol";
import "github.com/oraclize/ethereum-api/oraclizeAPI_0.4.25.sol";

contract Certificates is usingOraclize {
    
    struct Request{
        bytes32[] merklepath;
        uint256 year;
        bytes32 certificateHash;
    }
    
    //test variables
    bytes32[] public savedPath;
    bytes32 public calculatedHash;
    bytes32 public finalHash;
    uint256 public year;
    bytes32 public storedRoot;
    uint256 public verify1 = 0;
    uint256 public verify2 = 0;
    
    uint public verified = 0;
    
    mapping (uint256 => bytes32) public certificates;
    mapping (bytes32 => Request) public requests;
    address owner;
    MyToken public tokenContract;
    uint256 verificationFee = 30;
    uint decimals = 18;
    
    event LogConstructorInitiated(string nextStep);
    event LogNewOraclizeQuery(string description);
    
    /*To be used to set accessiblity of function so that
      only the deployer of the contract can call it*/
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    constructor() public payable{
        owner = msg.sender;
        //tokenContract = token;
    }
    
    /*Used to publish the merkle root of a particular years
      Can only be called by the owner of the contract*/
    function publish(uint year, bytes32 root) public onlyOwner{
        if(certificates[year] == 0x0)
            certificates[year] = root;
    }
    
    function verify(bytes32[] memory merklepath, string hash, uint256 year, bytes32 ehash) public returns (bytes32){
        if (oraclize_getPrice("URL") > address(this).balance) {
           emit LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
           emit LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
           string memory url = strConcat("json(http://5e7ea1cf.ngrok.io/query?hash=", hash, ").value");
           bytes32 id = oraclize_query("URL", url);
           requests[id] = Request(merklepath, year, certificates[year]);
           savedPath = merklepath;
           if(verify(requests[id].merklepath, certificates[year], ehash)){
               verify1 = 1;
           }
           else{
               verify1 = 2;
           }
           return id;
       }
    }
    
    function __callback(bytes32 myid, string result) public{
        if (msg.sender != oraclize_cbAddress()) 
            revert();
        bytes32 hash = keccak256(result);
        calculatedHash = hash;
        savedPath = requests[myid].merklepath;
        year = requests[myid].year;
        storedRoot = certificates[year];
        if(verify(savedPath, storedRoot, calculatedHash)){
            verify2 = 1;
        }
        else{
            verify2 = 2;
        }
    }
    
    function hash(bytes32 h) public pure returns (bytes32){
        return keccak256(h);
    }
    
    function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) public pure returns (bool) {
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
        return computedHash == root;
    }
}