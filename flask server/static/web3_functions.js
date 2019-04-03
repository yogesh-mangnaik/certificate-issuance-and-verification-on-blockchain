if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
	alert("Injected Web3");
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
var contract = contractInstance.at('0xceba2a05789e75d3f53098b777fea6ee7daa2982');

function publishHash(){

}