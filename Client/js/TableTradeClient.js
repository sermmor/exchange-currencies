
// While page is loading, we getting all cells values.
var appAllTrades = angular.module('appAllTrades', []);
appAllTrades.controller('controllerAllTrades', function ($scope, $http)
{
    $scope.allTrades = [];
    $http.get(urlTrades)
        .then(function successCallback (response)
        {
            // Add all trades.
            for (var i = 0; i < response.data.trades.length; i++) {
                $scope.allTrades.push({
                    SellCurrency: response.data.trades[i].Sell_Currency,
                    SellAmount: formatFloatToLocated(response.data.trades[i].Sell_Amount),
                    BuyCurrency: response.data.trades[i].Buy_Currency,
                    BuyAmount: formatFloatToLocated(response.data.trades[i].Buy_Amount),
                    Rate: formatFloatToLocated(response.data.trades[i].Rate),
                    DateBooked: formatDateBooked(response.data.trades[i].Date_Booked)
                });
            }
        },
        function errorCallback (response){

            console.log("Unable to perform get request");
        }
    );
});


// Formating float
function formatFloatToLocated (n)
{
    // For instance parse "532.2" to "532,2", only if user is from Spain.
    return parseFloat(n).toLocaleString();
}

// Parse from server UTC time to client time.
function formatDateBooked (dateBooked)
{
    var dateHour = dateBooked.split(" ");
    var hourMinSec = dateHour[1].split(":");
    var dayMonthYear = dateHour[0].split("-");

    // From UTC to client hour zone. Note: range month = [0-11], so month = parseInt(dayMonthYear[1] - 1).
    var toReturn = new Date(Date.UTC(parseInt(dayMonthYear[0]), parseInt(dayMonthYear[1] - 1), parseInt(dayMonthYear[2]), 
        parseInt(hourMinSec[0]), parseInt(hourMinSec[1]), parseInt(hourMinSec[2]), 0));
    var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    // For instance parse from "2018-1-27 16:27:15" to "27/1/2018 16:27" (case: user is from Spain).
    return toReturn.toLocaleDateString(getLanguajeLocale(), options);
}

function getLanguajeLocale ()
{
    // Get languaje and localization from the navigator
    if (navigator.languages != undefined) 
        return navigator.languages[0];
    else 
        return navigator.language;
}

function newTrade ()
{
    // Simple redirect.
    window.location.href = "newTrade.html";
}
