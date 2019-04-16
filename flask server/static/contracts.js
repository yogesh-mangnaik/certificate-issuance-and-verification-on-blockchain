var verificationContractAddress = '0x61227b30e26ce517177e09e58f1ef2f41dedef3d';
var publishingContractAddress   = '0xeb929f56d825e18ec1f32f4924ba06a7dc42263f';

var verificationContractAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "myid",
				"type": "bytes32"
			},
			{
				"name": "result",
				"type": "string"
			}
		],
		"name": "__callback",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "myid",
				"type": "bytes32"
			},
			{
				"name": "result",
				"type": "string"
			},
			{
				"name": "proof",
				"type": "bytes"
			}
		],
		"name": "__callback",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "addMoney",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "merklepath",
				"type": "bytes32[]"
			},
			{
				"name": "hash",
				"type": "string"
			},
			{
				"name": "year",
				"type": "uint256"
			},
			{
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "verify",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "contractAddress",
				"type": "address"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "description",
				"type": "string"
			}
		],
		"name": "LogNewOraclizeQuery",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "requestID",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "verificationStatus",
				"type": "bool"
			}
		],
		"name": "VerificationResult",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "requestID",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "requestedHash",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "requestSender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "timeStamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "status",
				"type": "bool"
			}
		],
		"name": "VerificationRequest",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "calculatedHash",
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
		"name": "certificatesRootContract",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lastid",
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
		"inputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "previousRequests",
		"outputs": [
			{
				"name": "",
				"type": "bool"
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
	},
	{
		"constant": true,
		"inputs": [],
		"name": "verify1",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

var publishingContractAbi = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "certificateRoots",
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
		"inputs": [
			{
				"name": "year",
				"type": "uint256"
			}
		],
		"name": "getRoot",
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
		"constant": false,
		"inputs": [
			{
				"name": "root",
				"type": "bytes32"
			},
			{
				"name": "year",
				"type": "uint256"
			}
		],
		"name": "publish",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "root",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "year",
				"type": "uint256"
			}
		],
		"name": "PublishStatus",
		"type": "event"
	}
];