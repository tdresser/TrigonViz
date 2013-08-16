test( "Union", function() {
    deepEqual([2,4,3].union([1,2,6]), [2,4,3,1,6]);
});

test( "Remove", function() {
    deepEqual([2,4,3].remove([1,2,6]), [4,3]);
});

test( "Intersect", function() {
    deepEqual([2,4,3,6].intersect([1,2,6]), [2,6]);
});
