
// While page is loading, we getting all currencies types.
var appSellCurrency = angular.module('appTradeSellCurrency', []);
appSellCurrency.controller('controllerSellCurrency', function ($scope, $http)
{
    $scope.currencies = [];
    $http.get(urlLatestCurrencies)
        .then(function successCallback (response)
        {
            // Add all currencies.
            $scope.currencies.push(response.data.base);
            for (var rate in response.data.rates) {
                $scope.currencies.push(rate);
            }
        },
        function errorCallback (response){

            console.log("Unable to perform get request");
        }
    );
});

// Update updateBuyValue checking if inputSellAmount is a number.
function checkAndUpdateInputSellAmount ()
{
    if (SellCurrency.value != "void" && BuyCurrency.value != "void" && inputSellAmount.value != "")
        updateBuyValue(parseFloat(inputSellAmount.value), SellCurrency.value, BuyCurrency.value);
    else
        inputBuyAmount.value = 0;
}

// Update Rate field.
function updateRate (fromCurrency, toCurrency)
{
    $.ajax({ 
        type: "GET",
        dataType: "jsonp",
        url: urlLatestToBaseCurrencies + fromCurrency,
        success: function(data){
            if (fromCurrency != toCurrency)
            {
                $("#currentRate").html(data.rates[toCurrency].toFixed(4));
            }
            else
                $("#currentRate").html("1");
        }
    });
}

// Update inputBuyAmount field.
function updateBuyValue (sellValue, fromCurrency, toCurrency)
{
    $.ajax({ 
        type: "GET",
        dataType: "jsonp",
        url: urlLatestToBaseCurrencies + fromCurrency,
        success: function(data){
            if (fromCurrency != toCurrency)
            {
                inputBuyAmount.value = (sellValue * data.rates[toCurrency]).toFixed(2);
            }
            else
                inputBuyAmount.value = sellValue.toFixed(2);
        }
    });
}

// Update Rate and inputBuyAmount fields.
function calculateRate ()
{
    $("#currentRate").html("0");

    if (SellCurrency.value != "void" && BuyCurrency.value != "void")
    {
        updateRate(SellCurrency.value, BuyCurrency.value);
        if (inputSellAmount.value != "")
            updateBuyValue(parseFloat(inputSellAmount.value), SellCurrency.value, BuyCurrency.value);
        else
            inputBuyAmount.value = 0;
    }
}

// Send to server trade.
function createTrade ()
{
    if (SellCurrency.value == "void" || BuyCurrency.value == "void" || inputBuyAmount.value == "" || inputSellAmount.value == "")
        return;

    var newTrade = {
        "Sell_Currency" : SellCurrency.value,
        "Sell_Amount" : parseFloat(inputSellAmount.value),
        "Buy_Currency" : BuyCurrency.value,
        "Buy_Amount" : parseFloat(inputBuyAmount.value),
        "Rate" : parseFloat($("#currentRate").html())
    };

    $.ajax({
        type: "POST",
        url: urlTrades,
        data: JSON.stringify(newTrade),
        contentType: "application/json",
        dataType: "json",
        success: function(data){
            console.log(data);
            window.location.href = "index.html";
        },
        failure: function(errMsg) {
            console.log(errMsg);
        }
    });
}

// Returns to index.html.
function cancelTrade ()
{
    // Simple redirect.
    window.location.href = "index.html";
}