// import the required libraries
var path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors= require('cors')
const dotenv= require('dotenv')
dotenv.config();
const fetch = require('node-fetch')
const app = express()

projectData = {};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})

app.post('/destination', async function (req, res) {
	destination = req.body.destination;
	const cityResponse = await fetch (`http://api.geonames.org/search?q=${destination}&username=hasan1417&type=json`);
	res.json(await cityResponse.json());
})

app.post('/destinationWeather', async function (req, res) {
	const lat = req.body.latitude;
	const lng = req.body.longitude;
	const weatherResponse = await fetch (`http://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API}`);
	res.json(await weatherResponse.json());
})

app.post('/destinationPic', async function (req, res) {
	const city = req.body.city;
	const picResponse = await fetch (`https://pixabay.com/api/?key=${process.env.PIXABAY_API}&q=${city}&lang=en&image_type=photo`);
	let cityPic = await picResponse.json();
	if (cityPic.hits.length> 0){
		res.json(cityPic);
	}else {
		alert("The city isn't found, try another one")
	}
	
})

app.post('/add', (req,res)=>{
	const allData = {
		city: req.body.city,
		country: req.body.country,
		picture: req.body.picture,
		temperature: req.body.temp,
		departure: req.body.dep,
		arrival: req.body.arr,
		dateDifference: req.body.diff
	  }
	  console.log(allData)
	  projectData=allData
})

app.get('/all' , (req,res)=> {
	res.send(projectData)
})

app.get('/', function (req, res) {
	res.sendFile('dist/index.html')
})


module.exports = app;
