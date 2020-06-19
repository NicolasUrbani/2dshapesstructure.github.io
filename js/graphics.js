var canSize = 200;

var colors = ['black','magenta','green','red','blue'];

function drawObject(ctxToDraw,scale,width,offX,offY,points) {


	ctxToDraw.strokeStyle = 'black';
	ctxToDraw.lineWidth = width;
	ctxToDraw.clearRect(0,0,canSize,canSize);
	
	
	ctxToDraw.beginPath();
	ctxToDraw.moveTo(scale*points[0].x+offX,scale*points[0].y+offY);
	for (var i=1; i<points.length;i++) {
		ctxToDraw.lineTo(scale*points[i].x+offX,scale*points[i].y+offY);
	}
	ctxToDraw.lineTo(scale*points[0].x+offX,scale*points[0].y+offY);
	ctxToDraw.stroke();
	ctxToDraw.closePath();	

}

function numPart(parts) {

	max = 0;

	for(var i=0; i<parts.length; i++) {
		if (parts[i] > max){
			max = parts[i];
		}
	}

	return max;
}

function trianglesFromPart(triangles,parts,part) {

	trianglesPart = [];

	for(var i=0; i<parts.length; i++) {
		if (parts[i] == part){
			trianglesPart.push(triangles[i]);
		}
	}

	return trianglesPart;

}

function isInteriorLine(p1,p2,trianglesPart,numTriangle) {

	for (var t=0; t<trianglesPart.length; t++) {

		if (numTriangle != t) {

			var triangle = trianglesPart[t];

			if   (((p1==triangle.p1) && (p2==triangle.p2)) 
				||((p1==triangle.p2) && (p2==triangle.p3))
				||((p1==triangle.p3) && (p2==triangle.p1))
				||((p1==triangle.p2) && (p2==triangle.p1))
				||((p1==triangle.p3) && (p2==triangle.p2))
				||((p1==triangle.p1) && (p2==triangle.p3))) {

					return true;

			}
		}
	}

	return false;

}

function drawPart(ctxToDraw,scale,width,offX,offY,points,trianglesPart) {

	ctxToDraw.strokeStyle = 'black';
	ctxToDraw.lineWidth = width;

	for (var t=0; t< trianglesPart.length; t++) {

		var triangle = trianglesPart[t];

		if (!isInteriorLine(triangle.p1,triangle.p2,trianglesPart,t)) {
			ctxToDraw.beginPath();
			ctxToDraw.moveTo(scale*points[trianglesPart[t].p1].x+offX,scale*points[trianglesPart[t].p1].y+offY);
			ctxToDraw.lineTo(scale*points[trianglesPart[t].p2].x+offX,scale*points[trianglesPart[t].p2].y+offY);
			ctxToDraw.stroke();
		}

		if (!isInteriorLine(triangle.p2,triangle.p3,trianglesPart,t)) {
			ctxToDraw.beginPath();
			ctxToDraw.moveTo(scale*points[trianglesPart[t].p2].x+offX,scale*points[trianglesPart[t].p2].y+offY);
			ctxToDraw.lineTo(scale*points[trianglesPart[t].p3].x+offX,scale*points[trianglesPart[t].p3].y+offY);
			ctxToDraw.stroke();
		}

		if (!isInteriorLine(triangle.p3,triangle.p1,trianglesPart,t)) {
			ctxToDraw.beginPath();
			ctxToDraw.moveTo(scale*points[trianglesPart[t].p3].x+offX,scale*points[trianglesPart[t].p3].y+offY);
			ctxToDraw.lineTo(scale*points[trianglesPart[t].p1].x+offX,scale*points[trianglesPart[t].p1].y+offY);
			ctxToDraw.stroke();
		}

	}
}

function drawObjectParts(ctxToDraw,scale,width,offX,offY,points,triangles,parts) {

	ctxToDraw.clearRect(0,0,canSize,canSize);

	var n = numPart(parts);

	for (var p=0; p<n; p++) {

		var trianglesPart = trianglesFromPart(triangles,parts,p+1);	
		drawPart(ctxToDraw,scale,width,offX,offY,points,trianglesPart);

	}

}

function drawFilledObject(ctxToDraw,scale,width,offX,offY,points,triangles,annot) {

	drawObject(ctxToDraw,scale,width,offX,offY,points);

	for (var t=0;t<triangles.length;t++) {
		fillTriangle(ctxToDraw,t,scale,offX,offY,annot[t],points,triangles);
	}


}

function drawSimilarities(ctxToDraw,scale,width,offX,offY,points,triangles,parts,part,similarities,context) {

	drawObjectParts(ctxToDraw,scale,width,offX,offY,points,triangles,parts);

	var trianglesPart = trianglesFromPart(triangles,parts,part);
	for(var t=0; t<trianglesPart.length; t++) {
		fillTriangle(ctxToDraw,t,scale,offX,offY,3,points,trianglesPart);
		drawPart(ctxToDraw,scale,width,offX,offY,points,trianglesPart);
	}

	if (Array.isArray(similarities)) {
		for (var s=0;s<similarities.length;s++) {
			trianglesPart = trianglesFromPart(triangles,parts,similarities[s]);
			var color = 2;
			if (!context) {
				color = 4
			}
			for(var t=0; t<trianglesPart.length; t++) {
				fillTriangle(ctxToDraw,t,scale,offX,offY,color,points,trianglesPart);
				drawPart(ctxToDraw,scale,width,offX,offY,points,trianglesPart);
			}
		}
	} else {
		if (similarities != "-1") {
			trianglesPart = trianglesFromPart(triangles,parts,similarities);
			var color = 2;
			if (!context) {
				color = 4
			}
			for(var t=0; t<trianglesPart.length; t++) {
				fillTriangle(ctxToDraw,t,scale,offX,offY,color,points,trianglesPart);
				drawPart(ctxToDraw,scale,width,offX,offY,points,trianglesPart);
			}
		}
	}	

}

function drawSimilaritiesInter(ctxToDraw,scale,width,offX,offY,points,triangles,parts,similarities) {

	drawObjectParts(ctxToDraw,scale,width,offX,offY,points,triangles,parts);

	if (Array.isArray(similarities)) {
		for (var s=0;s<similarities.length;s++) {
			trianglesPart = trianglesFromPart(triangles,parts,similarities[s]);
			var color = 4;
			for(var t=0; t<trianglesPart.length; t++) {
				fillTriangle(ctxToDraw,t,scale,offX,offY,color,points,trianglesPart);
				drawPart(ctxToDraw,scale,width,offX,offY,points,trianglesPart);
			}
		}
	} else {
		trianglesPart = trianglesFromPart(triangles,parts,similarities);
		var color = 4;
		for(var t=0; t<trianglesPart.length; t++) {
			fillTriangle(ctxToDraw,t,scale,offX,offY,color,points,trianglesPart);
			drawPart(ctxToDraw,scale,width,offX,offY,points,trianglesPart);
		}
	}	

}

function fillTriangle(ctxToDraw,t,scale,offX,offY,col,points,triangles) {
	
	ctxToDraw.fillStyle = colors[col];
	ctxToDraw.strokeStyle = colors[col];
	
	ctxToDraw.beginPath();
	
	ctxToDraw.moveTo(scale*points[triangles[t].p1].x+offX,scale*points[triangles[t].p1].y+offY);
	ctxToDraw.lineTo(scale*points[triangles[t].p2].x+offX,scale*points[triangles[t].p2].y+offY);
	ctxToDraw.lineTo(scale*points[triangles[t].p3].x+offX,scale*points[triangles[t].p3].y+offY);
	ctxToDraw.lineTo(scale*points[triangles[t].p1].x+offX,scale*points[triangles[t].p1].y+offY);
	ctxToDraw.stroke();
	ctxToDraw.fill();
	ctxToDraw.closePath();

}

function displayElement(idElement) {
	var aux = document.getElementById(idElement);
	aux.style = "display:inline-block;"
}

function hideElement(idElement) {
	var aux = document.getElementById(idElement);
	aux.style = "display:none;"
}

function drawFilledPart(ctxToDraw,scale,width,offX,offY,points,triangles,parts,hierarchy,numPart) {
	
    for (var t=0;t<triangles.length;t++) {
        if (parts[t]==numPart){
            fillTriangle(ctxToDraw,t,scale,offX,offY,hierarchy[t],points,triangles);/////
			
        }
    }    
	drawPart(ctxToDraw,scale,width,offX,offY,points,trianglesFromPart(triangles,parts,numPart));


}

function drawHighlightedColumn(ctxToDraw,scale,width,offX,offY,size,numCol) {

	ctxToDraw.strokeStyle = 'gold';
	ctxToDraw.lineWidth = width;

	ctxToDraw.beginPath();
	ctxToDraw.moveTo(offX+size*numCol, offY);
	ctxToDraw.lineTo(offX+size*(numCol+1), offY);
	ctxToDraw.lineTo(offX+size*(numCol+1), offY+scale);
	ctxToDraw.lineTo(offX+size*numCol, offY+scale);
	ctxToDraw.lineTo(offX+size*numCol, offY);
	ctxToDraw.stroke();
	ctxToDraw.closePath();
}

function drawColorbar(ctxColorbar) {	
	let lineaire = ctxColorbar.createLinearGradient(0, 0, canSize, 0);//vrai largeur
	lineaire.addColorStop(0.5,'rgb(0,255,0)'); //Vert
	lineaire.addColorStop(0, 'rgb(0,0,255)'); //Bleu
	lineaire.addColorStop(1, 'rgb(255,0,0)'); //Rouge

	ctxColorbar.fillStyle = lineaire;
	ctxColorbar.fillRect(0, 0, canSize, canSize/20); 
	
	ctxColorbar.fillStyle = "black";
	ctxColorbar.font = "12pt Calibri,Geneva,Arial";
	ctxColorbar.fillText('Low',0,5*canSize/40);
	ctxColorbar.fillText('High',8.25*canSize/10,5*canSize/40);
}

function drawAffinityMatrix(ctxToDraw,scale,width,offX,offY,matrix,bool) {	

	ctxToDraw.clearRect(0,0,canSize,canSize);
	if (bool) {

		var n = matrix.length;
		var size = scale / n;

		for (var i=0; i<n; i++){
			for (var j=0; j<n; j++){
				
				var x = matrix[i][j];
				var red = 0, green = 0, blue = 0;

				if (x<=0.5) {
					blue = 1-2*x;
					green = 1-blue;
				} else {
					red = 2*x-1;
					green = 1-red;
				}

				red = Math.round(255 * red);
				green = Math.round(255 * green);
				blue = Math.round(255 * blue);

				ctxToDraw.fillStyle = 'rgb(' + parseInt(red,10) + ',' + parseInt(green,10) + ',' + parseInt(blue,10) + ')';
				ctxToDraw.strokeStyle = 'rgb(' + parseInt(red,10) + ',' + parseInt(green,10) + ',' + parseInt(blue,10) + ')';

				ctxToDraw.fillRect(offX+j*size,offY+i*size,size,size);
			}
		}
		
		ctxToDraw.strokeStyle = 'black';
		ctxToDraw.lineWidth = width;

		ctxToDraw.beginPath();
		ctxToDraw.moveTo(offX, offY);
		ctxToDraw.lineTo(offX+scale, offY);
		ctxToDraw.lineTo(offX+scale, offY+scale);
		ctxToDraw.lineTo(offX, offY+scale);
		ctxToDraw.lineTo(offX, offY);
		ctxToDraw.stroke();
		ctxToDraw.closePath();
	} else {
		ctxToDraw.fillStyle = "black";
		ctxToDraw.font = "26pt Calibri,Geneva,Arial";
		ctxToDraw.fillText('N/A',2.7/4*canSize/2,4.5/4*canSize/2);
	}
}