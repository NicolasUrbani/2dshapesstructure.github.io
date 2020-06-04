import os
lfiles = os.listdir('./Parts')

label = open('./labels.json', "w")
contenulabel = '{"labels":['

classeActu = ''
first = True

for file in lfiles:
    tab = file.split('-')
    if len(tab) == 1:
        classe = 'image'
    else:
        classe = tab[0]
    if classe != classeActu:
        classeActu = classe
        if not first:
            contenu += ']}'
            fichier.write(contenu)
            fichier.close()
        first = False
        fichier = open('./ShapePartsNames/' + classe + '.json', "w")
        contenu = '{"shapenames":['
        contenulabel += '"' + classe + '" ,'
    nomFile = file.split('.')[0]
    contenu += '"' + nomFile + '", '
    
contenulabel += ']}'
label.write(contenulabel) 

fichier.close()
label.close()