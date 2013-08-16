function Frame(newObjectSets) {
    this.left = newObjectSets[0];
    this.right = newObjectSets[1];
    this.free = newObjectSets[2];
    this.verify();
}

Frame.prototype.objectSets = function() {
    return [this.left, this.right, this.free];
}

// Rotate by _steps_ and/or flip.
// Returns the transformed frame, and the mapping to undo the
// transformation (for use with _relabel_).
Frame.prototype.transform = function(steps, flip) {
    var n = [1,1,1];
    var mapping = [];
    var mappingI = [];

    for (var index = 0; index < 6; ++index) {
	var newIndex = index;
	if (flip != 0) {
	    newIndex = (6 - newIndex) % 6;
	}
	newIndex = (newIndex - steps * 2 + 6) % 6;
	mapping[index] = newIndex;
	mappingI[newIndex] = index;
    }

    return [this.relabel(mapping), mappingI];
}

Frame.prototype.relabel = function(mapping) {
    this.verify();
    var n = [new ObjectSet(), new ObjectSet(), new ObjectSet()];
    for (var i = 0; i < 3; ++i) {
	for (var j = 0; j < 6; ++j) {
	    if (this.objectSets()[i].contains(new ObjectSet([j]))) {
		n[i] = n[i].with(new ObjectSet([mapping[j]]));
	    }
	}
    }
    return new Frame(n);
}

Frame.prototype.toArray = function(toIgnore) {
    return [this.left.toArray(),
	    this.right.toArray(),
	    this.free.without(toIgnore).toArray()];
}

Frame.parse = function(s, history) {
    if (s == "*") {
	return Frame.asterisk(history);
    }
    var wordMeaning = NOTATION[s];
    if (wordMeaning !== undefined) {
	return Frame.parseAction(wordMeaning, history);
    }
    return [Frame.parseState(s)];
}

Frame.prototype.verify = function() {
    var combined = this.right.with(this.left).with(this.free);
    if (!combined.equals(ObjectSet.ALL) ||
       this.right.indices.length +
	this.left.indices.length +
	this.free.indices.length != 6) {
	throw "Invalid string.";
    }
}

Frame.asterisk = function(history) {
    var flippedFrames = [];
    for (var i = 0; i < history.length; ++i) {
	flippedFrames.push(new Frame([
	    history[i].right, history[i].left, history[i].free]));
    }

    var newFrames = [];
    var currentFrame = history.last();
    for (var i = 0; i < flippedFrames.length - 1; ++i) {
	currentFrame = Frame.applyControlSequence(
	    currentFrame, flippedFrames[i], flippedFrames[i+1]);
	newFrames.push(currentFrame);
    }

    return newFrames;
}

// Parses a string in action description form into a Frame object.
// An example input would be "RotateLeft".
Frame.parseAction = function(string, history) {
    var controlSequence = new Sequence(string);
    var currentFrame = null;
    var newFrames = [];

    if (history.length > 0) {
	currentFrame = history.last();
    } else {
	currentFrame = controlSequence.frames[0];
	newFrames.push(currentFrame);
    }

    for (var i = 0; i < controlSequence.frames.length - 1; ++i) {
	var mapFrom = controlSequence.frames[i];
	var mapTo = controlSequence.frames[i + 1];
	currentFrame = Frame.applyControlSequence(currentFrame, mapFrom, mapTo);
	newFrames.push(currentFrame);
    }
    return newFrames;
}

// Checks if the object sets of the two frames are equal.
Frame.prototype.objectSetsEqual = function(o) {
    return this.left.equals(o.left) &&
	this.right.equals(o.right) &&
	this.free.equals(o.free);
}

Frame.applyControlSequence = function (start, mapFrom, mapTo) {
    mapTo.verify();

    var allFramesSeq = new Sequence([start, mapFrom, mapTo]);
    var lStart = start;
    var lMapFrom = mapFrom;
    var lMapTo = mapTo;

    var flip = 0;
    for (var flip = 0; flip < 2; ++flip) {
	for (var i = 0; i < 3; ++i) {
	    var transformedStart = lStart;
	    var transformation = transformedStart.transform(i, flip);
	    transformedStart = transformation[0];
	    var mappingI = transformation[1];
	    if (transformedStart.objectSetsEqual(lMapFrom)) {
		return lMapTo.relabel(mappingI);
	    }
	}
    }

    throw "Operation applied to non-matching initial state";
}

// Parses a string in state description form into a Frame object.
// An example input would be "A:B".
Frame.parseState = function(s) {
    var strings = s.split(":");
    if (strings.length > 2) {
	throw("Frame appears to specify more than two hands");
    }
    var objectSets = [];
    for (var i = 0; i < 2; ++i) {
	if (i < strings.length) {
	    objectSets.push(new ObjectSet(strings[i]));
	} else {
	    objectSets.push(new ObjectSet());
	}
    }

    // Any undescribed objects are considered free.
    objectSets[2] = ObjectSet.ALL.without(objectSets[0]).without(objectSets[1]);
    var result = new Frame(objectSets);
    return result;
}

// Sorts an array of indices representing objects such that adjacent
// objects are adjacent, and the order is increasing.
Frame.sortIndices = function(ar) {
    ar.sort();

    if (ar.length == 6) {
	return ar;
    }

    var dict = [];
    for (var i = 0; i < ar.length; ++i) {
	dict[ar[i]] = ar[i];
    }

    var numUndefinedBefore = [0,0,0,0,0,0];
    var undefinedCount = 0;
    // Go through twice to handle wrap around.
    for (var i = 0; i < 12; ++i) {
	if (dict[i % 6] !== undefined) {
	    numUndefinedBefore[i % 6] = undefinedCount;
	    undefinedCount = 0;
	} else {
	    undefinedCount++;
	}
    }

    var runStart = numUndefinedBefore.indexOf(
	Math.max.apply(Math, numUndefinedBefore));

    var runEnd = (runStart + 6 - numUndefinedBefore[runStart]) % 6;

    var result = [];
    for (var i = runStart; i != runEnd; i = (i + 1) % 6) {
	if (dict[i] !== undefined) {
	    result.push(dict[i]);
	}
    }
    if (result.length != ar.length) {
	throw("Internal error in sortIndices");
    }
    return result;
}

// returns [dist, flipped].
Frame.computeIndexDistance = function(x, y) {
    var distNormal = (x - y + 6) % 6;
    var distSwitched = (12 - distNormal) % 6;
    var dist = Math.min(distNormal, distSwitched);
    var flipped = distSwitched > distNormal;
    return [dist, flipped]
}

// Takes array format: for example ([id1, id2, id3], ...);
// Returns 2 lists, [between, free].
Frame.sortBetween = function(bound1, bound2, free){
    var closestDistance = 10000;
    var closest = [];

    for (var i = 0; i < bound1.length; ++i) {
	for (var j = 0; j < bound2.length; ++j) {
	    var c = [bound1[i], bound2[j]];
	    c.sort();
	    var dist = Frame.computeIndexDistance(c[0], c[1]);
	    if (dist[0] < closestDistance && dist[0] != 0) {
		if (dist[1]) {
		    c[0] += 6;
		    c.sort();
		}
		closestDistance = dist[0];
		closest = c;
	    }
	}
    }

    var between = [];
    var newFree = [];
    for (var i = 0; i < free.length; ++i) {
	var ind = free[i];
	if ((closest[0] < ind && ind < closest[1]) ||
	    (closest[0] < ind + 6 && ind + 6 < closest[1])) {
	    between.push(free[i]);
	} else {
	    newFree.push(free[i]);
	}
    }
    return [between, newFree];
}

// Returns 6 lists, [left, between, right, betweenRight, free, betweenLeft].
// Adjacent objects in these lists are adjacent, and _between_ is no
// longer than _free_.
Frame.splitForDraw = function(left, right, free) {
    var splitLR = Frame.sortBetween(left, right, free);
    var ar = [left, splitLR[0], right, splitLR[1]];

    var last = null;

    ar = ar.map(function(x) {
	return Frame.sortIndices(x);
    });

    for (var i = 0; i < ar.length; ++i) {
	var dist = Frame.computeIndexDistance(last, ar[i][0])[0];

	if (last != null && dist > 1) {
	    ar[i-1].reverse();
	}

	dist = Frame.computeIndexDistance(last, ar[i][0])[0];
	if (dist > 1) {
	    // Can't get it to work, we must be completely backwards.
	    ar = ar.map(function(x) {
		return x.reverse();
	    });
	}

	if (ar[i] != null && ar[i].last() != null) {
	    last = ar[i].last();
	}
    }

    var splitLL = Frame.sortBetween(ar[0], ar[0], ar[3]);
    var splitRR = Frame.sortBetween(ar[2], ar[2], splitLL[1]);

    return [ar[0], ar[1], ar[2], splitRR[0], splitRR[1], splitLL[0]];
}
