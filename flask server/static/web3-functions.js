if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var contractInstance = web3.eth.contract([
{
	"constant": false,
	"inputs": [
	{
		"name": "year",
		"type": "uint256"
	},
	{
		"name": "root",
		"type": "bytes32"
	}
	],
	"name": "publish",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
},
{
	"inputs": [
	{
		"name": "token",
		"type": "address"
	}
	],
	"payable": true,
	"stateMutability": "payable",
	"type": "constructor"
},
{
	"constant": true,
	"inputs": [
	{
		"name": "",
		"type": "uint256"
	}
	],
	"name": "certificates",
	"outputs": [
	{
		"name": "",
		"type": "bytes32"
	}
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
},
{
	"constant": true,
	"inputs": [],
	"name": "tokenContract",
	"outputs": [
	{
		"name": "",
		"type": "address"
	}
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}
]);
var contract = contractInstance.at('0x9a7823239aac0191c6f46aea2cc871ae984ea40e');

function publishHash(hash, year){
	console.log("Publishing Hash");
	contract.publish(year, hash,function(error, result){
		if(!error){
			console.log(result);
		}
		else{
			console.log(error);
		}
	});
}