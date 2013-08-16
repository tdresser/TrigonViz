function containerWidth() {
    return $(".content").width();
}

function getFrameHeight() {
    return Math.max(75, containerWidth() / 4.25);
}

function trigonViz() {
    var drawer = new Drawer(containerWidth(), getFrameHeight());

    $(".trigonviz").each(function(i) {
	var text = $(this).text();
	var sequence = new Sequence(text);

	var id = "trigonViz" + i;
	var canvas = $('<canvas/>', {'id':id});
	$(this).append(canvas);

	drawer.drawSequence(sequence, canvas.get(0));
    });
}

function drawUrlEntered() {
    var text = unescape(location.search.slice(1));
    if (text.length > 0) {
	$("#pattern_textbox").val(text);
    }
    drawUserEntered();
}

function drawUserEntered() {
    var textBox = $("#pattern_textbox");
    var drawer = new Drawer(containerWidth(), getFrameHeight());
    $("#trigonviz_form").removeClass("error");
    $("#message").text("");
    try {
	var sequence = new Sequence(textBox.val());
	drawer.drawSequence(sequence, $("#canvas").get(0));
    } catch (err) {
	$("#message").text(err);
	$("#trigonviz_form").addClass("error");
    }
}
