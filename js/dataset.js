var labels;

var nbCanvas;

var selectedLabel;
var shapenames;

var currentShapeInfo;
var currentPartsInfo;
var PartsInfo;

var annotations;

var majority;
var modes;
var nbSpectralCanvas;

var spectralColors = ['cornflowerblue','orange','beige','indigo'];

var popoverDisplayed;

var ShapeDisplayed;
var shapeName;
var numPartold;
var numPartClicked;

var similarities;
var intershape;
var classement;

var shapeIntername;
var partIntername;

var seeOtherclicked;

var affMatSymCont;
var affMatSymNoCont;
var affMatNoSymCont;
var affMatNoSymNoCont;

var dispMatSymCont;
var dispMatSymNoCont;
var dispMatNoSymCont;
var dispMatNoSymNoCont;

var nCol;
var numCol = -1;

function doLoad() {
	
	hideElement('sidePanel');
	hideElement('slider');
	// Show the popover to help users
	$('#labelswrapper').popover('show');
	
	numPartold = -1;
	
	nbCanvas = 0;
	nbSpectralCanvas = 0;
	popoverDisplayed = false;
	dispMatSymCont = false;
	dispMatSymNoCont = false;
	dispMatNoSymCont = false;
	dispMatNoSymNoCont= false;

	// Fetch the different classes of the dataset
	var xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/labels.json",false);
	xhr_object.onreadystatechange  = function() { 
	     if(xhr_object.readyState  == 4) {
				// Les données de suivi sont stockées dans la variable 
				var aux = eval('('+xhr_object.responseText+')');
				labels = aux.labels;

				var container = document.getElementById("labelscontainer");
				var container2 = document.getElementById("labelscontainer2");


				// Create a button for each category						
				for (var k=0;k<labels.length;k++) {
					var auxButton = document.createElement('button');
					var auxTextNode = document.createTextNode(labels[k]);
					auxButton.setAttribute('id',labels[k]+'Button');
					auxButton.setAttribute('class','btn btn-default');
					auxButton.setAttribute('type','button');
					auxButton.addEventListener('click',handleClickCategory,'false');
					auxButton.appendChild(auxTextNode);
					if (k<22) {
						container.appendChild(auxButton);
					} else {
						container2.appendChild(auxButton);
					}
				}
				
	     }
	}; 
	xhr_object.send(null);

	var backButton = document.getElementById('BackButton');
	backButton.addEventListener('click',backToShapeCategory,false);
	
	// Create canvas for affinity matrices vote
	var matricesCanvasContainer = document.getElementById("matricescanvascontainer");
	
	seeOtherclicked = false;
	
	var auxCanvas = document.createElement('canvas');
	auxCanvas.setAttribute('id','colorbar');
	auxCanvas.setAttribute('width',canSize);
	auxCanvas.setAttribute('height',canSize/5);
	matricesCanvasContainer.appendChild(auxCanvas);
	
	var auxCanvas = document.createElement('canvas');
	auxCanvas.setAttribute('id','Symmetrical');
	auxCanvas.setAttribute('width',canSize);
	auxCanvas.setAttribute('height',canSize/5);
	matricesCanvasContainer.appendChild(auxCanvas);
	
	var auxCanvas = document.createElement('canvas');
	auxCanvas.setAttribute('id','ContextTitle');
	auxCanvas.setAttribute('width',canSize);
	auxCanvas.setAttribute('height',canSize/10);
	matricesCanvasContainer.appendChild(auxCanvas);
	
	var auxCanvas = document.createElement('canvas');
	auxCanvas.setAttribute('id','contextmatrixCanvas');
	auxCanvas.setAttribute('width',canSize);
	auxCanvas.setAttribute('height',canSize);
	matricesCanvasContainer.appendChild(auxCanvas);
	var ctx = auxCanvas.getContext("2d");
	
	var auxCanvas = document.createElement('canvas');
	auxCanvas.setAttribute('id','NoContextTitle');
	auxCanvas.setAttribute('width',canSize);
	auxCanvas.setAttribute('height',canSize/10);
	matricesCanvasContainer.appendChild(auxCanvas);
	  
	var aux2Canvas = document.createElement('canvas');
	aux2Canvas.setAttribute('id','nocontextmatrixCanvas');
	aux2Canvas.setAttribute('width',canSize);
	aux2Canvas.setAttribute('height',canSize);
	matricesCanvasContainer.appendChild(aux2Canvas);
	var ctx2 = aux2Canvas.getContext("2d");
	
	var auxCanvas = document.createElement('canvas');
	auxCanvas.setAttribute('id','NonSymmetrical');
	auxCanvas.setAttribute('width',canSize);
	auxCanvas.setAttribute('height',canSize/5);
	matricesCanvasContainer.appendChild(auxCanvas);
	
	var auxCanvas = document.createElement('canvas');
	auxCanvas.setAttribute('id','ContextTitlenosym');
	auxCanvas.setAttribute('width',canSize);
	auxCanvas.setAttribute('height',canSize/10);
	matricesCanvasContainer.appendChild(auxCanvas);
	
	var auxCanvas = document.createElement('canvas');
	auxCanvas.setAttribute('id','contextmatrixCanvasnosym');
	auxCanvas.setAttribute('width',canSize);
	auxCanvas.setAttribute('height',canSize);
	matricesCanvasContainer.appendChild(auxCanvas);
	var ctx = auxCanvas.getContext("2d");
	
	var auxCanvas = document.createElement('canvas');
	auxCanvas.setAttribute('id','NoContextTitlenosym');
	auxCanvas.setAttribute('width',canSize);
	auxCanvas.setAttribute('height',canSize/10);
	matricesCanvasContainer.appendChild(auxCanvas);
	  
	var aux2Canvas = document.createElement('canvas');
	aux2Canvas.setAttribute('id','nocontextmatrixCanvasnosym');
	aux2Canvas.setAttribute('width',canSize);
	aux2Canvas.setAttribute('height',canSize);
	matricesCanvasContainer.appendChild(aux2Canvas);
	var ctx2 = aux2Canvas.getContext("2d");
	
	
	var divlink = document.createElement("div");
	matricesCanvasContainer.appendChild(divlink);
	var linka = document.createElement('a');
	linka.setAttribute('href', 'https://deepai.org/machine-learning-glossary-and-terms/affinity-matrix');
	linka.innerHTML='more about Affinity Matrix';
	divlink.appendChild(linka);

	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/ranking.json",false);
	xhr_object.onreadystatechange  = function() { 
		if(xhr_object.readyState  == 4) {
			
			classement = eval('('+xhr_object.responseText+')');
			
		}
	}; 
	xhr_object.send(null);
} 

function handleClickCategory(e) {

	// Hiding the side panel in case it was displayed
	hideElement('sidePanel');
	hideElement('slider');
	
	// Hide the popover to help users
	$('#labelswrapper').popover('hide');
	
	seeOtherclicked = false;
	var slider = document.getElementById("percentageslider");
	slider.oninput = function() {
	}
	
	var aux; 
	if (e.srcElement == null) {
		aux = e.target.id;
	} else {
		aux = e.srcElement.id; 
	}	


	
	selectedLabel = aux.split('Button')[0];


	// Fetch the shapes name of these selected Label
	var xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/ShapePartsNames/"+selectedLabel+".json",false);
	shapenames = null;
	xhr_object.onreadystatechange  = function() { 
	     if(xhr_object.readyState  == 4) {

				var aux = eval('('+xhr_object.responseText+')');
				shapenames = aux.shapenames;
				
	     }
	}; 
	xhr_object.send(null);

	displayShapeCategory();
}

function displayShapeCategory() {
	
	var currentdisplay = document.getElementById('currentdisplay');
	currentdisplay.innerHTML = selectedLabel;
	
	var canvasContainer = document.getElementById("canvascontainer");

	if (document.getElementById("maincanva")!=null){document.getElementById("maincanva").remove();}
	if (document.getElementById("legendcanva")!=null){document.getElementById("legendcanva").remove();}
	if (document.getElementById("legcontcanva")!=null){document.getElementById("legcontcanva").remove();}
	if (document.getElementById("legnocontcanva")!=null){document.getElementById("legnocontcanva").remove();}
	if (document.getElementById("othershapelink")!=null){document.getElementById("othershapelink").remove();}

	// Clear the remaining canvas
	var canDeleted = 0;
	for (var s = 0; s < nbCanvas ; s++) {
		var canToDraw = document.getElementById("canvas" + s);
		var ctxToDraw = canToDraw.getContext('2d');
		ctxToDraw.clearRect(0,0,canSize,canSize);

		canToDraw.removeEventListener('mouseenter',highlightCanvas,false);
		canToDraw.removeEventListener('mouseleave',dehighlightCanvas,false);
		canToDraw.removeEventListener('click',handleShapeClick,false);
		
		canToDraw.style = "cursor: default;";
		canToDraw.remove();
		canDeleted++;
		
	}
	nbCanvas = nbCanvas - canDeleted;

	// Update the number of canvas
	while (nbCanvas < shapenames.length) {
		// Create new canvases to meet the requirements
		var auxCanvas = document.createElement('canvas');
		auxCanvas.setAttribute('id','canvas'+nbCanvas);
		auxCanvas.setAttribute('width',canSize);
		auxCanvas.setAttribute('height',canSize);
		auxCanvas.addEventListener('mouseenter',highlightCanvas,false);
		auxCanvas.addEventListener('mouseleave',dehighlightCanvas,false);
		auxCanvas.addEventListener('click',handleShapeClick,false);
		nbCanvas++;
		canvasContainer.appendChild(auxCanvas);
		var ctx = auxCanvas.getContext("2d");
		// translate context to center of canvas
	   ctx.translate(0, canSize);
	   // flip context vertically
	   ctx.scale(1, -1);
	}
	
	// Draw the shapes on each canvas
	for (var s = 0; s < shapenames.length;s++) {

		xhr_object=new XMLHttpRequest();
		xhr_object.open("GET","JSON/Parts/"+shapenames[s]+".json",false);
		xhr_object.onreadystatechange  = function() { 
			 if(xhr_object.readyState  == 4) {

				var aux = eval('('+xhr_object.responseText+')');

				var nameFile = shapenames[s].slice(0, shapenames[s].lastIndexOf("_"));
				xhr_object2=new XMLHttpRequest();
				xhr_object2.open("GET","JSON/Shapes/"+nameFile+".json",false);
				xhr_object2.onreadystatechange  = function() { 
					if(xhr_object2.readyState  == 4) {

						var aux2 = eval('('+xhr_object2.responseText+')');

						var canToDraw = document.getElementById("canvas" + s);
						var ctxToDraw = canToDraw.getContext('2d');
						drawObjectParts(ctxToDraw,9*canSize/10,1,canSize/20,canSize/20,aux2.points,aux2.triangles,aux.parts);
						//drawFilledObject(ctxToDraw,9*canSize/10,1,canSize/20,canSize/20,aux2.points,aux2.triangles,aux.hierarchy);
					
						
						canToDraw.addEventListener('mouseenter',highlightCanvas,false);
						canToDraw.addEventListener('mouseleave',dehighlightCanvas,false);
						canToDraw.addEventListener('click',handleShapeClick,false);
					}
				};
				xhr_object2.send(null);
			 }
		}; 
		xhr_object.send(null);

	}

	// Clear the remaining canvas
	var canDeleted = 0;
	for (var s = shapenames.length; s < nbCanvas ; s++) {
		var canToDraw = document.getElementById("canvas" + s);
		var ctxToDraw = canToDraw.getContext('2d');
		//console.log(ctxToDraw.canvas.clientHeight);
		ctxToDraw.clearRect(0,0,ctxToDraw.canvas.clientWidth,ctxToDraw.canvas.clientHeight);
		canToDraw.style = "cursor: default;";
		canToDraw.remove();
		canDeleted++;
		
	}
	nbCanvas = nbCanvas - canDeleted;
	
	// Show the popover that tells users to click on a shape
	if (!popoverDisplayed) {
		$('#canvascontainer').popover('show');
	}

}

function highlightCanvas(e) {
	
	var auxId; 
	if (e.srcElement == null) {
		auxId = e.target.id;
	} else {
		auxId = e.srcElement.id; 
	}	

	var idCanvas = parseInt(auxId.split('canvas')[1]);

	if (idCanvas < shapenames.length) {
		var canvas = document.getElementById(auxId);
		var ctx = canvas.getContext('2d');
		ctx.strokeStyle = "green";
		ctx.lineWidth = 5;
		ctx.strokeRect(0,0,canSize,canSize);
		canvas.style = "cursor: pointer;";

		var currentdisplay = document.getElementById('currentdisplay');
		currentdisplay.innerHTML = selectedLabel + " - " + shapenames[idCanvas];
	}
	
}

function dehighlightCanvas(e) {
	
	var auxId; 
	if (e.srcElement == null) {
		auxId = e.target.id;
	} else {
		auxId = e.srcElement.id; 
	}		
	
	var canvas = document.getElementById(auxId);
	var ctx = canvas.getContext('2d');
	ctx.strokeStyle = "white";
	ctx.lineWidth = 6;
	ctx.strokeRect(0,0,canSize,canSize);
	canvas.style = "cursor: default;";

	var currentdisplay = document.getElementById('currentdisplay');
	currentdisplay.innerHTML = selectedLabel;
	
}

function handleShapeClick(e) {
	var auxId; 
	if (e.srcElement == null) {
		auxId = e.target.id;
	} else {
		auxId = e.srcElement.id; 
	}	
	
	var idCanvas = parseInt(auxId.split('canvas')[1]);
	
		

	if (idCanvas < shapenames.length) {

		shapeName = shapenames[idCanvas];

		var slider = document.getElementById("percentageslider");
		slider.oninput = function() {
			displayAffinityMatrices(shapeName);
		}

		displayPartsHighlighted(shapeName);
		
	}

}

function highlightColumn(e) {

	var auxId; 
	if (e.srcElement == null) {
		auxId = e.target.id;
	} else {
		auxId = e.srcElement.id; 
	}		
	
	var canvas = document.getElementById(auxId);

	var rect = canvas.getBoundingClientRect();

	var elemLeft = rect.left;
	var elemTop = rect.top;
	
	var scrolled = window.scrollY;
	var x = e.pageX - elemLeft - window.scrollX;
	var y = canSize - (e.pageY - elemTop) + scrolled;

	var contextMatrixCanvas = document.getElementById("contextmatrixCanvas");
	var nocontextMatrixCanvas = document.getElementById("nocontextmatrixCanvas");
	var contextMatrixCanvasn = document.getElementById("contextmatrixCanvasnosym");
	var nocontextMatrixCanvasn = document.getElementById("nocontextmatrixCanvasnosym");
	
	var mainCanvas = document.getElementById("maincanva");

	var ctxToDrawContext = contextMatrixCanvas.getContext("2d");
	var ctxToDrawNoContext = nocontextMatrixCanvas.getContext("2d");
	var ctxToDrawContextn = contextMatrixCanvasn.getContext("2d");
	var ctxToDrawNoContextn = nocontextMatrixCanvasn.getContext("2d");
	
	var ctxToDrawMain = mainCanvas.getContext("2d");
	
	

	if (x>=canSize/20 && x<= 19*canSize/20 && y>=(canSize/20) && y<=(19*canSize/20)) {
		x = x - canSize/20 ;
		y = y - canSize/20 ;
		var size = 9*canSize/10/nCol;
		var number = Math.floor(x/size);
		if (number != numCol) {

			numCol = number;

			drawAffinityMatrix(ctxToDrawContext,9*canSize/10,2,canSize/20,canSize/20,affMatSymCont,dispMatSymCont);
			drawAffinityMatrix(ctxToDrawNoContext,9*canSize/10,2,canSize/20,canSize/20,affMatSymNoCont,dispMatSymNoCont);
			drawAffinityMatrix(ctxToDrawContextn,9*canSize/10,2,canSize/20,canSize/20,affMatNoSymCont,dispMatNoSymCont);
			drawAffinityMatrix(ctxToDrawNoContextn,9*canSize/10,2,canSize/20,canSize/20,affMatNoSymNoCont,dispMatNoSymNoCont);


			drawHighlightedColumn(ctxToDrawContext,9*canSize/10,2,canSize/20,canSize/20,size,numCol);
			drawHighlightedColumn(ctxToDrawNoContext,9*canSize/10,2,canSize/20,canSize/20,size,numCol);
			drawHighlightedColumn(ctxToDrawContextn,9*canSize/10,2,canSize/20,canSize/20,size,numCol);
			drawHighlightedColumn(ctxToDrawNoContextn,9*canSize/10,2,canSize/20,canSize/20,size,numCol);

			ctxToDrawMain.clearRect(0,0,2*canSize,2*canSize);
			drawObjectParts(ctxToDrawMain,2*9*canSize/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,currentPartsInfo.parts);	
			drawFilledPart(ctxToDrawMain,9*canSize*2/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,currentPartsInfo.parts,currentPartsInfo.hierarchy,numCol+2);
		}		
	}
}

function handleColumnClick(e) {
	if (numCol+2 != 1) {
		displayShapeSimilarities(shapeName,numCol+2);
	}
}

function computeAffinityMatrixSymCont(shape) {

	var sim;
	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/PartsSimilarity/"+ shape +".json",false);
	xhr_object.onreadystatechange  = function() { 
		if(xhr_object.readyState  == 4) {

			var aux = eval('('+xhr_object.responseText+')');
			sim = aux["intrashape"];
		}
	}; 
	xhr_object.send(null);

	var nPart;
	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/Parts/"+ shape +".json",false);
	xhr_object.onreadystatechange  = function() { 
		if(xhr_object.readyState  == 4) {

			var aux = eval('('+xhr_object.responseText+')');
			nPart = numPart(aux.parts);
		}
	}; 
	xhr_object.send(null);

	var slider = document.getElementById("percentageslider");
	var classementLimite = Math.round((1-slider.value/100)*classement["ranking_with"].length);

	// Creation of the affinity matrix
	var nb_sim_mat = [];
	for(var i=0; i<nPart-1; i++) {
		nb_sim_mat[i] = new Array(nPart-1);
	}
	// Filling the diagonal with 1 and the other with 0
	for(var i=0; i<nPart-1; i++) {
		for (var j=i; j<nPart-1; j++) {
			if (j == i) {
				nb_sim_mat[i][j] = 1;
			} else {
				nb_sim_mat[i][j] = 0;
				nb_sim_mat[j][i] = 0;
			}
		}
	}

	// Creation of the matrix containing the number of occasions two parts could be judged similar
	var nb_occ_mat = [];
	for(var i=0; i<nPart-1; i++) {
		nb_occ_mat[i] = new Array(nPart-1);
	}
	// Filling the diagonal with 1 and the other with 0
	for(var i=0; i<nPart-1; i++) {
		for (var j=i; j<nPart-1; j++) {
			if (j == i) {
				nb_occ_mat[i][j] = 1;
			} else {
				nb_occ_mat[i][j] = 0;
				nb_occ_mat[j][i] = 0;
			}
		}
	}

	var parts = Object.keys(sim);
	dispMatSymCont = false;
	// For each part of the shape that has been given to teams
	for(var i=0; i<parts.length; i++) {
		// (a given part A)
		// we get the set of similar parts for each team	
		var parts_sim_i_cont = sim[parts[i]].context;
		var teams = Object.keys(parts_sim_i_cont);
		var id_part_i = parseInt(parts[i],10)-2;
		// and for each team that has judged this part
		for(var t=0; t<teams.length; t++) {
			var team = parseInt(teams[t],10);
			// we check if this team performed well enough on the gold standard to be taken into account
			if (classement["ranking_with"][team] <= classementLimite) {
				dispMatSymCont = true;
				// if that's the case, we get the parts they judged similar to the first one
				var sim_i = parts_sim_i_cont[teams[t]];
				// if there is only one part similar
				if (!Array.isArray(sim_i)) {
					var id_part_j = sim_i-2;
					// we add to the affinity matrix 1 to the numbers of times those parts have been judged similar
					nb_sim_mat[id_part_i][id_part_j]+=1;
					nb_sim_mat[id_part_j][id_part_i]+=1;
					for(var p=0; p<nPart-1; p++){
						// (a given part C)
						if (id_part_j != p && id_part_i != p){							
							nb_occ_mat[p][id_part_j]++;									
							nb_occ_mat[id_part_j][p]++;
						}
					}
				// else if there is more than one part
				} else {
					// for each part 
					for(var j=0; j<sim_i.length; j++) {
						// (a given part B)
						// we add to the affinity matrix 1 to the numbers of times those parts have been judged similar
						var id_part_j = sim_i[j]-2;
						nb_sim_mat[id_part_i][id_part_j]++;
						nb_sim_mat[id_part_j][id_part_i]++;
						// and to compute the implicit similarities, we look at all the other part of the shape
						for(var p=0; p<nPart-1; p++){
							// (a given part C)
							if (id_part_j != p && id_part_i != p){
								// and if one part is also judged similar to the first part, it is similar to the second one too
								// (if B and C are similar to A, they are implicitly judged similar)
								if (sim_i.includes(p+2)) {
									nb_sim_mat[id_part_j][p]++;
									nb_occ_mat[id_part_j][p]++;
								// (if C is not similar to A, B and C are implicitly not judged similar and we increment the numbers of occasions B and C are judged similar)
								} else {
									nb_occ_mat[p][id_part_j]++;									
									nb_occ_mat[id_part_j][p]++;
								}
							}
						}
					}
				}
				// for each part B, we increment the numbers of occasins A and B are judged similar
				for(var j=0; j<nPart-1; j++) {
					if(id_part_i != j) {
						nb_occ_mat[id_part_i][j]++;
						nb_occ_mat[j][id_part_i]++;
					}
				}
			}				
		}
	}

	for(var i=0; i<nPart-1; i++) {
		for (var j=0; j<nPart-1; j++) {
			if (nb_occ_mat[i][j] != 0) {
				nb_sim_mat[i][j] /= nb_occ_mat[i][j];
			}
		}
	}

	affMatSymCont = nb_sim_mat;

}

function computeAffinityMatrixSymNoCont(shape) {

	var sim;
	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/PartsSimilarity/"+ shape +".json",false);
	xhr_object.onreadystatechange  = function() { 
		if(xhr_object.readyState  == 4) {

			var aux = eval('('+xhr_object.responseText+')');
			sim = aux["intrashape"];
		}
	}; 
	xhr_object.send(null);

	var nPart;
	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/Parts/"+ shape +".json",false);
	xhr_object.onreadystatechange  = function() { 
		if(xhr_object.readyState  == 4) {

			var aux = eval('('+xhr_object.responseText+')');
			nPart = numPart(aux.parts);
		}
	}; 
	xhr_object.send(null);

	var slider = document.getElementById("percentageslider");
	var classementLimite = Math.round((1-slider.value/100)*classement["ranking_with"].length);

	// Creation of the affinity matrix
	var nb_sim_mat = [];
	for(var i=0; i<nPart-1; i++) {
		nb_sim_mat[i] = new Array(nPart-1);
	}
	// Filling the diagonal with 1 and the other with 0
	for(var i=0; i<nPart-1; i++) {
		for (var j=i; j<nPart-1; j++) {
			if (j == i) {
				nb_sim_mat[i][j] = 1;
			} else {
				nb_sim_mat[i][j] = 0;
				nb_sim_mat[j][i] = 0;
			}
		}
	}

	// Creation of the matrix containing the number of occasions two parts could be judged similar
	var nb_occ_mat = [];
	for(var i=0; i<nPart-1; i++) {
		nb_occ_mat[i] = new Array(nPart-1);
	}
	// Filling the diagonal with 1 and the other with 0
	for(var i=0; i<nPart-1; i++) {
		for (var j=i; j<nPart-1; j++) {
			if (j == i) {
				nb_occ_mat[i][j] = 1;
			} else {
				nb_occ_mat[i][j] = 0;
				nb_occ_mat[j][i] = 0;
			}
		}
	}

	var parts = Object.keys(sim);
	dispMatSymNoCont = false;

	// For each part of the shape that has been given to teams
	for(var i=0; i<parts.length; i++) {
		// (a given part A)
		// we get the set of similar parts for each team	
		var parts_sim_i_nocont = sim[parts[i]].nocontext;
		var teams = Object.keys(parts_sim_i_nocont);
		var id_part_i = parseInt(parts[i],10)-2;
		// and for each team that has judged this part
		for(var t=0; t<teams.length; t++) {
			var team = parseInt(teams[t],10);
			// we check if this team performed well enough on the gold standard to be taken into account
			if (classement["ranking_with"][team] <= classementLimite) {
				dispMatSymNoCont = true;
				// if that's the case, we get the parts they judged similar to the first one
				var sim_i = parts_sim_i_nocont[teams[t]];
				// if there is only one part similar
				if (!Array.isArray(sim_i)) {
					var id_part_j = sim_i-2;
					// we add to the affinity matrix 1 to the numbers of times those parts have been judged similar
					nb_sim_mat[id_part_i][id_part_j]+=1;
					nb_sim_mat[id_part_j][id_part_i]+=1;
					for(var p=0; p<nPart-1; p++){
						// (a given part C)
						if (id_part_j != p && id_part_i != p){							
							nb_occ_mat[p][id_part_j]++;									
							nb_occ_mat[id_part_j][p]++;
						}
					}
				// else if there is more than one part
				} else {
					// for each part 
					for(var j=0; j<sim_i.length; j++) {
						// (a given part B)
						// we add to the affinity matrix 1 to the numbers of times those parts have been judged similar
						var id_part_j = sim_i[j]-2;
						nb_sim_mat[id_part_i][id_part_j]++;
						nb_sim_mat[id_part_j][id_part_i]++;
						// and to compute the implicit similarities, we look at all the other part of the shape
						for(var p=0; p<nPart-1; p++){
							// (a given part C)
							if (id_part_j != p && id_part_i != p){
								// and if one part is also judged similar to the first part, it is similar to the second one too
								// (if B and C are similar to A, they are implicitly judged similar)
								if (sim_i.includes(p+2)) {
									nb_sim_mat[id_part_j][p]++;
									nb_occ_mat[id_part_j][p]++;
								// (if C is not similar to A, B and C are implicitly not judged similar and we increment the numbers of occasions B and C are judged similar)
								} else {
									nb_occ_mat[p][id_part_j]++;									
									nb_occ_mat[id_part_j][p]++;
								}
							}
						}
					}
				}
				// for each part B, we increment the numbers of occasins A and B are judged similar
				for(var j=0; j<nPart-1; j++) {
					if(id_part_i != j) {
						nb_occ_mat[id_part_i][j]++;
						nb_occ_mat[j][id_part_i]++;
					}
				}
			}
		}
	}

	for(var i=0; i<nPart-1; i++) {
		for (var j=0; j<nPart-1; j++) {
			if (nb_occ_mat[i][j] != 0) {
				nb_sim_mat[i][j] /= nb_occ_mat[i][j];
			}
		}
	}

	affMatSymNoCont = nb_sim_mat;

}

function computeAffinityMatrixNoSymCont(shape) {

	var sim;
	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/PartsSimilarity/"+ shape +".json",false);
	xhr_object.onreadystatechange  = function() { 
		if(xhr_object.readyState  == 4) {

			var aux = eval('('+xhr_object.responseText+')');
			sim = aux["intrashape"];
		}
	}; 
	xhr_object.send(null);

	var nPart;
	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/Parts/"+ shape +".json",false);
	xhr_object.onreadystatechange  = function() { 
		if(xhr_object.readyState  == 4) {

			var aux = eval('('+xhr_object.responseText+')');
			nPart = numPart(aux.parts);
		}
	}; 
	xhr_object.send(null);

	var slider = document.getElementById("percentageslider");
	var classementLimite = Math.round((1-slider.value/100)*classement["ranking_with"].length);

	// Creation of the affinity matrix
	var nb_sim_mat = [];
	for(var i=0; i<nPart-1; i++) {
		nb_sim_mat[i] = new Array(nPart-1);
	}
	// Filling the diagonal with 1 and the other with 0
	for(var i=0; i<nPart-1; i++) {
		for (var j=i; j<nPart-1; j++) {
			if (j == i) {
				nb_sim_mat[i][j] = 1;
			} else {
				nb_sim_mat[i][j] = 0;
				nb_sim_mat[j][i] = 0;
			}
		}
	}

	// Creation of the matrix containing the number of occasions two parts could be judged similar
	var nb_occ_mat = [];
	for(var i=0; i<nPart-1; i++) {
		nb_occ_mat[i] = new Array(nPart-1);
	}
	// Filling the diagonal with 1 and the other with 0
	for(var i=0; i<nPart-1; i++) {
		for (var j=i; j<nPart-1; j++) {
			if (j == i) {
				nb_occ_mat[i][j] = 1;
			} else {
				nb_occ_mat[i][j] = 0;
				nb_occ_mat[j][i] = 0;
			}
		}
	}

	var parts = Object.keys(sim);
	dispMatNoSymCont = false;

	// For each part of the shape that has been given to teams
	for(var i=0; i<parts.length; i++) {
		// (a given part A)
		// we get the set of similar parts for each team	
		var parts_sim_i_cont = sim[parts[i]].context;
		var teams = Object.keys(parts_sim_i_cont);
		var id_part_i = parseInt(parts[i],10)-2;
		// and for each team that has judged this part
		for(var t=0; t<teams.length; t++) {
			var team = parseInt(teams[t],10);
			// we check if this team performed well enough on the gold standard to be taken into account
			if (classement["ranking_with"][team] <= classementLimite) {
				dispMatNoSymCont = true;
				// if that's the case, we get the parts they judged similar to the first one
				var sim_i = parts_sim_i_cont[teams[t]];
				// if there is only one part similar
				if (!Array.isArray(sim_i)) {
					var id_part_j = sim_i-2;
					// we add to the affinity matrix 1 to the numbers of times those parts have been judged similar
					nb_sim_mat[id_part_i][id_part_j]+=1;
					for(var p=0; p<nPart-1; p++){
						// (a given part C)
						if (id_part_j != p && id_part_i != p){							
							nb_occ_mat[p][id_part_j]++;									
							nb_occ_mat[id_part_j][p]++;
						}
					}
				// else if there is more than one part
				} else {
					// for each part 
					for(var j=0; j<sim_i.length; j++) {
						// (a given part B)
						// we had to the affinity matrix 1 to the numbers of times those parts have been judged similar
						var id_part_j = sim_i[j]-2;
						nb_sim_mat[id_part_i][id_part_j]++;
						// and to compute the implicit similarities, we look at all the other part of the shape
						for(var p=0; p<nPart-1; p++){
							// (a given part C)
							if (id_part_j != p && id_part_i != p){
								// and if one part is also judged similar to the first part, it is similar to the second one too
								// (if B and C are similar to A, they are implicitly judged similar)
								if (sim_i.includes(p+2)) {
									nb_sim_mat[id_part_j][p]++;
									nb_occ_mat[id_part_j][p]++;
								// (if C is not similar to A, B and C are implicitly not judged similar and we increment the numbers of occasions B and C are judged similar)
								} else {
									nb_occ_mat[p][id_part_j]++;									
									nb_occ_mat[id_part_j][p]++;
								}
							}
						}
					}
				}
				// for each part B, we increment the numbers of occasins A and B are judged similar
				for(var j=0; j<nPart-1; j++) {
					if(id_part_i != j) {
						nb_occ_mat[id_part_i][j]++;
					}
				}
			}
		}
	}

	for(var i=0; i<nPart-1; i++) {
		for (var j=0; j<nPart-1; j++) {
			if (nb_occ_mat[i][j] != 0) {
				nb_sim_mat[i][j] /= nb_occ_mat[i][j];
			}
		}
	}

	affMatNoSymCont = nb_sim_mat;

}

function computeAffinityMatrixNoSymNoCont(shape) {

	var sim;
	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/PartsSimilarity/"+ shape +".json",false);
	xhr_object.onreadystatechange  = function() { 
		if(xhr_object.readyState  == 4) {

			var aux = eval('('+xhr_object.responseText+')');
			sim = aux["intrashape"];
		}
	}; 
	xhr_object.send(null);

	var nPart;
	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/Parts/"+ shape +".json",false);
	xhr_object.onreadystatechange  = function() { 
		if(xhr_object.readyState  == 4) {

			var aux = eval('('+xhr_object.responseText+')');
			nPart = numPart(aux.parts);
		}
	}; 
	xhr_object.send(null);

	var slider = document.getElementById("percentageslider");
	var classementLimite = Math.round((1-slider.value/100)*classement["ranking_with"].length);

	// Creation of the affinity matrix
	var nb_sim_mat = [];
	for(var i=0; i<nPart-1; i++) {
		nb_sim_mat[i] = new Array(nPart-1);
	}
	// Filling the diagonal with 1 and the other with 0
	for(var i=0; i<nPart-1; i++) {
		for (var j=i; j<nPart-1; j++) {
			if (j == i) {
				nb_sim_mat[i][j] = 1;
			} else {
				nb_sim_mat[i][j] = 0;
				nb_sim_mat[j][i] = 0;
			}
		}
	}

	// Creation of the matrix containing the number of occasions two parts could be judged similar
	var nb_occ_mat = [];
	for(var i=0; i<nPart-1; i++) {
		nb_occ_mat[i] = new Array(nPart-1);
	}
	// Filling the diagonal with 1 and the other with 0
	for(var i=0; i<nPart-1; i++) {
		for (var j=i; j<nPart-1; j++) {
			if (j == i) {
				nb_occ_mat[i][j] = 1;
			} else {
				nb_occ_mat[i][j] = 0;
				nb_occ_mat[j][i] = 0;
			}
		}
	}

	var parts = Object.keys(sim);
	dispMatNoSymNoCont = false;

	// For each part of the shape that has been given to teams
	for(var i=0; i<parts.length; i++) {
		// (a given part A)
		// we get the set of similar parts for each team	
		var parts_sim_i_nocont = sim[parts[i]].nocontext;
		var teams = Object.keys(parts_sim_i_nocont);
		var id_part_i = parseInt(parts[i],10)-2;
		// and for each team that has judged this part
		for(var t=0; t<teams.length; t++) {
			var team = parseInt(teams[t],10);
			// we check if this team performed well enough on the gold standard to be taken into account
			if (classement["ranking_with"][team] <= classementLimite) {
				dispMatNoSymNoCont = true;
				// if that's the case, we get the parts they judged similar to the first one
				var sim_i = parts_sim_i_nocont[teams[t]];
				// if there is only one part similar
				if (!Array.isArray(sim_i)) {
					var id_part_j = sim_i-2;
					// we add to the affinity matrix 1 to the numbers of times those parts have been judged similar
					nb_sim_mat[id_part_i][id_part_j]+=1;
					for(var p=0; p<nPart-1; p++){
						// (a given part C)
						if (id_part_j != p && id_part_i != p){							
							nb_occ_mat[p][id_part_j]++;									
							nb_occ_mat[id_part_j][p]++;
						}
					}
				// else if there is more than one part
				} else {
					// for each part 
					for(var j=0; j<sim_i.length; j++) {
						// (a given part B)
						// we add to the affinity matrix 1 to the numbers of times those parts have been judged similar
						var id_part_j = sim_i[j]-2;
						nb_sim_mat[id_part_i][id_part_j]++;
						// and to compute the implicit similarities, we look at all the other part of the shape
						for(var p=0; p<nPart-1; p++){
							// (a given part C)
							if (id_part_j != p && id_part_i != p){
								// and if one part is also judged similar to the first part, it is similar to the second one too
								// (if B and C are similar to A, they are implicitly judged similar)
								if (sim_i.includes(p+2)) {
									nb_sim_mat[id_part_j][p]++;
									nb_occ_mat[id_part_j][p]++;
								// (if C is not similar to A, B and C are implicitly not judged similar and we increment the numbers of occasions B and C are judged similar)
								} else {
									nb_occ_mat[p][id_part_j]++;									
									nb_occ_mat[id_part_j][p]++;
								}
							}
						}
					}
				}
				// for each part B, we increment the numbers of occasins A and B are judged similar
				for(var j=0; j<nPart-1; j++) {
					if(id_part_i != j) {
						nb_occ_mat[id_part_i][j]++;
					}
				}
			}
		}
	}

	for(var i=0; i<nPart-1; i++) {
		for (var j=0; j<nPart-1; j++) {
			if (nb_occ_mat[i][j] != 0) {
				nb_sim_mat[i][j] /= nb_occ_mat[i][j];
			}
		}
	}

	affMatNoSymNoCont = nb_sim_mat;

}

function displayAffinityMatrices(shape) {

	displayElement('sidePanel');
	displayElement('slider');

	// Colorbar
	var ctxColorbar = document.getElementById("colorbar").getContext("2d");
	drawColorbar(ctxColorbar);


	// Symmetrical and no symmetrical title before affinity matrices
	var ctxContext = document.getElementById("Symmetrical").getContext("2d");
	var ctxnocontext = document.getElementById("NonSymmetrical").getContext("2d");
	
	
	ctxContext.fillStyle = "black";
	ctxContext.font = "18pt Calibri,Geneva,Arial";
	ctxContext.fillText('Symmetrical',canSize/5,canSize/10);

	
	ctxnocontext.fillStyle = "black";
	ctxnocontext.font = "18pt Calibri,Geneva,Arial";
	ctxnocontext.fillText("Non symmetrical",canSize/10,canSize/10);

	// Context and no context title before affinity matrices
	var ctxContext = document.getElementById("ContextTitle").getContext("2d");
	var ctxnocontext = document.getElementById("NoContextTitle").getContext("2d");
	
	
	ctxContext.fillStyle = "black";
	ctxContext.font = "18pt Calibri,Geneva,Arial";
	ctxContext.fillText('Context',canSize/4,canSize/10);

	
	ctxnocontext.fillStyle = "black";
	ctxnocontext.font = "18pt Calibri,Geneva,Arial";
	ctxnocontext.fillText("No context",canSize/4,canSize/10);
	
	// Context and no context title before affinity matrices
	var ctxContextn = document.getElementById("ContextTitlenosym").getContext("2d");
	var ctxnocontextn = document.getElementById("NoContextTitlenosym").getContext("2d");
	
	
	ctxContextn.fillStyle = "black";
	ctxContextn.font = "18pt Calibri,Geneva,Arial";
	ctxContextn.fillText('Context',canSize/4,canSize/10);

	
	ctxnocontextn.fillStyle = "black";
	ctxnocontextn.font = "18pt Calibri,Geneva,Arial";
	ctxnocontextn.fillText("No context",canSize/4,canSize/10);
	
	// Affinity matrices
	var contextMatrixCanvas = document.getElementById("contextmatrixCanvas");
	var nocontextMatrixCanvas = document.getElementById("nocontextmatrixCanvas");

	var ctxToDrawContext = contextMatrixCanvas.getContext("2d");
	var ctxToDrawNoContext = nocontextMatrixCanvas.getContext("2d");

	computeAffinityMatrixSymCont(shape);
	computeAffinityMatrixSymNoCont(shape);

	nCol = affMatSymCont.length;
	
	drawAffinityMatrix(ctxToDrawContext,9*canSize/10,2,canSize/20,canSize/20,affMatSymCont,dispMatSymCont);
	drawAffinityMatrix(ctxToDrawNoContext,9*canSize/10,2,canSize/20,canSize/20,affMatSymNoCont,dispMatSymNoCont);

	if (dispMatSymCont){
		contextMatrixCanvas.addEventListener('mousemove',highlightColumn,false);	
		contextMatrixCanvas.addEventListener('click',handleColumnClick,false);
	} else {
		contextMatrixCanvas.removeEventListener('mousemove',highlightColumn,false);
		contextMatrixCanvas.removeEventListener('click',handleColumnClick,false);
	}
	
	if (dispMatSymNoCont) {
		nocontextMatrixCanvas.addEventListener('mousemove',highlightColumn,false);
		nocontextMatrixCanvas.addEventListener('click',handleColumnClick,false);
	} else {
		nocontextMatrixCanvas.removeEventListener('mousemove',highlightColumn,false);
		nocontextMatrixCanvas.removeEventListener('click',handleColumnClick,false);	
	}
	
	// Affinity matrices
	var contextMatrixCanvasn = document.getElementById("contextmatrixCanvasnosym");
	var nocontextMatrixCanvasn = document.getElementById("nocontextmatrixCanvasnosym");

	var ctxToDrawContextn = contextMatrixCanvasn.getContext("2d");
	var ctxToDrawNoContextn = nocontextMatrixCanvasn.getContext("2d");

//	nCol = matrices["matrix_with_context"].length;

	computeAffinityMatrixNoSymCont(shape);
	computeAffinityMatrixNoSymNoCont(shape);
	
	drawAffinityMatrix(ctxToDrawContextn,9*canSize/10,2,canSize/20,canSize/20,affMatNoSymCont,dispMatNoSymCont);
	drawAffinityMatrix(ctxToDrawNoContextn,9*canSize/10,2,canSize/20,canSize/20,affMatNoSymNoCont,dispMatNoSymNoCont);
	
	if(dispMatNoSymCont){
		contextMatrixCanvasn.addEventListener('mousemove',highlightColumn,false);
		
		contextMatrixCanvasn.addEventListener('click',handleColumnClick,false);
	} else {
		contextMatrixCanvasn.removeEventListener('mousemove',highlightColumn,false);
		contextMatrixCanvasn.removeEventListener('click',handleColumnClick,false);
	}
	
	if (dispMatNoSymNoCont) {
		nocontextMatrixCanvasn.addEventListener('mousemove',highlightColumn,false);
		nocontextMatrixCanvasn.addEventListener('click',handleColumnClick,false);
	} else {
		nocontextMatrixCanvasn.removeEventListener('mousemove',highlightColumn,false);
		nocontextMatrixCanvasn.removeEventListener('click',handleColumnClick,false);
	}
}

function displayShapeSimilarities(shape, part) {
	displayElement('slider');
	
	if (!popoverDisplayed) {
		// Hide the popover that tells users to click on a shape
		$('#canvascontainer').popover('hide');
		popoverDisplayed = true;
	}
	
	if (document.getElementById("othershapelink")!=null){document.getElementById("othershapelink").remove();}

	// Fetch the annotations of this shape
	var xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/PartsSimilarity/"+shape+".json",false);
	xhr_object.onreadystatechange  = function() { 
	    if(xhr_object.readyState  == 4) {
			
			var aux = eval('('+xhr_object.responseText+')');
			similarities = aux["intrashape"][part.toString()];
			intershape = aux["intershape"][part.toString()];
				
	    }
	}; 
	xhr_object.send(null);

	var nameFile = shape.slice(0, shape.lastIndexOf("_"));
	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/Shapes/"+ nameFile +".json",false);
	xhr_object.onreadystatechange  = function() { 
		if(xhr_object.readyState  == 4) {
			
			currentShapeInfo = eval('('+xhr_object.responseText+')');
			
		}
	}; 
	xhr_object.send(null);

	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/Parts/"+ shape +".json",false);
	xhr_object.onreadystatechange  = function() { 
		if(xhr_object.readyState  == 4) {
			
			PartsInfo = eval('('+xhr_object.responseText+')');
			
		}
	}; 
	xhr_object.send(null);

	drawSelectedSimilarities(shape, part);

	var slider = document.getElementById("percentageslider");
	slider.oninput = function() {
		//drawSelectedSimilarities(shapeName, numPartold);
		displayShapeSimilarities(shapeName, numPartClicked);
		displayAffinityMatrices(shapeName);
	}

}

function drawSelectedSimilarities(shape, part) {
	var slider = document.getElementById("percentageslider");
	//console.log(similarities);
	var contextKeys = Object.keys(similarities.context);
	var nocontextKeys = Object.keys(similarities.nocontext);

	var selectedContextKeys = [];
	var selectedNoContextKeys = [];

	var classementLimite = Math.round((1-slider.value/100)*classement["ranking_with"].length);
	
	for (var k = 0; k<contextKeys.length; k++) {
		var teamId = contextKeys[k];
		if (classement["ranking_with"][parseInt(teamId,10)] <= classementLimite) {
			selectedContextKeys.push(teamId);
		}
	}

	for (var k = 0; k<nocontextKeys.length; k++) {
		var teamId = nocontextKeys[k];
		if (classement["ranking_without"][parseInt(teamId,10)] <= classementLimite) {
			selectedNoContextKeys.push(teamId);
		}
	}

	var canvasContainer = document.getElementById("canvascontainer");
	var nbContext = Object.keys(selectedContextKeys).length;
	var nbNocontext = Object.keys(selectedNoContextKeys).length;
	
	//console.log("NbCanvas :" + nbCanvas);
	if (document.getElementById("legcontcanva")!=null){document.getElementById("legcontcanva").remove();}
	if (document.getElementById("legnocontcanva")!=null){document.getElementById("legnocontcanva").remove();}
	var canDeleted =0;
	for (var i=0; i<nbCanvas;i++){
			document.getElementById('canvas'+i).remove();
			//console.log(i);
			canDeleted++;
	
	}
	nbCanvas = nbCanvas - canDeleted;
	//console.log(nbNocontext);
	//Légend avec context
	if (document.getElementById("legcontcanva")==null &&nbContext>0){
		var legendContext = document.createElement('canvas');
		legendContext.setAttribute('id','legcontcanva');
		legendContext.setAttribute('width',canvasContainer.clientWidth);
		legendContext.setAttribute('height',canSize/10);
		canvasContainer.appendChild(legendContext);
		
		
		var ctxl = legendContext.getContext('2d');
		ctxl.fillStyle = "red";
		ctxl.fillRect(canSize/20,0,5*canSize/20,2*canSize/20);
		
		ctxl.fillStyle = "green";
		ctxl.fillRect(20*canSize/20,0,5*canSize/20,2*canSize/20);
		
		ctxl.fillStyle = "black";
			
		ctxl.font = "bold 12pt Calibri,Geneva,Arial";
		ctxl.fillText("selected part",7*canSize/20,1.5*canSize/20);
		ctxl.fillText("parts judged similar with context",26*canSize/20,1.5*canSize/20);
	}
	
	// Update the number of canvas
	while (nbCanvas < nbContext + nbNocontext) {
		// Create new canvases to meet the requirements
		var auxCanvas = document.createElement('canvas');
		auxCanvas.setAttribute('id','canvas'+nbCanvas);
		auxCanvas.setAttribute('width',canSize);
		auxCanvas.setAttribute('height',canSize);
		nbCanvas++;
		canvasContainer.appendChild(auxCanvas);
		var ctx = auxCanvas.getContext("2d");
		// translate context to center of canvas
		ctx.translate(0, canSize);
	   // flip context vertically
		ctx.scale(1, -1);
		//console.log(nbNocontext + "khohln" + nbCanvas + " "+ nbContext);
		if (nbNocontext>0 && nbCanvas == nbContext){
			//console.log("jajaoifnoghb");
			var legend2Context = document.createElement('canvas');
			legend2Context.setAttribute('id','legnocontcanva');
			legend2Context.setAttribute('width',canvasContainer.clientWidth);
			legend2Context.setAttribute('height',canSize/10);
			canvasContainer.appendChild(legend2Context);
		}
		
	}

	//see similar part from other shapes
	var interKeys = Object.keys(intershape.nocontext);
	var interKeysSelected = [];
	var slider = document.getElementById("percentageslider");

	var classementLimite = Math.round((1-slider.value/100)*classement["ranking_with"].length);
	
	for (var k = 0; k<interKeys.length; k++) {
		var teamId = interKeys[k];
		if (classement["ranking_without"][parseInt(teamId,10)] <= classementLimite) {
			interKeysSelected.push(teamId);
		}
	}
	var nbInter = interKeysSelected.length;
	if (document.getElementById("othershapelink")!=null){document.getElementById("othershapelink").remove();}
	if (document.getElementById("othershapelink")==null && nbInter>0){
		shapeIntername=shape;
		partIntername=part;
		var otherlink = document.createElement('div');
		var texte = document.createTextNode('Click here to see similar parts from OTHER shapes.');
		otherlink.setAttribute('style','color: black');
		otherlink.setAttribute('id','othershapelink');
		otherlink.setAttribute('OnMouseOver','this.style.color="blue"');
		otherlink.setAttribute('OnMouseOut','this.style.color="black"');
		otherlink.appendChild(texte);
		canvasContainer.appendChild(otherlink);
		
		otherlink.addEventListener('click',handleOtherShapeClick,false);
	
	}
	
	// Draw the shapes on each canvas
	for (var s = 0; s < nbContext + nbNocontext; s++) {
		
		var canToDraw = document.getElementById("canvas" + s);
		var ctxToDraw = canToDraw.getContext('2d');
		
		if (s < nbContext) {

			drawSimilarities(ctxToDraw,9*canSize/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,PartsInfo.parts,part,similarities.context[selectedContextKeys[s]],true);

		} else {
			if (s==nbContext && nbNocontext>0){
				var legend2Context = document.getElementById("legnocontcanva");
				var ctxl = legend2Context.getContext('2d');
				ctxl.fillStyle = "red";
				ctxl.fillRect(canSize/20,0,5*canSize/20,2*canSize/20);
				
				ctxl.fillStyle = "blue";
				ctxl.fillRect(20*canSize/20,0,5*canSize/20,2*canSize/20);
				
				ctxl.fillStyle = "black";
					  
				ctxl.font = "bold 12pt Calibri,Geneva,Arial";
				ctxl.fillText("selected part",7*canSize/20,1.5*canSize/20);
				ctxl.fillText("parts judged similar without context",26*canSize/20,1.5*canSize/20);
		
			}
			drawSimilarities(ctxToDraw,9*canSize/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,PartsInfo.parts,part,similarities.nocontext[selectedNoContextKeys[s-nbContext]],false);

		}

	}
	
	if (seeOtherclicked==true && otherlink!=undefined){
		otherlink.click();
	}
	

	// Clear the remaining canvas
	var canDeleted = 0;
	for (var s = nbContext + nbNocontext + nbInter; s < nbCanvas ; s++) {
		var canToDraw = document.getElementById("canvas" + s);
		var ctxToDraw = canToDraw.getContext('2d');
		ctxToDraw.clearRect(0,0,canSize,canSize);

		canToDraw.removeEventListener('mouseenter',highlightCanvas,false);
		canToDraw.removeEventListener('mouseleave',dehighlightCanvas,false);
		canToDraw.removeEventListener('click',handleShapeClick,false);
		
		canToDraw.style = "cursor: default;";
		canToDraw.remove();
		canDeleted++;
		
	}
	nbCanvas = nbCanvas - canDeleted;

	// Remove event listeners on all canvases
	for (var s = 0; s < nbCanvas ; s++) {
		var canToDraw = document.getElementById("canvas" + s);

		canToDraw.removeEventListener('mouseenter',highlightCanvas,false);
		canToDraw.removeEventListener('mouseleave',dehighlightCanvas,false);
		canToDraw.removeEventListener('click',handleShapeClick,false);
		
		canToDraw.style = "cursor: default;";
	}

}

function backToShapeCategory() {
	hideElement('sidePanel');
	hideElement('slider');
	displayShapeCategory();
}

function displayMajorityVote(shapeToDisplay) {
	// Fetch the majority annotation of this shape
	var xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/Majority/"+shapeToDisplay+".json",false);
	majority = null;
	xhr_object.onreadystatechange  = function() { 
	     if(xhr_object.readyState  == 4) {

				var aux = eval('('+xhr_object.responseText+')');
				majority = aux.majority;
				
	     }
	}; 
	xhr_object.send(null);
	
	var canToDraw = document.getElementById("majorityCanvas");
	var ctxToDraw = canToDraw.getContext('2d');
	drawFilledObject(ctxToDraw,9*canSize/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,majority);	
}

function displaySpectralClustering(shapeToDisplay) {
	// Fetch the spectral clustering annotations of this shape
	var xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/Spectral/"+shapeToDisplay+".json",false);
	modes = null;
	xhr_object.onreadystatechange  = function() { 
	     if(xhr_object.readyState  == 4) {

				var aux = eval('('+xhr_object.responseText+')');
				modes = aux.modes;
				
	     }
	}; 
	xhr_object.send(null);
	
	if (modes != null) {
		var spectralCanvasContainer = document.getElementById("spectralcanvascontainer");

		// Update the number of canvas
		while (nbSpectralCanvas < modes.length) {
			// Create new canvases to meet the requirements
			var auxCanvas = document.createElement('canvas');
			auxCanvas.setAttribute('id','spectralcanvas'+nbSpectralCanvas);
			auxCanvas.setAttribute('width',canSize);
			auxCanvas.setAttribute('height',canSize);
	/*		auxCanvas.addEventListener('mouseenter',highlightCanvas,false);
			auxCanvas.addEventListener('mouseleave',dehighlightCanvas,false);
			auxCanvas.addEventListener('click',handleShapeClick,false); */
			nbSpectralCanvas++;
			spectralCanvasContainer.appendChild(auxCanvas);
			var ctx = auxCanvas.getContext("2d");
			// translate context to center of canvas
		   ctx.translate(0, canSize);
		   // flip context vertically
		   ctx.scale(1, -1);
		}	
		
		// Draw the modes on each canvas
		for (var m = 0; m < modes.length;m++) {
	
			var canToDraw = document.getElementById("spectralcanvas" + m);
			var ctxToDraw = canToDraw.getContext('2d');
	
			drawFilledObject(ctxToDraw,9*canSize/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,modes[m].mode);
				
		/*	ctxToDraw.strokeStyle = spectralColors[m];
			ctxToDraw.lineWidth = 10;
			ctxToDraw.strokeRect(0,0,canSize,canSize);	 */
			
	
		}
	
		// Clear the remaining canvas
		for (var c = modes.length; c < nbSpectralCanvas ; c++) {
			var canToDraw = document.getElementById("spectralcanvas" + c);
			var ctxToDraw = canToDraw.getContext('2d');
			ctxToDraw.clearRect(0,0,canSize,canSize);
			
			
		}
		
			/*	
		// Go through each annotation
		for (var a = 0; a < annotations.length; a++) {
			var belongingClust = -1;
			
			// We'll compare this annotation to the ones related to each mode
			for (var c = 0; c < modes.length ; c++) {
				for (var c_a=0;c_a<modes[c].annotation.length; c_a++) {
					if (compareAnnotations(annotations[a],modes[c].annotation[c_a])) {
						belongingClust = c;
					}			
				}
			}
			var canToDraw = document.getElementById("canvas" + a);
			var ctxToDraw = canToDraw.getContext('2d');
			if (belongingClust>-1) {
				ctxToDraw.strokeStyle = spectralColors[belongingClust];
				ctxToDraw.lineWidth = 10;
				ctxToDraw.strokeRect(0,0,canSize,canSize);	
			} else {
				// Make the canvas less visible			
				ctxToDraw.fillStyle = "rgba(255,255,255,0.6)";
				ctxToDraw.fillRect(0,0,canSize,canSize);
			}
			
		}
	*/	
		
	}	else {
		// Clear the spectral clustering canvases
		for (var m = 0; m < nbSpectralCanvas;m++) {
	
			var canToDraw = document.getElementById("spectralcanvas" + m);
			var ctxToDraw = canToDraw.getContext('2d');
	
			ctxToDraw.clearRect(0,0,canSize,canSize)
			
	
		}	
	}
	
	
}

function compareAnnotations(a1,a2) {
	var res = true;
	
	if (a1.length == a2.length) {
		var i = 0;
		while(i<a1.length && a1[i] == a2[i]) {
			i++
		}
		if (i < a1.length) {
			res = false;
		}
	} else {
		res = false;
	}		
	return res;
}

function mouseInTriangle(xA,yA,xB,yB,xC,yC,xm,ym,scale,offX,offY){
	//scale*points[triangles[t].p1].x+offX,scale*points[triangles[t].p1].y+offY
	xA = scale*xA+offX;
	yA = scale*yA+offY; 
	xB = scale*xB+offX;
	yB = scale*yB+offY;
	xC = scale*xC+offX;
	yC = scale*yC+offY;


	var scrolled = window.scrollY;
	var xM = xm - window.scrollX;
	var yM = 2*canSize - ym + scrolled;

	var xAM = xM-xA;
    var yAM = yM-yA;
    
    var xAC = xC-xA;
    var yAC = yC-yA;
    
    var xAB = xB-xA;
    var yAB = yB-yA;
    
    var detAMAC = xAM * yAC - yAM * xAC;
    var detABAC = xAB * yAC - yAB * xAC;
    var detAMAB = xAM * yAB - yAM * xAB;
    var detACAB = - detABAC;
    
    var x = detAMAC/detABAC;
	var y = detAMAB/detACAB;
    return x>=0 && y>=0 && x+y <=1;
}

function highlightParts(e) {
    var auxId; 
    if (e.srcElement == null) {
        auxId = e.target.id;
    } else {
        auxId = e.srcElement.id; 
    }    

    var idCanvas = parseInt(auxId);
    
	var canvas = document.getElementById(auxId);
	var ctx = canvas.getContext('2d'),
	// Position X du canvas
	rect = canvas.getBoundingClientRect(),
	elemLeft = rect.left,
	// Position Y du canvas
	elemTop = rect.top,
	x,
	y;

	var contextMatrixCanvas = document.getElementById("contextmatrixCanvas");
	var nocontextMatrixCanvas = document.getElementById("nocontextmatrixCanvas");

	var ctxToDrawContext = contextMatrixCanvas.getContext("2d");
	var ctxToDrawNoContext = nocontextMatrixCanvas.getContext("2d");
	
	//Position X du click (Position X du click sur la page moins la position X du canvas)
	x = e.pageX - elemLeft,
	// Position Y du click (Position Y du click sur la page moins la position Y du canvas)
	y = e.pageY - elemTop;
	var notdisplayed = 1;
	var i = 0;
	var numPart;
	var points = currentShapeInfo.points;
	while ( i<currentShapeInfo.triangles.length && notdisplayed){
		var currentTriangle = currentShapeInfo.triangles[i];
		if (mouseInTriangle(points[currentTriangle.p1].x,points[currentTriangle.p1].y,points[currentTriangle.p2].x,points[currentTriangle.p2].y,points[currentTriangle.p3].x,points[currentTriangle.p3].y,x,y,2*9*canSize/10,canSize/20,canSize/20)==1) {
			numPart = currentPartsInfo.parts[i];
			notdisplayed = 0;
		}
		i++;
	}
	if (numPart>=0){
		if (numPart!=numPartold){
			numPartold=numPart;
			ctx.clearRect(0,0,2*canSize,2*canSize);
			drawObjectParts(ctx,2*9*canSize/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,currentPartsInfo.parts);
	
			drawFilledPart(ctx,9*canSize*2/10,1,canSize/20,canSize/20,points,currentShapeInfo.triangles,currentPartsInfo.parts,currentPartsInfo.hierarchy,numPart);

			if (numPart != 1) {
				var size = 9*canSize/10/nCol;

				drawAffinityMatrix(ctxToDrawContext,9*canSize/10,2,canSize/20,canSize/20,affMatSymCont,dispMatSymCont);
				drawAffinityMatrix(ctxToDrawNoContext,9*canSize/10,2,canSize/20,canSize/20,affMatSymNoCont,dispMatSymNoCont);

				drawHighlightedColumn(ctxToDrawContext,9*canSize/10,2,canSize/20,canSize/20,size,numPart-2);
				drawHighlightedColumn(ctxToDrawNoContext,9*canSize/10,2,canSize/20,canSize/20,size,numPart-2);
			}
		}
	}
		/*
	ctx.strokeStyle = "green";
	ctx.lineWidth = 5;
	ctx.strokeRect(0,0,canSize,canSize);
	canvas.style = "cursor: pointer;";

	var currentdisplay = document.getElementById('currentdisplay');
	currentdisplay.innerHTML = selectedLabel + " - " + shapenames[idCanvas];*/

    
}

function handlePartClick(e) {
	if (numPartold != 1) {
		numPartClicked = numPartold
		displayShapeSimilarities(shapeName,numPartClicked);
	}
}

function handleOtherShapeClick(e) {
		
	seeOtherclicked = true;
	var xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/PartsSimilarity/"+shapeIntername+".json",false);
	xhr_object.onreadystatechange  = function() { 
	    if(xhr_object.readyState  == 4) {
			
			var aux = eval('('+xhr_object.responseText+')');
			similarities = aux["intrashape"][partIntername.toString()];
			intershape = aux["intershape"][partIntername.toString()];
				
	    }
	}; 
	xhr_object.send(null);


	var interKeys = Object.keys(intershape.nocontext);
	var interKeysSelected = [];
	var slider = document.getElementById("percentageslider");

	var classementLimite = Math.round((1-slider.value/100)*classement["ranking_with"].length);
	
	for (var k = 0; k<interKeys.length; k++) {
		var teamId = interKeys[k];
		if (classement["ranking_without"][parseInt(teamId,10)] <= classementLimite) {
			interKeysSelected.push(teamId);
		}
	}
	
	var contextKeys = Object.keys(similarities.context);
	var nocontextKeys = Object.keys(similarities.nocontext);

	var selectedContextKeys = [];
	var selectedNoContextKeys = [];

	var classementLimite = Math.round((1-slider.value/100)*classement["ranking_with"].length);
	
	for (var k = 0; k<contextKeys.length; k++) {
		var teamId = contextKeys[k];
		if (classement["ranking_with"][parseInt(teamId,10)] <= classementLimite) {
			selectedContextKeys.push(teamId);
		}
	}

	for (var k = 0; k<nocontextKeys.length; k++) {
		var teamId = nocontextKeys[k];
		if (classement["ranking_without"][parseInt(teamId,10)] <= classementLimite) {
			selectedNoContextKeys.push(teamId);
		}
	}

	var canvasContainer = document.getElementById("canvascontainer");
	var nbContext = Object.keys(selectedContextKeys).length;
	var nbNocontext = Object.keys(selectedNoContextKeys).length;
	var nbInter = interKeysSelected.length;
	var canvasContainer = document.getElementById("canvascontainer");
	
	// Clear the remaining canvas
	var canDeleted = 0;
	s = nbContext + nbNocontext;
	//console.log("nbCanva "+nbCanvas + "nbCo"+nbContext+"nbno"+nbNocontext);
	while (s < nbCanvas) {
		var canToDraw = document.getElementById("canvas" + s);
		var ctxToDraw = canToDraw.getContext('2d');
		ctxToDraw.clearRect(0,0,canSize,canSize);

		canToDraw.removeEventListener('mouseenter',highlightCanvas,false);
		canToDraw.removeEventListener('mouseleave',dehighlightCanvas,false);
		canToDraw.removeEventListener('click',handleShapeClick,false);
		
		canToDraw.style = "cursor: default;";
		canToDraw.remove();
		canDeleted++;
		s++;
		
	}
	nbCanvas = nbCanvas - canDeleted;

	while (nbCanvas < nbContext + nbNocontext + nbInter) {
		// Create new canvases to meet the requirements
		var auxCanvas = document.createElement('canvas');
		auxCanvas.setAttribute('id','canvas'+nbCanvas);
		auxCanvas.setAttribute('width',canSize);
		auxCanvas.setAttribute('height',canSize + canSize/10);
		nbCanvas++;
		canvasContainer.appendChild(auxCanvas);
		var ctx = auxCanvas.getContext("2d");
		// translate context to center of canvas
		ctx.translate(0, canSize);
	   // flip context vertically
		ctx.scale(1, -1);		
		
	}
	
	for (var s = nbContext + nbNocontext; s<nbContext + nbNocontext + nbInter; s++) {
		var canToDraw = document.getElementById("canvas" + s);
		var ctxToDraw = canToDraw.getContext('2d');

		var interSimilar = intershape.nocontext[interKeysSelected[s-(nbContext + nbNocontext)]];

		var nameFile = interSimilar[0].slice(0, interSimilar[0].lastIndexOf("_"));
		var extShapeInfo;
		xhr_object=new XMLHttpRequest();
		xhr_object.open("GET","JSON/Shapes/"+ nameFile +".json",false);
		xhr_object.onreadystatechange  = function() { 
			if(xhr_object.readyState  == 4) {
				
				extShapeInfo = eval('('+xhr_object.responseText+')');
				
			}
		}; 
		xhr_object.send(null);

		var extPartsInfo;
		xhr_object=new XMLHttpRequest();
		xhr_object.open("GET","JSON/Parts/"+ interSimilar[0] +".json",false);
		xhr_object.onreadystatechange  = function() { 
			if(xhr_object.readyState  == 4) {
				
				extPartsInfo = eval('('+xhr_object.responseText+')');
				
			}
		}; 
		xhr_object.send(null);
		
		var interSimilarities = [];
		for (var i = 1; i < interSimilar.length; i += 2) {
			interSimilarities.push(interSimilar[i]);
		}
		drawSimilaritiesInter(ctxToDraw,9*canSize/10,1,canSize/20,canSize/10,extShapeInfo.points,extShapeInfo.triangles,extPartsInfo.parts,interSimilarities);
		ctxToDraw.scale(1,-1);
		ctxToDraw.fillStyle = "black";
		ctxToDraw.font = "18pt Calibri,Geneva,Arial";
		ctxToDraw.fillText(nameFile,0,0);
		//console.log("création other");
		
		
	}
		
	
}

function displayPartsHighlighted(partsToDisplay) {
	
	// Clear the remaining canvas
	for (var s = 0; s < nbCanvas ; s++) {
		var canToDraw = document.getElementById("canvas" + s);
		var ctxToDraw = canToDraw.getContext('2d');
		ctxToDraw.clearRect(0,0,canSize,canSize);
		canToDraw.remove();
		
	}
	nbCanvas =0;
	
	if (!popoverDisplayed) {
		// Hide the popover that tells users to click on a shape
		$('#canvascontainer').popover('hide');
		popoverDisplayed = true;
		
	}
	shapeName = partsToDisplay;
	var shapeToDisplay = shapeName.slice(0, shapeName.lastIndexOf("_")); 
	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/Shapes/"+ shapeToDisplay +".json",false);
	xhr_object.onreadystatechange  = function() { 
		 if(xhr_object.readyState  == 4) {

				currentShapeInfo = eval('('+xhr_object.responseText+')');
			
		 }
	}; 
	xhr_object.send(null);
	
	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/Parts/"+ partsToDisplay +".json",false);
	xhr_object.onreadystatechange  = function() { 
		 if(xhr_object.readyState  == 4) {

				currentPartsInfo = eval('('+xhr_object.responseText+')');
			
		 }
	}; 
	xhr_object.send(null);
	
	ShapeDisplayed = shapeToDisplay;


	
	var canvasContainer = document.getElementById("canvascontainer");
	// Create new canvases to meet the requirements
	var maincanva = document.createElement('canvas');
	maincanva.setAttribute('id','maincanva');
	maincanva.setAttribute('width',canSize*2);
	maincanva.setAttribute('height',canSize*2);
	canvasContainer.appendChild(maincanva);
	
	// Légende du schéma
	var canvasContainer = document.getElementById("canvascontainer");
	// Create new canvases to meet the requirements
	var legendcanva = document.createElement('canvas');
	legendcanva.setAttribute('id','legendcanva');
	legendcanva.setAttribute('width',canSize*2);
	legendcanva.setAttribute('height',canSize*2);
	canvasContainer.appendChild(legendcanva);

	var ctx = maincanva.getContext("2d");
	// translate context to center of canvas
	ctx.translate(0, canSize*2);
	// flip context vertically
	ctx.scale(1, -1);
	
	
	// Draw the shapes on main canva
	var canToDraw = document.getElementById("maincanva");
	var ctxToDraw = canToDraw.getContext('2d');
	
	//drawFilledObject(ctxToDraw,9*canSize/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,annotations[s]);
	// PARTIE D'ETIENNE AVEC TRACE DES CONTOURS DES PARTIES
	drawObjectParts(ctxToDraw,2*9*canSize/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,currentPartsInfo.parts);
	canToDraw.addEventListener('mousemove',highlightParts,false);
	canToDraw.addEventListener('click',handlePartClick,false);
	
	canToDraw.style = "cursor: default;";
	
	var ctxl = legendcanva.getContext("2d");
	ctxl.fillStyle = "black";
	ctxl.fillRect(canSize/20,canSize/20,5*canSize/20,2*canSize/20);
	
	ctxl.fillStyle = "magenta";
	ctxl.fillRect(canSize/20,4.5*canSize/20,5*canSize/20,2*canSize/20);
	
	ctxl.fillStyle = "green";
	ctxl.fillRect(canSize/20,8*canSize/20,5*canSize/20,2*canSize/20);
	
	ctxl.fillStyle = "black";
		  
	ctxl.font = "bold 22pt Calibri,Geneva,Arial";
	ctxl.fillText("main part (unclickable)",7*canSize/20,2.5*canSize/20);
	ctxl.fillText("secondary parts",7*canSize/20,6*canSize/20);
	ctxl.fillText("details",7*canSize/20,9.5*canSize/20);

	displayAffinityMatrices(shapeName);

}