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
	def writeToFile(self, filename, data):
		file = open(filename, "w")
		file.write(data)
		file.close()

	