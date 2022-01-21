const { query } = require('express');
const express = require('express');
const { animals } = require('./data/animals');

const app = express();
app.get('/api/animals', (req, res) => {
    let results = animals;
    console.log('GET /api/animals', req.query);
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

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