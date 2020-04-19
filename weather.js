window.onload = function () {
    $(".hour").text(moment().format('dddd LT'));
    $(".date").text(moment().format('MMMM DD YYYY'));
    let apiKey = "c9a4470d4efaf75504fc4a5aa2627f1f";
    let locationArray = JSON.parse(localStorage.getItem("locationArray")) || [];
    let reverseLocationArray = locationArray.reverse();
    const checkArray = location => {
        for (let i = 0; i < locationArray.length; i++) {
            if (locationArray[i] === location) {
                locationArray.splice(i, 1);
            }
        }

        if (location != null) {

            locationArray.push(location);
            while (locationArray.length > 5) {
                locationArray.shift();
            }

            localStorage.setItem("locationArray", JSON.stringify(locationArray));
        }
    };

    $("#searchBTN1").on("click", (event) => {
        event.preventDefault();
        let location = $("#locationInput").val().toUpperCase().trim();
        checkArray(location);
        makeCall(location);

    })

    const makeCall = (location) => {
        getWeather(location);
        fiveDay(location);
        displayHistory();
    }

    const fiveDay = (location) => {
        let fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&appid=" + apiKey + "&units=imperial";

        $.ajax({

            url: fiveDayQueryURL,
            method: "GET"
        })
            .then(function (response) {

                $("#fiveDayDisplay").empty();
                let j = 0;
                for (let i = 7; i < response.list.length; i += 8) {
                    j++;
                    let iconcode = response.list[i].weather[0].icon;
                    let newIconcode = iconcode.slice(0, -1);
                    newIconcode = newIconcode + "d";
                    let iconurl = "https://openweathermap.org/img/w/" + newIconcode + ".png";

                    let fiveDayDisplay = $("<div>").attr("id", "fiveDayDisplay" + i).addClass("card blue lighten-2 col s2");

                    let temp = response.list[i].main.temp;
                    let humidity = response.list[i].main.humidity;
                    let dateForFiveDay = moment().add(j, 'days').format('LLLL')


                    $("#fiveDayDisplay").append(fiveDayDisplay);
                    $("#fiveDayDisplay" + i).append(
                        `<h5>${dateForFiveDay}</h5>
                        <h6>Temp: ${temp.toFixed(0)}&#176;F</h6>
                        <h6>Humidity: ${humidity}%<h2><img src =${iconurl}></h2></h6>`

                    )

                }

            })

    }



    const displayHistory = () => {

        $("#history").empty();
        for (let i = 0; i < locationArray.length; i++) {
            let favButton = $("<button>").attr('class', 'favBTN waves-effect waves-light blue').attr('data-name', locationArray[i]);
            $("#history").append(favButton);
            $(favButton).text(locationArray[i]);
        }
    }

    $(document).on("click", ".favBTN", function () {

        let city = $(this).attr("data-name");
        checkArray(city);
        makeCall(city);
    })

    getWeather = (location) => {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&APPID=" + apiKey + "&units=imperial";


        $.ajax({

            url: queryURL,
            method: "GET"

        })
            .then((response) => {

                $("#todaysWeather").empty();


                let iconcode = response.weather[0].icon;
                let iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
                let uvLat = response.coord.lat;
                let uvLon = response.coord.lon;
                indexUV(uvLon, uvLat);

                $("#todaysWeather").append($("<div>").attr("id", "todayStats"));
                $("#todayStats").append(`<h2>${response.name}<img src = ${iconurl}></h2>
                <h3>Temperature : ${(response.main.temp).toFixed(0)}&#176;F</h3>
                    <h4>Wind Speed : ${response.wind.speed} mph</h4>
                    <h4>Humidity :${response.main.humidity}%</h4>
                    <h4 id='uv'></h4>`);

            })
    }

    indexUV = (uvLon, uvLat) => {
        let queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=15e701943db0eab65638c75f992c9b15&lat=" + uvLat + "&lon=" + uvLon;

        $.ajax({

            url: queryURL,
            method: "GET"

        })
            .then((response) => {

                let uvIndex = response.value;
                $("#uv").text("UV Index : " + uvIndex);
                if (uvIndex < 3) {
                    $("#uv").addClass("green");
                }
                if (uvIndex > 3 && uvIndex < 6) {
                    $("#uv").addClass("yellow");
                }
                if (uvIndex > 6 && uvIndex < 8) {
                    $("#uv").addClass("orange");
                }
                if (uvIndex > 8 && uvIndex < 11) {
                    $("#uv").addClass("red");
                }
                if (uvIndex > 11) {
                    $("#uv").addClass("purple");
                }

            })
    }

    if (locationArray && locationArray.length > 0) {
        while (locationArray.length > 5) {
            locationArray.shift();
        }
        console.log(reverseLocationArray);
        console.log('firstcall');
        // let location = reverseLocationArray[0]
        makeCall(reverseLocationArray[0]);
    }

};