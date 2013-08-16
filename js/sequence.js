function Sequence(i) {
    if (typeof i == "string") {
	this.frames = this.parse(i);
    } else {
	this.frames = i;
    }
}

Sequence.prototype.parse = function(string) {
    var frameStrings = string.split(/[, ]+/);

    // It's ok if there's no separator before the *.
    if (frameStrings.last().slice(-1) == "*" && frameStrings.last() != "*") {
	frameStrings[frameStrings.length - 1] = frameStrings.last().slice(0, -1);
	frameStrings.push("*");
    }
    var frames = [];
    for (var i = 0; i < frameStrings.length; ++i) {
	var newFrames = Frame.parse(frameStrings[i], frames);
	frames = frames.concat(newFrames);
    }

    if (frames.indexOf(null) > -1) {
	throw "Not a valid string";
    }

    return frames;
}

// Ignore vertices or edges if they are completely undescribed.
// Returns an ObjectsSet indicating what should be ignored.
Sequence.prototype.getToIgnore = function() {
    var seenVertices = false;
    var seenEdges = false;

    for (var i = 0; i < this.frames.length; ++i) {
	if (!this.frames[i].free.contains(ObjectSet.VERTICES)) {
	    seenVertices = true;
	}

	if (!this.frames[i].free.contains(ObjectSet.EDGES)) {
	    seenEdges = true;
	}
    }

    if (seenVertices && seenEdges) {
	return new ObjectSet();
    } else if (seenVertices) {
	return ObjectSet.EDGES;
    } else if (seenEdges) {
	return ObjectSet.VERTICES;
    } else {
	return ObjectSet.EDGES;
    }
}

Sequence.prototype.toArray = function(){
    return this.frames.map(function(x) {
	x.verify();
	return x.toArray(this.getToIgnore());
    }, this);
}

Sequence.prototype.toString = function() {
    return this.toArray().map(function(x) {
	return x.slice(0, -1).map(ObjectSet.indexToString).join(":");
    }).join(",");
}
