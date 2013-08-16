test( "Parse Basic States", function() {
    var seq = new Sequence("A:B,B:C");
    var str = seq.toString();
    equal(str, "A:B,B:C");
});

test( "Parse Basic States - Check Free", function() {
    var seq = new Sequence("A:B,B:C");
    var str = seq.toString();
    equal(str, "A:B,B:C");
    deepEqual(seq.frames[0].free.indices, [1,3,4,5]);
    deepEqual(seq.frames[1].free.indices, [0,1,3,5]);
});

test( "Parse Basic States - All Free", function() {
    var seq = new Sequence(":");
    var ar = seq.toArray();
    deepEqual(ar[0][2], [0,2,4]);
});

test( "Parse Basic Actions", function() {
    var seq = new Sequence("RotateRight, PivotRight");
    var str = seq.toString();
    equal(str, "A:B,C:A,B:A");
});

test( "Asterisk", function() {
    var seq = new Sequence("RotateRight, PivotRight*");
    var str = seq.toString();
    equal(str, "A:B,C:A,B:A,A:C,A:B");
});

test( "Parse Without Specifying Free", function() {
    var seq = new Sequence("A:B");
    var frame = seq.toArray()[0];
    equal(frame[2], ObjectSet.stringToIndex("C"));
});

test( "Check Left is left", function() {
    var seq = new Sequence("A:B");
    deepEqual(seq.frames[0].left.indices, [0]);
    deepEqual(seq.frames[0].right.indices, [2]);
});

test( "Sort All", function() {
    equal(Frame.sortIndices([1,2,0,3,4,5]).join(","), [0,1,2,3,4,5].join(","));
});

test( "SplitForDraw simple case", function() {
    var split = Frame.splitForDraw([0], [2], [4,3,1,5]);
    var splitString = split.map(function(x) {return x.join("")}).join("");
    equal(splitString, "012345");
});

test( "SplitForDraw with reversed first element", function() {
    var seq = new Sequence("Ac:b");
    var frame = seq.toArray()[0];
    var split = Frame.splitForDraw(frame[0], frame[1], frame[2]);
    var splitString = split.map(function(x) {return x.join("")}).join("");
    equal(splitString, "105432");
});

test( "Sort Between", function() {
    var s = [0,2];
    var r = Frame.sortBetween(s, s, [1,3,4,5]);
    equal(r[0][0], 1);
});
