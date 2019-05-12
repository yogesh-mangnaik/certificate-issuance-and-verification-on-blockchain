pragma solidity >=0.4.22 <0.6.0;

import "./MyToken.sol";
import "./CertificatePublishing.sol";
import "github.com/oraclize/ethereum-api/oraclizeAPI_0.4.25.sol";

contract Certificates is usingOraclize {
    
    //test variablespip3 int
    bytes32 public lastid;
    bytes32 public calculatedHash;
    uint256 public verify1 = 0;
    
    //mapping (uint256 => bytes32) public certificates;
    mapping (bytes32 => bytes32[]) requestPath;
    mapping (bytes32 => uint256) requestYear;
    mapping (bytes32 => bytes32) requestKey;
    mapping (bytes32 => bool) public previousRequests;
    mapping (bytes32 => bool) public validRequests;
    
    address owner;
    CertificatePublishing public certificatesRootContract;
    MyToken public tokenContract;
    
    event LogNewOraclizeQuery(string description);
    event VerificationResult(bytes32 requestID, bool verificationStatus);
    event VerificationRequest(bytes32 requestID, string requestedHash, address requestSender, uint256 timeStamp, bool status);
    event GetRequestStatus(bytes32 requestID, bool status, uint256 timestamp);
    
    mapping (bytes32 => uint) requestState;
    uint state = 0;
    
    /*To be used to set accessiblity of function so that
      only the deployer of the contract can call it*/
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    constructor(CertificatePublishing contractAddress, MyToken tokenAddress) public payable{
        owner = msg.sender;
        certificatesRootContract = contractAddress;
        tokenContract = tokenAddress;
        //tokenContract = token;
    }
    
    function getStatus(bytes32 requestId, uint256 timestamp) public returns(bool){
        if(previousRequests[requestId]){
            emit GetRequestStatus(requestId, true, timestamp);
        }
        else{
            emit GetRequestStatus(requestId, false, timestamp);
        }
    }
    
    function verify(bytes32[] memory merklepath, string hash, uint256 year, uint256 timestamp) public returns (bytes32){
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
            emit VerificationRequest(0x0, hash, msg.sender, timestamp, false);
        }
        else {
            require(tokenContract.balanceOf(msg.sender) >= 30 * 10**uint256(18));
            tokenContract.acceptFee(msg.sender, 30);
            emit LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
            string memory url = strConcat("json(http://35.244.31.45:8192/query?hash=", hash,").value");
            bytes32 id = oraclize_query("URL", url);
            lastid = id;
            requestYear[id] = year;
            bytes32 key = keccak256(hash);
            validRequests[key] = true;
            requestKey[id] = key;
            requestState[id] = state;
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
        validRequests[requestKey[myid]] = false;
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