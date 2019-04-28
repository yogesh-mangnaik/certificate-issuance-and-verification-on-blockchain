if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var requestID = "0xd52dc16d4c7a97639a130ce768e95de0ebea033d1bf5d0d19482a708a29dbfa1";
var timestampHash;

var publishingContractInstance = web3.eth.contract(publishingContractAbi);
var publishingContract = publishingContractInstance.at(publishingContractAddress);

var verificationContractInstance = web3.eth.contract(verificationContractAbi);
var verificationContract = verificationContractInstance.at(verificationContractAddress);

var x = 0;

function publishRoot(hash, year, txhashcallback, callback){
	// console.log("Publishing Hash"); //TESTING CODE
	// setTimeout(function() {
	// 	callback(true,"Testing");
	// },5000);
	// return ;
	try{
	publishingContract.publish(hash, year, function(error, result){
		if(!error){
			console.log("Successfully");
			txhashcallback(result);
		}
	});
	}
	catch(exception){
		callback(false,exception);
		return;
	}
	var publishingEvent = publishingContract.PublishStatus({}, {fromBlock: 0, toBlock: 'latest'});
	publishingEvent.watch(function(error, result){
		if(!error){
			var roothash = result.args['root'];
			var rootyear = result.args['year'];
			if(roothash == hash && rootyear == year){
				console.log(roothash);
				console.log(result);
				callback(true, roothash);
			}
		}
		else
		{
			callback(false, error);
		}
	})
}

function verifyCertificate(merklePath, hash, year, timestamp,callback, requestCallback, resultCallback){
	timestampHash = timestamp;
	verificationContract.verify(merklePath, hash, year, timestamp, function(error, result){
		if(!error){
			callback(result);
		}
		else{
			console.log(error);
		}
	});
	console.log(requestID);
	
	var veriEvent = verificationContract.VerificationRequest({}, {fromBlock: 0, toBlock: 'latest'});
	veriEvent.watch(function(error, result){
		if(!error){
			var status = result.args['status'];
			var requestedHash = result.args['requestedHash'];
			var requestSender = result.args['requestSender'];
			var tsh = result.args['timeStamp'].c[0];
			if(web3.eth.accounts[0] == requestSender && requestedHash == hash && tsh == timestamp)
			{
				if(status)
				{
					requestID = result.args['requestID'];
					console.log(tsh);
					console.log(timestamp);
					console.log("Obtained request ID : ".concat(requestID));	
					requestCallback(requestID);	
				}
				else{
					requestCallback("Request to Oracle out of Gas");
				}	
			}		
		}
		else{
			requestCallback("Oracle error");
		}
	});
	var verificationEvent = verificationContract.VerificationResult({}, {fromBlock: 0, toBlock: 'latest'});
	verificationEvent.watch(function(error, result){
		if(!error){
			console.log("Result obtained");
			var returnID = result.args['requestID'];
			if(returnID == requestID){
				console.log("Verification Status : ".concat(result.args['verificationStatus']));
				resultCallback(result.args['verificationStatus']);	
			}
		}
		else{
			console.log("Error Occured");
		}
	});
}

function getRequestStatus(requestID, callback){
	console.log(requestID);
	var x = verificationContract.previousRequests.call(requestID, function(error ,result){
		if(!error){
			callback(result);
		}
	});
}

function getPublishedRoot(year, callback){
	console.log("Requested root of year : " + year);
	var x = publishingContract.certificateRoots(year, function(error, result){
		if(!error){
			console.log(year + " : " + result);
			callback(year, result);
		}
		else{
			console.log("Error occured while getting root of year : " + year);
		}
	})
}

var set = new Map();
function getPreviousRequests(callback){
	var verificationStatusEvent = verificationContract.VerificationResult({}, {fromBlock: 0, toBlock: 'latest'});
	verificationStatusEvent.watch(function(error, result){
		if(!error){
			var x = result.args['requestID'];
			var y = String(x);
			var a = result.args['verificationStatus'];
			var b = String(a);
			if(!set.has(y)){
				set.set(y, b);
				console.log(y);
				console.log(b);
				callback(y,b);
				//console.log(typeof result.args['request']);
				//console.log(result.args['verificationStatus']);
				//console.log(set.size());
			}
		}
	});
}