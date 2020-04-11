window.onload = () => {

    console.log(moment().format('LT'));
    let todaysDate = moment().format("L");
    $(".hour").text(moment().format('dddd LT'));
    $(".date").text(moment().format('MMMM DD YYYY'));
    let apiKey = "c9a4470d4efaf75504fc4a5aa2627f1f";
    let locationArray = JSON.parse(localStorage.getItem("location")) || [];
    // let fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&appid=" + apiKey + "&units=imperial";

    if (locationArray && locationArray.length > 0) {
        while (locationArray.length > 3) {
            locationArray.shift();
        }
        makeCall(locationArray[0]);
    }

    $("#searchBTN1").on("click", (event) => {
        event.preventDefault();
        let location = $("#locationInput").val().trim();
        console.log(location)
        for (let i = 0; i < locationArray.length; i++) {
            if (locationArray[i] === location) {
                locationArray.splice(i, 1);
            }
        }

        if (location != null) {

            locationArray.push(location);
            while (locationArray.length > 4) {
                locationArray.shift();
            }

            localStorage.setItem("locationArray", JSON.stringify(locationArray));
        }

        makeCall();
    })

    const makeCall = () => {
        getWeather();
        // fiveDay();    
        displayHistory();
    }


    const displayHistory = () => {
        console.log(locationArray);
        for (let i = 0; i < locationArray.length; i++) {
            $("#favBTN" + (i)).text(locationArray[i]).removeClass("hide");
        }
    }

   getWeather=()=>{
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + locationArray[0] + "&APPID=" + apiKey + "&units=imperial";


        $.ajax({

            url: queryURL,
            method: "GET"

        })
            .then((response)=> {

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
                    <h4 id='uv'></h4>`
                );

            })
    }

    indexUV=(uvLon, uvLat)=> {
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

};