$('#next').hover(function() {
    $('.entypo-right-open-big').addClass('animnext');
}, function() {
    $('.entypo-right-open-big').removeClass('animnext');
});

$('#previous').hover(function() {
    $('.entypo-left-open-big').addClass('animprev');
}, function() {
    $('.entypo-left-open-big').removeClass('animprev');
});

$('#heart').hover(function() {
    $('.entypo-heart').addClass('animheart');
}, function() {
    $('.entypo-heart').removeClass('animheart');
});

$(function() {
    $('#next').hover(function() {
        $('#slides').css('left', '-490px');
    }, function() {
        // on mouseout, reset the background colour
        $('#slides').css('left', '0px');
    });
});
