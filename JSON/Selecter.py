import os
lfiles = os.listdir('./Parts')
gs = os.listdir('./GoldStandard')

label = open('./labels.json', "w")
contenulabel = '{"labels":['

classeActu = ''
first = True

for file in lfiles:
    if file not in gs:
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

fichier = open('./ShapePartsNames/gold_standard.json', "w")
contenu = '{"shapenames":['
for file in gs:
    nomFile = file.split('.')[0]
    contenu += '"' + nomFile + '",'
contenu += ']}'
fichier.write(contenu)

contenulabel += '"gold_standard"]}'
label.write(contenulabel) 

fichier.close()
label.close()
