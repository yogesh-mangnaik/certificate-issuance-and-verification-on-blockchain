import hashlib
from web3 import Web3
from collections import deque
import time

class TreeNode(object):
	def __init__(self, left, right, level, value):
		self.left = left
		self.right = right
		self.level = level
		self.value = value
		self.nodehash = None
		self.merklePath = []

	def __str__(self):
		return "Level : " + str(self.level) + " | Value : " + str(Web3.toHex(self.value)) + " | Merkle path : \n" + str(self.merklePath)

class MerkleTree(object):
	def __init__(self):
		self.nodeQueue = deque()
		self.nodeList = []
		self.root = None

	def getMerklePath(self, index):
		if (index < len(self.nodeList)):
			return self.nodeList[index].merklePath

	def getMerkleRoot(self):
		return self.root

	def getLeafNode(self, index):
		if(index < len(self.nodeList)):
			return self.nodeList[index]

	def getLeafHash(self, index):
		if(index < len(self.nodeList)):
			return self.nodeList[index].nodehash

	def getEncryptedLeafHash(self, index):
		if(index < len(self.nodeList)):
			return self.nodeList[index].value

	def printTree(self, node):
		if(node.left == None and node.right == None):
			print("Leaf : " + "Level : " + str(node.level) + " | Value : " + str(Web3.toHex(node.value)))
			return
		print("Level : " + str(node.level) + " | Value : " + str(Web3.toHex(node.value)))
		self.printTree(node.left)
		self.printTree(node.right)
		return "Hello"

	def add(self,certificate):
		certhash = self.getHash(certificate)
		encryptedCertHash = self.getEncryptedHash(certhash)
		tempNode = TreeNode(None, None, 0, encryptedCertHash)
		tempNode.nodehash = certhash
		self.nodeList.append(tempNode)
		self.nodeQueue.appendleft(tempNode)

	def createTree(self):
		while (len(self.nodeQueue) != 1):
			a = self.nodeQueue.pop()
			b = self.nodeQueue.pop()
			if(a.level == b.level):
				c = TreeNode(a, b, a.level+1, self.getConcatHash(a.value, b.value))
				self.updatePath(a, b.value)
				self.updatePath(b, a.value)
				self.nodeQueue.appendleft(c)
			else:
				self.nodeQueue.append(b)
				tempNode = TreeNode(None, None, a.level, a.value)
				self.updatePath(a, a.value)
				c = TreeNode(a, tempNode, a.level+1, self.getConcatHash(a.value, a.value))
				self.nodeQueue.appendleft(c)

		self.root = self.nodeQueue.pop()
		return self.root

	# Function for updating the merkle path of the leaf nodes
	# whenever a intermediate node is formed
	def updatePath(self, node, merkleValue):
		if(node.left == None and node.right == None):
			node.merklePath.append(merkleValue)
			return
		else:
			self.updatePath(node.left, merkleValue)
			self.updatePath(node.right, merkleValue)

	#Returns the keccak256 hash of the two bytes32 provided to you
	#input : two hashes
	#output : hash of the two input with abi packed encoding
	def getConcatHash(self,a, b):
		if(a < b):
			return Web3.soliditySha3(['bytes32', 'bytes32'], [a,b])

		return Web3.soliditySha3(['bytes32', 'bytes32'], [b,a])

	#Returns the keccak256 hash of the certificate json
	#input : Json of Certificate
	def getHash(self, certificate):
		return Web3.soliditySha3(['string'], [certificate])

	def getEncryptedHash(self, certificateHash):
		privateKey = "0x0bc9b5bf5d3a57829de9c2cc9d82ff3a21b0c6be4f33d9ac19a1807a6f8ef189"
		encr = Web3.toHex(Web3.soliditySha3(['bytes32', 'bytes32'], [certificateHash, privateKey]))
		encryptedHash = Web3.soliditySha3(['string'], [encr])
		return encryptedHash