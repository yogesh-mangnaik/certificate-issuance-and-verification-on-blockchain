pragma solidity >=0.4.22 <0.6.0;

import "./MyToken.sol";
import "github.com/oraclize/ethereum-api/oraclizeAPI_0.4.25.sol";

contract X is usingOraclize {
    
    //test variables
    bytes32 public lastid;
    bytes32[] public savedPath;
    uint256 public reqyear;
    bytes32 public savedRoot;
    bytes32 public calculatedHash;
    uint256 public length;
    uint256 public verify1 = 0;
    
    mapping (uint256 => bytes32) public certificates;
    mapping (bytes32 => bytes32[]) public requestPath;
    mapping (bytes32 => uint256) public requestYear;
    mapping (bytes32 => bytes32) public requestHash;
    
    address owner;
    MyToken public tokenContract;
    uint256 verificationFee = 30;
    uint decimals = 18;
    
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
    
    function verify(bytes32[] memory merklepath, string hash, uint256 year) public returns (bytes32){
        if (oraclize_getPrice("URL") > address(this).balance) {
           emit LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            //oraclize_setCustomGasPrice(400000000000000);
            emit LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
            string memory url = strConcat("json(http://0581a2b4.ngrok.io/query?hash=", hash, ").value");
            bytes32 id = oraclize_query("URL", url);
            lastid = id;
            requestYear[id] = year;
            requestHash[id] = certificates[year];
            for(uint256 i=0; i<merklepath.length; i++){
                requestPath[id].push(merklepath[i]);
            }
            return id;
        }
    }
    
    //callback function - called when oraclize query returns with some data
    function __callback(bytes32 myid, string result) public{
        /*if (msg.sender != oraclize_cbAddress())
            revert();*/
        bytes32 hash = keccak256(result);
        calculatedHash = hash;
        /*for(uint256 i=0; i<1; i++){
            savedPath.push(requestPath[myid][i]);
        }*/
        length = requestPath[myid].length;
        //savedPath = requestPath[myid];
        savedRoot = requestHash[myid];
        reqyear = requestYear[myid];
        if(verify(requestPath[myid], certificates[reqyear], calculatedHash)){
            verify1 = 1;
        }
        else{
            verify1 = 2;
        }
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