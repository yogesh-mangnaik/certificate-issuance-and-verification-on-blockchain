if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var requestID;
var timestampHash;

var publishingContractInstance = web3.eth.contract(publishingContractAbi);
var publishingContract = publishingContractInstance.at(publishingContractAddress);

var verificationContractInstance = web3.eth.contract(verificationContractAbi);
var verificationContract = verificationContractInstance.at(verificationContractAddress);

function publishRoot(hash, year, callback){
	console.log("Publishing Hash : " + hash);
	publishingContract.publish(hash, year, function(error, result){
		if(!error){

		}
	});
	var publishingEvent = publishingContract.PublishStatus({}, {fromBlock: 0, toBlock: 'latest'});
	publishingEvent.watch(function(error, result){
		if(!error){
			var roothash = result.args['root'];
			var rootyear = result.args['year'];
			console.log(year);
			console.log(rootyear);
			if(roothash == hash && rootyear == year){
				console.log("Successfully Published : " + roothash);
				callback(true, result);
			}
		}
		else
		{
			callback(false, error);
		}
	});
}

function verifyCertificate(merklePath, hash, year, timestamp, resultCallback, requestCallback){
	console.log("Verifying");
	timestampHash = timestamp;
	verificationContract.verify(merklePath, hash, year, timestamp, function(error, result){
		if(!error){
			console.log(result);
		}
		else{
			console.log(error);
		}
	});
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
			var status = result.args['status'];
			if(status){
				requestID = result.args['requestID'];
				var requestedHash = result.args['requestedHash'];
				var requestSender = result.args['requestSender'];
				var tsh = result.args['timeStamp'];
				if(web3.eth.accounts[0] == requestSender && requestedHash == hash && timestampHash == tsh){
					console.log("Obtained request ID : ".concat(requestID));
				}
				requestCallback(true);
			}
			else{
				requestCallback(false);
			}			
		}
		else{
			requestCallback(false);
		}
	});
}