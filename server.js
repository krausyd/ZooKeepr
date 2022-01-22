const { query } = require('express');
const express = require('express');
const { animals } = require('./data/animals');
const fs = require('fs');
const path = require('path');

const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

//serve static content (images, css, js, ...)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});


//api routes
app.get('/api/animals', (req, res) => {
    let results = animals;
    console.log('GET /api/animals', req.query);
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    console.log('GET /api/animals id:', req.params.id, req.query);
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
});

app.post('/api/animals', (req, res) => {
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // req.body is where our incoming content will be
        console.log('POST /api/animals', req.body);
        req.body.id = animals.length.toString();
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

const validateAnimal = (animal) => {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
};

const createNewAnimal = (body, animalsArray) => {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return animal;
};

const findById = (id, animalsArray) => {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};

const filterByQuery = (query, animalsArray) => {
    let filteredResults = animalsArray;
    let personalityTraitsArray = [];
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
};


//Wildcard route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`


        __  _
    .-.'  \`; \`-._  __  _
   (_,         .-:'  \`; \`-._
 ,'o"(        (_,           )
(__,-'      ,'o"(            )>
   (       (__,-'            )
    \`-'._.--._(             )
       |||  |||\`-'._.--._.-'
                  |||  |||  

 API server started at port ${PORT}!`)
});