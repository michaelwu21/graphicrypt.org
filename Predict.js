function predict(link) {
	var percentGrowth = 0; 
	var predictedPrice = 0; 
	var predictedHigh = 0;
	var predictedLow = 0; 
	var predictedAverage = 0; 
	var predictedPrice = 0;
	prices = [];
	$.getJSON(link, function(data) {
		for(var i = 0; i < data.Data.length; i++) {
			prices[i] = data.Data[i];
		}
		console.log(prices)
		//to get info of certain day, do prices[day].option
    //option can be: time, close, high, low, open, volumefrom, volumeto
    	
    	//calculate percent growth over time
    	for(var i = 1; i < prices.length -1; i ++)
    	{
    		percentGrowth  += (prices[i].close - prices[i - 1].close) / prices[i -1].close;
    	}
    	//calculate average high 
    	for(var i = 0; i < prices.length -1; i++)
    	{
    		predictedHigh += prices[i].high;
    	}
    	//calculate average low
    	for(var i = 0; i < prices.length-1; i++)
    	{
    		predictedLow += prices[i].low;
    	}


    //calculate 

    percentGrowth = percentGrowth / (prices.length - 1); 
    predictedHigh = predictedHigh / prices.length;
    predictedLow = predictedLow / prices.length;
    predictedAverage = (predictedHigh + predictedLow) / 2; 

    predictedPrice = data.Data[prices.length - 1].close * (1+percentGrowth);
    predictedPrice = (predictedPrice + predictedAverage) / 2;
    console.log(predictedPrice);
    return predictedPrice;
    });
}

