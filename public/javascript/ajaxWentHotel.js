function goLogin() {
    location.href="/users/login";
}

function onclickFunction(aId) {
    $.ajax({
        type: "POST",
        url: "/users/hotel/went",
        data: {
            hotel_id: aId
        },
        success: function(data) {
            var user = data.user;
            var hotelMap = new Map();
            user.wentHotel.forEach(function(userToon) {
                hotelMap.set(userToon.name, userToon);
            });

            console.log('data.webtoon=', data.hotel.name);
            var checkWebtoon = hotelMap.get(data.hotel.name);
            if(checkWebtoon) {
                var location = $("#read").attr('href');
                $("#read").removeAttr('href');
                $("#read").addClass('disabled');
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            goLogin();
        }
    });
    return false;
}
