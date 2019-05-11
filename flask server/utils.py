import shutil
import os
import platform

class Utils(object):

	savePath = ""

	@classmethod
	def initialize(self):
		sys = platform.system()
		print(sys)
		if(sys == "Linux"):
			Utils.savePath = '/home/yogeshmangnaik2012/Test_Server/Certificate_Issuance_And_Verification_On_Blockchain/certificates/'
		if sys == 'Windows':
			Utils.savePath = 'C:/Users/yoges/Desktop/Final Year Project/Certificate_Issuance_And_Verification_On_Blockchain/certificates/'

	@classmethod
	def writeToFile(self, year, filename, data):
		directory = Utils.savePath + str(year)
		if not os.path.exists(directory):
			os.makedirs(directory)
		filepath = directory + '/' + str(filename)
		file = open(filepath, "w")
		file.write(data)
		file.close()

	@classmethod
	def createZip(self, path):
		shutil.make_archive(Utils.savePath + path, 'zip', Utils.savePath + path)
		shutil.rmtree(Utils.savePath+path)
		return path+".zip"

	