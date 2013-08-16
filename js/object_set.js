function ObjectSet(p) {
    var INDEX_TO_STRING = ["A","c","B","a","C","b"];

    ObjectSet.indexToString = function(x) {
	return INDEX_TO_STRING[x];
    }

    ObjectSet.stringToIndex = function(x) {
	return INDEX_TO_STRING.indexOf(x);
    }

    this.indices = [];

    if (p != null) {
	if (typeof(p) == "string") {
	    this.indices = p.split("").map(ObjectSet.stringToIndex);
	} else {
	    this.indices = p;
	}
    }
}

ObjectSet.prototype.with = function(o) {
    return new ObjectSet(this.indices.union(o.indices));
}

ObjectSet.prototype.without = function(o) {
    return new ObjectSet(this.indices.remove(o.indices));
}

// Inefficient, but the length is <= 6.
ObjectSet.prototype.equals = function(o) {
    return this.indices.sort().join(",") == o.indices.sort().join(",");
}

ObjectSet.prototype.toArray = function(s) {
    return this.indices.sort();
}

ObjectSet.prototype.contains = function(o) {
    return this.indices.intersect(o.indices).length == o.indices.length;
}

ObjectSet.VERTICES = new ObjectSet([0,2,4]);
ObjectSet.EDGES = new ObjectSet([1,3,5]);
ObjectSet.ALL = new ObjectSet([0,1,2,3,4,5]);
