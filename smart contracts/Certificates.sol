pragma solidity >=0.4.22 <0.6.0;

import "./MyToken.sol";
import "./CertificatePublishing.sol";
import "github.com/oraclize/ethereum-api/oraclizeAPI_0.4.25.sol";

contract Certificates is usingOraclize {
    
    //test variables
    bytes32 public lastid;
    bytes32 public calculatedHash;
    uint256 public verify1 = 0;
    
    //mapping (uint256 => bytes32) public certificates;
    mapping (bytes32 => bytes32[]) requestPath;
    mapping (bytes32 => uint256) requestYear;
    mapping (bytes32 => bool) public previousRequests;
    
    address owner;
    CertificatePublishing public certificatesRootContract;
    MyToken public tokenContract;
    
    event LogNewOraclizeQuery(string description);
    event VerificationResult(bytes32 requestID, bool verificationStatus);
    event VerificationRequest(bytes32 requestID, string requestedHash, address requestSender, uint256 timeStamp, bool status);
    
    /*To be used to set accessiblity of function so that
      only the deployer of the contract can call it*/
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    constructor(CertificatePublishing contractAddress) public payable{
        owner = msg.sender;
        certificatesRootContract = contractAddress;
        //tokenContract = token;
    }
    
    function verify(bytes32[] memory merklepath, string hash, uint256 year, uint256 timestamp) public returns (bytes32){
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
            emit VerificationRequest(0x0, "", msg.sender, timestamp, false);
            
        } else {
            emit LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
            string memory url = strConcat("json(http://0343e691.ngrok.io/query?hash=", hash, ").value");
            bytes32 id = oraclize_query("URL", url);
            lastid = id;
            requestYear[id] = year;
            for(uint256 i=0; i<merklepath.length; i++){
                requestPath[id].push(merklepath[i]);
            }
            emit VerificationRequest(id, hash, msg.sender, timestamp, true);
            return id;
        }
    }
    
    function addMoney() public payable{
        
    }
    
    //callback function - called when oraclize query returns with some data
    function __callback(bytes32 myid, string result) public{
        if (msg.sender != oraclize_cbAddress())
            revert();
        bytes32 hash = keccak256(result);
        calculatedHash = hash;
        uint256 reqyear = requestYear[myid];
        if(verify(requestPath[myid], certificatesRootContract.getRoot(reqyear), calculatedHash)){
            verify1 = 1;
            emit VerificationResult(myid, true);
            previousRequests[myid] = true;
        }
        else{
            verify1 = 2;
            emit VerificationResult(myid, false);
            previousRequests[myid] = false;
        }
    }
    
    /*Verifies if provided leaf and merkle path are valid with respect to provided root*/
    function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
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