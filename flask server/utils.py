

class Utils(object):

	@classmethod
	def writeToFile(self, filename, data):
		file = open(filename, "w")
		file.write(data)
		file.close()
