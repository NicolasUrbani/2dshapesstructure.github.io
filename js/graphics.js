var canSize = 200;

var colors = ['black','magenta','green','red'];

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

		ctxToDraw.stroke();	
	}
}

function drawObjectParts(ctxToDraw,scale,width,offX,offY,points,triangles,parts) {

	ctxToDraw.strokeStyle = 'black';
	ctxToDraw.lineWidth = width;
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
