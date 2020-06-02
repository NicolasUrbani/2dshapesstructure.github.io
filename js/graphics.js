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
