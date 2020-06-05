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

function doLoad() {
	
	hideElement('sidePanel');
	
	// Show the popover to help users
	$('#labelswrapper').popover('show');
	
	numPartold = -1;
	
	nbCanvas = 0;
	nbSpectralCanvas = 0;
	popoverDisplayed = false;

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
					if (k<23) {
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
} 


function handleClickCategory(e) {

	// Hiding the side panel in case it was displayed
	hideElement('sidePanel');
	
	// Hide the popover to help users
	$('#labelswrapper').popover('hide');
	
	
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
	for (var s = shapenames.length; s < nbCanvas ; s++) {
		var canToDraw = document.getElementById("canvas" + s);
		var ctxToDraw = canToDraw.getContext('2d');
		ctxToDraw.clearRect(0,0,canSize,canSize);
	}
	
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
		var shapeToDisplay = shapenames[idCanvas];
		displayPartsHighlighted(shapeToDisplay);
		
	}
}

function displayAffinityMatrices(shape) {

	displayElement('sidePanel');

	// Fetch the matrices of this shape
	var xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/AffinityMatrices/"+shape+".json",false);
	xhr_object.onreadystatechange  = function() { 
	    if(xhr_object.readyState  == 4) {
			
			matrices = eval('('+xhr_object.responseText+')');
	    }
	}; 
	xhr_object.send(null);

	var ctxContext = document.getElementById("ContextTitle").getContext("2d");
	var ctxnocontext = document.getElementById("NoContextTitle").getContext("2d");
	
	
	ctxContext.fillStyle = "black";
	ctxContext.font = "18pt Calibri,Geneva,Arial";
	ctxContext.fillText('Context',canSize/4,canSize/10);

	
	ctxnocontext.fillStyle = "black";
	ctxnocontext.font = "18pt Calibri,Geneva,Arial";
	ctxnocontext.fillText("No context",canSize/4,canSize/10);
	

	var contextMatrixCanvas = document.getElementById("contextmatrixCanvas");
	var nocontextMatrixCanvas = document.getElementById("nocontextmatrixCanvas");

	var ctxToDrawContext = contextMatrixCanvas.getContext("2d");
	var ctxToDrawNoContext = nocontextMatrixCanvas.getContext("2d");
	
	
	drawAffinityMatrix(ctxToDrawContext,9*canSize/10,2,canSize/20,canSize/20,matrices["matrix_with_context"]);
	drawAffinityMatrix(ctxToDrawNoContext,9*canSize/10,2,canSize/20,canSize/20,matrices["matrix_without_context"]);

}

function displayShapeSimilarities(shape, part) {
	
	if (!popoverDisplayed) {
		// Hide the popover that tells users to click on a shape
		$('#canvascontainer').popover('hide');
		popoverDisplayed = true;
	}

	// Fetch the annotations of this shape
	var xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/PartsSimilarity/"+shape+".json",false);
	similarities = null;
	xhr_object.onreadystatechange  = function() { 
	    if(xhr_object.readyState  == 4) {
			
			var aux = eval('('+xhr_object.responseText+')');
			similarities = aux[part.toString()];
				
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
	

	var canvasContainer = document.getElementById("canvascontainer");
	var nbContext = Object.keys(similarities.context).length;
	var nbNocontext = Object.keys(similarities.nocontext).length;
	
	
	if (document.getElementById("legnocontcanva")!=null){document.getElementById("legnocontcanva").remove();}
	for (var i=0; i<nbCanvas;i++){
			document.getElementById('canvas'+i).remove();
	
	}
	nbCanvas = 0;
	
	//Légend avec context
	if (document.getElementById("legcontcanva")==null){
	var legendContext = document.createElement('canvas');
	legendContext.setAttribute('id','legcontcanva');
	console.log(canvasContainer.clientWidth);
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
		if (nbNocontext!=0 && nbCanvas == nbContext){
		 
			var legend2Context = document.createElement('canvas');
			legend2Context.setAttribute('id','legnocontcanva');
			console.log("no context");
			legend2Context.setAttribute('width',canvasContainer.clientWidth);
			legend2Context.setAttribute('height',canSize/10);
			canvasContainer.appendChild(legend2Context);
		}
		
	}

	var contextKeys = Object.keys(similarities.context);
	var nocontextKeys = Object.keys(similarities.nocontext);
	
	// Draw the shapes on each canvas
	for (var s = 0; s < nbContext + nbNocontext;s++) {
		
		var canToDraw = document.getElementById("canvas" + s);
		var ctxToDraw = canToDraw.getContext('2d');
		
		if (s < nbContext) {

			drawSimilarities(ctxToDraw,9*canSize/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,PartsInfo.parts,part,similarities.context[contextKeys[s]],true);

		} else {
			if (s==nbContext){
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
			drawSimilarities(ctxToDraw,9*canSize/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,PartsInfo.parts,part,similarities.nocontext[nocontextKeys[s-nbContext]],false);

		}

	}

	// Clear the remaining canvas
	for (var s = nbContext + nbNocontext; s < nbCanvas ; s++) {
		var canToDraw = document.getElementById("canvas" + s);
		var ctxToDraw = canToDraw.getContext('2d');
		ctxToDraw.clearRect(0,0,canSize,canSize);

		canToDraw.removeEventListener('mouseenter',highlightCanvas,false);
		canToDraw.removeEventListener('mouseleave',dehighlightCanvas,false);
		canToDraw.removeEventListener('click',handleShapeClick,false);
		
		canToDraw.style = "cursor: default;";
		
	}

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
	//console.log('Comparing')
	//console.log(a1)
	//console.log(a2)
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
	//console.log(res)
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
	var xM = xm;
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
	/*console.log("scale = " + scale);
	console.log("xm = " + xM);
	console.log("ym = " + yM);	
	console.log("xa = " + xA);
	console.log("ya = " + yA);	
	console.log("xb = " + xB);
	console.log("yb = " + yB);	
	console.log("xc = " + xC);
	console.log("yc = " + yC);*/
    return x>=0 && y>=0 && x+y <=1;
}


function highlightParts(e) {
    //console.log('blaff');
    var auxId; 
    if (e.srcElement == null) {
        auxId = e.target.id;
    } else {
        auxId = e.srcElement.id; 
    }    

    var idCanvas = parseInt(auxId);
	//console.log("coucou highlight");
    
	var canvas = document.getElementById(auxId);
	var ctx = canvas.getContext('2d'),
	// Position X du canvas
	rect = canvas.getBoundingClientRect(),
	elemLeft = rect.left,
	// Position Y du canvas
	elemTop = rect.top,
	x,
	y;
	
	//Position X du click (Position X du click sur la page moins la position X du canvas)
	x = e.pageX - elemLeft,
	// Position Y du click (Position Y du click sur la page moins la position Y du canvas)
	y = e.pageY - elemTop;
	//console.log("x = " + x);
	//console.log("y = " + y)
	//console.log(elemLeft);
	//console.log(elemTop)
	//console.log(x);
	var notdisplayed = 1;
	var i = 0;
	var numPart;
	var points = currentShapeInfo.points;
	//console.log(currentShapeInfo.triangles.length)
	while ( i<currentShapeInfo.triangles.length && notdisplayed){
		var currentTriangle = currentShapeInfo.triangles[i];
		//console.log(i);
		//console.log(currentTriangle);
		if (mouseInTriangle(points[currentTriangle.p1].x,points[currentTriangle.p1].y,points[currentTriangle.p2].x,points[currentTriangle.p2].y,points[currentTriangle.p3].x,points[currentTriangle.p3].y,x,y,2*9*canSize/10,canSize/20,canSize/20)==1) {
			numPart = currentPartsInfo.parts[i];
			//console.log(currentPartsInfo.parts[i]);
			notdisplayed = 0;
		}
		i++;
	}
	if (numPart>=0){
		if (numPart!=numPartold){
			numPartold=numPart;
			ctx.clearRect(0,0,2*canSize,2*canSize);
			//drawObject(ctx,2*9*canSize/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,currentPartsInfo.parts);
			//console.log('about to draw part')
			drawObjectParts(ctx,2*9*canSize/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,currentPartsInfo.parts);
	
			drawFilledPart(ctx,9*canSize*2/10,1,canSize/20,canSize/20,points,currentShapeInfo.triangles,currentPartsInfo.parts,currentPartsInfo.hierarchy,numPart);
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
		displayShapeSimilarities(shapeName,numPartold);
	}
}

function displayPartsHighlighted(partsToDisplay) {
	
	//console.log("about to clear");
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
	//console.log(partsToDisplay.split('_'));
	//console.log('coucou');
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
	//console.log("test");					
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

	displayAffinityMatrices(shapeToDisplay);

}