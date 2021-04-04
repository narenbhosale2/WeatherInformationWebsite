
const express = require('express');
const request = require('request');
const hbs = require('hbs');
const path = require('path');
const fetch = require("node-fetch");

var router = express.Router()
const app = express();
app.set('view engine','hbs');

const port = 5000;
const staticPath = path.join(__dirname,"../LiveWeatherApp/Templates/Public");
const templatePath = path.join(__dirname,"../LiveWeatherApp/Templates/Views");
const partialPath = path.join(__dirname,"../LiveWeatherApp/Templates/Views/partials");
const weatherApi = "e53e3da3650726f5ec53790618c37670";
app.set('views',templatePath);
app.use(express.static(staticPath));
hbs.registerPartials(partialPath);
app.use(express.urlencoded());
app.use(express.json());

var cityTemp = "";
var weatherCondition = "";
var city  = "";

const getInfo = async (weatherInfoURL) =>{
  try {
    const response =  await fetch(weatherInfoURL);
    const data =  response.json();
    return  data;
  } catch (error) {
    console.log(error);
  }
}

app.get('/',(req,res)=>{
    const cityName = req.query.city == undefined? "Pune": req.query.city;
    const weatherInfoURL = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherApi}`;
    
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    // ********************************************************************************************
    // GET information using fetch method and async/await.
    async function getWeatherData(weatherInfoURL){
      const weatherApiData = await fetch(weatherInfoURL);
      const actualWeatherApiData = await weatherApiData.json();
      return actualWeatherApiData;

    }

    getWeatherData(weatherInfoURL).then((actualWeatherApiData)=> {
      cityTemp = (actualWeatherApiData.main.temp - 273.15).toFixed(2);
      weatherCondition = actualWeatherApiData.weather[0].description;
      city = `${actualWeatherApiData.name}, ${actualWeatherApiData.sys.country}`;
      res.render("home", {date:today,temp:cityTemp,weatherCondition: weatherCondition,city: city});

    }).catch((err)=> {
      res.render("home", {errorMessage: "Please enter correct city name !!!"});
    });
    // ********************************************************************************************

    // ********************************************************************************************
    // GET information using fetch method.
    // fetch(weatherInfoURL)
    // .then((weatherApiData)=> {
    //   return weatherApiData.json();
    // })
    // .then((acturalWeatherApiData) => {
    //   cityTemp = (acturalWeatherApiData.main.temp - 273.15).toFixed(2);
    //   weatherCondition = acturalWeatherApiData.weather[0].description;
    //   city = `${acturalWeatherApiData.name}, ${acturalWeatherApiData.sys.country}`;
    //   res.render("home", {date:today,temp:cityTemp,weatherCondition: weatherCondition,city: city});
    // })
    // .catch((err) => {
    //   res.render("home", {errorMessage: "Please enter correct city name !!!"});
    // })
    // ********************************************************************************************

    // ********************************************************************************************
    // GET information using request AJAX method.
    // const requestOptions = {
    //   url: weatherInfoURL,
    //   method: 'GET',
    //   json: {}
    // };
    // request(requestOptions, (err, response, body) => {
    //   if (err) {
    //     res.write(err);
    //     res.end();
    //   } else if (response.statusCode === 200) {

    //     cityTemp = (body.main.temp - 273.15).toFixed(2);
    //     weatherCondition = body.weather[0].description;
    //     city = `${body.name}, ${body.sys.country}`;
    //     res.render("home", {date:today,temp:cityTemp,weatherCondition: weatherCondition,city: city});
    //   } else {
    //     res.render("home", {errorMessage: "Please enter correct city name !!!"});
    //   }
    // });
    // ********************************************************************************************
});

app.listen(port,()=>{
    console.log(`Listening to ${port}`)
})
