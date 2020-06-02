import os
lfiles = os.listdir('./Parts')
fichier = None

classeActu = ''
first = True
for file in lfiles:
    classe = file.split('-')[0]
    if classe != classeActu:
        classeActu = classe
        if not first:
            contenu += ']}'
            print(contenu)
            fichier.write(contenu)
            fichier.close()
        first = False
        fichier = open('./ShapePartsNames/' + classe + '.json', "w")
        contenu = '{"shapenames":['
    nomFile = file.split('.')[0]
    contenu += '"' + nomFile + '", '
fichier.close()