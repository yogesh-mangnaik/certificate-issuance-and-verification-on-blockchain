var verificationContractAddress = '0xe0b624170ec7417e6bd2cdadd27c0cc7d42e24b1';
var publishingContractAddress   = '0x86767aa19a450ad81713738efccecf9a09d496d1';

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
				"name": "requestId",
				"type": "bytes32"
			},
			{
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "getStatus",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
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
			},
			{
				"name": "tokenAddress",
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
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "requestID",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "status",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "GetRequestStatus",
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
		"inputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "validRequests",
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