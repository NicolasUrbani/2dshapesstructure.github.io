
function computeAffinityMatrix(idSelection) {

    jsonData = getJSON("JSON/userStudyForMatrices.json")
    .then((jsonData) => {
    var aux = eval('('+jsonData+')');
     var parts = aux.parts;
     const index = getAllIndexes(parts.idSelection,function (id) {return id==1});
     if (index.length > 0) {
         var partsId = getAllIndexes(parts.idSelection, function(id){return id===idSelection});
         var n = partsId.length;
        var annot_shape = [];
        for(let ind_part = 0; ind_part < n; ind_part++) {
            var indices = getAllIndexes(aux.partsannotation.idPart1, function(id) {return id==partsId(ind_part)});

        }

     }
 
    });
 
 }
 
 //Promise for accessing JSON files
 var getJSON = function (file, resolve) {
     var request = new XMLHttpRequest();
     request.open("GET",file,false);
     return new Promise(function (resolve) {
         request.onload = () => resolve(request.responseText);
         request.send(null);
     });
 };
 
 function debug() {
     computeAffinityMatrix(1);
 } 
 
 function getAllIndexes(arr, cmp) {
     var indices = [];
     for(var i=0; i<arr.length;i++) {
         if (cmp(arr[i])) indices.push(i);
     }
     return indices;
 }

 function getIndArray(arr, indices) {
     var res = [];
     for(let i = 0; i < indices.length; i++) {
         res.push(arr[indices[i]]);
     }
     return res;
 }