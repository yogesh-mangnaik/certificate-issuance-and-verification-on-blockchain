if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var requestID;

var publishingContractInstance = web3.eth.contract(publishingContractAbi);
var publishingContract = publishingContractInstance.at(publishingContractAddress);

var verificationContractInstance = web3.eth.contract(verificationContractAbi);
var verificationContract = verificationContractInstance.at(verificationContractAddress);

function publishHash(hash, year, callback){
	console.log("Publishing Hash");
	publishingContract.publish(hash, year, callback);
}

function verifyCertificate(merklePath, hash, year, callback, resultCallback, requestCallback){
	console.log("Verifying");
	verificationContract.verify(merklePath, hash, year, callback);
	console.log(requestID);
	var verificationEvent = verificationContract.VerificationResult({}, {fromBlock: 0, toBlock: 'latest'});
	verificationEvent.watch(function(error, result){
		if(!error){
			var returnID = result.args['requestID'];
			if(returnID == requestID){
				console.log("Verification Status : ".concat(result.args['verificationStatus']));
			}
			resultCallback();
		}
		else{
			console.log("Error Occured");
		}
	});
	var veriEvent = verificationContract.VerificationRequest({}, {fromBlock: 0, toBlock: 'latest'});
	veriEvent.watch(function(error, result){
		if(!error){
			requestID = result.args['requestID'];
			var requestedHash = result.args['requestedHash'];
			var requestSender = result.args['requestSender'];
			if(web3.eth.accounts[0] == requestSender && requestedHash == hash){
				console.log("Obtained request ID : ".concat(requestID));
			}
			requestCallback();
		}
	});
}