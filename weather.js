$(document).ready(function () {

    console.log(moment().format('LT'));
    $(".hour").text(moment().format('dddd LT'));
    $(".date").text(moment().format('MMMM DD YYYY'));
    var APIKey = "c9a4470d4efaf75504fc4a5aa2627f1f";
    var locationArray = [];

    $("#searchBTN1").on("click", function () {
        var location = $("#locationInput").val().trim();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&APPID=" + APIKey + "&units=imperial";

        console.log(location);
        $.ajax({
            url: queryURL,
            method: "GET"
        })

            .then(function (response) {
                console.log(response);

            });

    })
    $("#searchBTN2").on("click", function () {
        var location = $("#locationInput").val().trim();
        var fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&appid=" + APIKey + "&units=imperial";

        console.log(location);
        $.ajax({
            url: fiveDayQueryURL,
            method: "GET"
        })

            .then(function (response) {
                console.log(response);

            });

    })
});
