from flask import Flask, render_template
from flask import request
import hashlib
import json
import csv
import pandas as pd
import os
from werkzeug import secure_filename
from web3 import Web3

from merkle_tree import MerkleTree
class Utils(object):

	@classmethod
	def writeToFile(self, year, filename, data):
		savePath = '/home/yogeshmangnaik2012/Certificate_Issuance_And_Verification_On_Blockchain/certificates/'
		directory = savePath + str(year)
		if not os.path.exists(directory):
			os.makedirs(directory)
		filepath = directory + '/' + str(filename)
		file = open(filepath, "w")
		file.write(data)
		file.close()

	