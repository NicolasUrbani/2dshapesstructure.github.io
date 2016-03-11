var labels;

var nbCanvas;

var selectedLabel;
var shapenames;

var currentShapeInfo;

var annotations;

function doLoad() {
	
	nbCanvas = 0;

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
					if (k<35) {
						container.appendChild(auxButton);
					} else {
						container2.appendChild(auxButton);
					}
				}
				
	     }
	}; 
	xhr_object.send(null);

	hideElement('BackButton');
	var backButton = document.getElementById('BackButton');
	backButton.addEventListener('click',backToShapeCategory,false);
} 


function handleClickCategory(e) {
	
	hideElement('BackButton');
	var aux = e.srcElement.id;
	
	selectedLabel = aux.split('Button')[0];


	// Fetch the shapes name of these selected Label
	var xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/ShapeNames/"+selectedLabel+".json",false);
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
	}
	
	// Draw the shapes on each canvas
	for (var s = 0; s < shapenames.length;s++) {

		xhr_object=new XMLHttpRequest();
		xhr_object.open("GET","JSON/Shapes/"+shapenames[s]+".json",false);
		xhr_object.onreadystatechange  = function() { 
			 if(xhr_object.readyState  == 4) {

					var aux = eval('('+xhr_object.responseText+')');

					var canToDraw = document.getElementById("canvas" + s);
					var ctxToDraw = canToDraw.getContext('2d');
					drawObject(ctxToDraw,9*canSize/10,1,canSize/20,canSize/20,aux.points);
				
					
					canToDraw.addEventListener('mouseenter',highlightCanvas,false);
					canToDraw.addEventListener('mouseleave',dehighlightCanvas,false);
					canToDraw.addEventListener('click',handleShapeClick,false);
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

}


function highlightCanvas(e) {

	var auxId = e.srcElement.id;
	var idCanvas = parseInt(auxId.split('canvas')[1]);

	if (idCanvas < shapenames.length) {
		var canvas = document.getElementById(e.srcElement.id);
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
	var canvas = document.getElementById(e.srcElement.id);
	var ctx = canvas.getContext('2d');
	ctx.strokeStyle = "white";
	ctx.lineWidth = 6;
	ctx.strokeRect(0,0,canSize,canSize);

	var currentdisplay = document.getElementById('currentdisplay');
	currentdisplay.innerHTML = selectedLabel;
	
}


function handleShapeClick(e) {
	var auxId = e.srcElement.id;
	var idCanvas = parseInt(auxId.split('canvas')[1]);

	if (idCanvas < shapenames.length) {
		var shapeToDisplay = shapenames[idCanvas];
		displayShapeAnnotations(shapeToDisplay);
		
	}
}


function displayShapeAnnotations(shapeToDisplay) {
	
	displayElement('BackButton');

	// Fetch the shapes name of these selected Label
	var xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/Annotations/"+shapeToDisplay+".json",false);
	annotations = null;
	xhr_object.onreadystatechange  = function() { 
	     if(xhr_object.readyState  == 4) {

				var aux = eval('('+xhr_object.responseText+')');
				annotations = aux.annotations;
				
	     }
	}; 
	xhr_object.send(null);

	xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/Shapes/"+ shapeToDisplay +".json",false);
	xhr_object.onreadystatechange  = function() { 
		 if(xhr_object.readyState  == 4) {

				currentShapeInfo = eval('('+xhr_object.responseText+')');
			
		 }
	}; 
	xhr_object.send(null);
	

	var canvasContainer = document.getElementById("canvascontainer");

	// Update the number of canvas
	while (nbCanvas < annotations.length) {
		// Create new canvases to meet the requirements
		var auxCanvas = document.createElement('canvas');
		auxCanvas.setAttribute('id','canvas'+nbCanvas);
		auxCanvas.setAttribute('width',canSize);
		auxCanvas.setAttribute('height',canSize);
		nbCanvas++;
		canvasContainer.appendChild(auxCanvas);
	}
	
	// Draw the shapes on each canvas
	for (var s = 0; s < annotations.length;s++) {

		var canToDraw = document.getElementById("canvas" + s);
		var ctxToDraw = canToDraw.getContext('2d');
		drawFilledObject(ctxToDraw,9*canSize/10,1,canSize/20,canSize/20,currentShapeInfo.points,currentShapeInfo.triangles,annotations[s]);

		
		canToDraw.removeEventListener('mouseenter',highlightCanvas,false);
		canToDraw.removeEventListener('mouseleave',dehighlightCanvas,false);
		canToDraw.removeEventListener('click',handleShapeClick,false);

	}

	// Clear the remaining canvas
	for (var s = annotations.length; s < nbCanvas ; s++) {
		var canToDraw = document.getElementById("canvas" + s);
		var ctxToDraw = canToDraw.getContext('2d');
		ctxToDraw.clearRect(0,0,canSize,canSize);

		canToDraw.removeEventListener('mouseenter',highlightCanvas,false);
		canToDraw.removeEventListener('mouseleave',dehighlightCanvas,false);
		canToDraw.removeEventListener('click',handleShapeClick,false);
	}

}

function backToShapeCategory() {
	hideElement('BackButton');
	displayShapeCategory();
}
