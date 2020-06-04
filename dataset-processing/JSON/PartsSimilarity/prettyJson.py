import os
import json

lfiles = os.listdir()
fichier = None

for file in lfiles:
    if file.split('.')[-1] != "py":
        with open(file,"r") as json_file:
            print(file)
            data = json.load(json_file)
            json_file.close()
            with open(file,"w") as json_file:
                json_file.write(json.dumps(data, indent=4, sort_keys=True))
                json_file.close()