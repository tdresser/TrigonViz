function Drawer(cwidth, height) {
    this.FONT_SIZE = 0.17;
    this.MARGIN = Math.round(0.1 * height);
    this.GAP = Math.round(0.5 * height);
    this.BORDER_WIDTH = Math.round(0.03 * height);
    this.height = height;
    this.cwidth = cwidth;
}

Drawer.prototype.drawFrame = function(frame, startX, startY, ctx, h) {
    var POSITIONS_Y = [this.FONT_SIZE*0.7,
		       this.FONT_SIZE*0.7,
		       this.FONT_SIZE*0.7,
		       1,
		       1,
		       1];

    frame = Frame.splitForDraw(frame[0], frame[1], frame[2]);
    for (var j = 3; j < 6; ++j) {
	frame[j].reverse(); // Bottom needs to display backwards.
    }

    for (var j = 0; j < frame.length; ++j) {
	var text = frame[j].map(ObjectSet.indexToString).join("");
	var textWidth = ctx.measureText(text).width;
	var x = startX;
	if (j == 0 || j == 5) {
	    x += textWidth / 2;
	} else if (j == 1 || j == 4) {
	    x += 0.5 * h;
	} else {
	    x += h - textWidth / 2;
	}
	var y = startY + h * POSITIONS_Y[j];
	ctx.fillText(text, x, y);
    }
}

Drawer.prototype.drawSequence = function(sequence, canvas){
    if (!canvas.getContext){
	throw "Error drawing to screen";
    }

    var ctx = canvas.getContext('2d');
    var height = this.height;

    var sequence_array = sequence.toArray();

    var framesPerRow = Math.floor((this.cwidth - height) / (height + this.GAP)) + 1;
    var numRows = Math.ceil(sequence.frames.length / framesPerRow);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = (Math.min(framesPerRow, sequence_array.length) - 1) *
	(height + this.GAP) + height + this.BORDER_WIDTH * 2 + this.MARGIN * 2;
    canvas.height = numRows * (height + this.MARGIN * 2) + this.BORDER_WIDTH * 2;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = "#333333";
    ctx.font= height*this.FONT_SIZE + "px Arial";

    var xBase = this.BORDER_WIDTH + this.MARGIN;
    var yBase = this.MARGIN;
    for (var i = 0; i < sequence_array.length; ++i) {
	var frame = sequence_array[i];
	var x = xBase + (i % framesPerRow) * (height + this.GAP);
	var y = yBase + Math.floor(i / framesPerRow) * (height + 2 * this.MARGIN);
	this.drawFrame(frame, x, y, ctx, height);
    }

    // Outline.
    ctx.beginPath();
    ctx.rect(this.BORDER_WIDTH / 2, this.BORDER_WIDTH / 2,
	     canvas.width - this.BORDER_WIDTH,
	     canvas.height - this.BORDER_WIDTH);
    ctx.lineWidth = this.BORDER_WIDTH;
    ctx.strokeStyle = '#333333';
    ctx.stroke();

    // Divider.
    for (var i = 1; i < numRows; ++i) {
	var y = yBase + i * (height + this.MARGIN * 2) -
	    this.MARGIN + this.FONT_SIZE * height / 3.3;
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#ccc';
	ctx.beginPath();
	ctx.moveTo(this.MARGIN, y);
	ctx.lineTo(canvas.width - this.MARGIN, y);
	ctx.stroke();
    }
}
