const { createNewAnimal, filterByQuery, findById, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
const router = require('express').Router();

router.get('/animals', (req, res) => {
    let results = animals;
    console.log('GET /api/animals', req.query);
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

router.get('/animals/:id', (req, res) => {
    console.log('GET /api/animals id:', req.params.id, req.query);
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
});

router.post('/animals', (req, res) => {
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

module.exports = router;