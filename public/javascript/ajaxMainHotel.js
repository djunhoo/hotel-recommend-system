function onclickFunction(aId) {
    $.ajax({
        type: "POST",
        url: "/",
        data: {
            location: aId
        },
        success: function(data) {
            console.log('dat=', data);
            $(".tab-content").remove();
            var webtoonData = data.hotels;
            $("#tab-card").append("<div class='tab-content'><div class='row' id='row-content'></div></div>");
            webtoonData.forEach(function(hotel) {
                $("#row-content").append("<div class='col-xs-3'><div class='card' id='webtoon_card'><a class='img-card' href='/hotel/" + hotel._id + "'><img src='" + hotel.mainImg + "'/></a><div class='card-content'><h4 class='card-title'><a href='#'>" + hotel.name + "</a></h4><div class=''>" + hotel.address + "</div></div><div class='card-read-more'><a class='btn btn-link btn-block' href='/hotel/" + hotel._id + "'>더 보기</a></div></div></div>");
            });
        },
        error: function(xhr, ajaxOptions, thrownError) {

        }
    });
    return false;
}
