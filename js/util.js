Array.prototype.last = function() {
    return this[this.length-1];
}

// These are super slow, but they're being applied to arrays of length <= 6.
Array.prototype.union = function(a) {
    return this.concat(a.remove(this));
}

Array.prototype.remove = function(a) {
    return this.filter(function(x) {
	return a.indexOf(x) < 0;
    });
}

Array.prototype.intersect = function(a) {
    return this.filter(function(x) {
	return a.indexOf(x) >= 0;
    });
}
