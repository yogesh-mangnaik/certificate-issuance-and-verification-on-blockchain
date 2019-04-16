ECHO OFF
start python "flask server/app.py"
start ngrok.exe http 80