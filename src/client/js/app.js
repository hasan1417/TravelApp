const submitForm = async function(e){
	e.preventDefault()
	// check what text was put into the form field
	let start = document.querySelector('#start').value;
	let destination = document.querySelector('#destination').value;
	let departure = document.querySelector('#departure').value;
	let arrival = document.querySelector('#arrival').value;

	let dateBegin = new Date(departure);
	let dateEnd = new Date(arrival);
	let dateDiff = (dateEnd.getTime() - dateBegin.getTime())/(86400000);

	let cityData = {};
	let cityWeather = {};
	let cityPic= {};
	
	
	if(start === ""){
		alert('Enter your start city!');
		return;
	}

	if(destination === ""){
		alert('Enter your end city!');
		return;
	}	
	if(departure === ""){
		alert('Enter the departure date!');
		return;
	}

	if(arrival === ""){
		alert('Enter the arrival date!');
		return;
	}	
	const postCityData = await fetch ('http://localhost:8081/destination', {
		method: 'POST',
		mode: 'cors',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({destination: destination})		
	});
	
	try {
		const geoCityData = await postCityData.json();
		cityData = {
			latitude: geoCityData.geonames[0].lat,
			longitude: geoCityData.geonames[0].lng,
			city: geoCityData.geonames[0].name,
			country: geoCityData.geonames[0].countryName
		}
	} catch (error){
		console.log('Error:'+ error)
	}

	const postCityWeather = await fetch ('http://localhost:8081/destinationWeather', {
		method: 'POST',
		mode: 'cors',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(cityData)		
	});
	
	try {
		cityWeather = await postCityWeather.json();
	} catch (error){
		console.log('Error:' + error)
	}

	const postCityPic = await fetch ('http://localhost:8081/destinationPic', {
		method: 'POST',
		mode: 'cors',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(cityData)		
	});
	
	try {
		cityPic = await postCityPic.json();
	}catch (error){
		console.log('Error:' + error)
	}
	const sdata = {
		city: cityData.city,
		country: cityData.country,
		picture: cityPic.hits[0].webformatURL,
		temperature: cityWeather.data[0].datetime,
		departure: departure,
		arrival: arrival,
		dateDifference: dateDiff
	}
	console.log("possible problem")
	console.log(sdata)
	postAllData('http://localhost:8081/add', {
		city: cityData.city,
		country: cityData.country,
		picture: cityPic.hits[0].webformatURL,
		temperature: cityWeather.data.temp,
		departure: departure,
		arrival: arrival,
		dateDifference: dateDiff
	})
	

	updateUI();

}

	const updateUI = async () =>{
		const request = await fetch('http://localhost:8081/all')
		try{
			const allData = await request.json()
				console.log(allData)
				document.querySelector('#fetchedData').innerHTML= 
				`
				<div id="fetchedData">
					<h3>Your are travelling to ${allData[0].city}, ${allData[0].country}</h3>
					<h4>Below is a picture for your destination</h4>
					<img src="${allData[0].picture}" alt="img of ${allData[0].city}">
					<h4>The average temperature in ${allData[0].city} is: ${allData[0].temperature}
					<h4>Your trip start date: ${allData[0].departure}</h4>
					<h4>Your trip end date: ${allData[0].arrival}</h4>
					<h4>Your trip duration: ${allData[0].dateDifference} days</h4>
				</div>	
			`
			
		}catch(error){
			console.log("error",error)
		}
	
	}

	const postAllData= async (url='', data = {}) => {
		const response = await fetch(url, {
			method: 'POST',
			mode: 'cors',
			credentials: 'same-origin',
			headers: {
				'Content-Type':'application/json'
			},
			body: JSON.stringify(data),
		});
	
		try {
			const newData = await response.json();
			console.log(newData);
			return newData
		}
		catch(error){
			console.log("error", error)
		} 
	}
	

export { submitForm }