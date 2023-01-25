const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'e7702b891bmsh61d70622ed923f9p1aa3d0jsne4d5dd69dbc9',
		'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
	}
};

fetch('https://quotes15.p.rapidapi.com/quotes/random/', options)
	.then(response => response.json())
	.then(response => {
        console.log(response);
        
        document.getElementById('frase').innerHTML = response.content;
        document.getElementById('autor').innerHTML = '- ' + response.originator.name;
    })
	.catch(err => console.error(err));