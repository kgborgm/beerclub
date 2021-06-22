const path = require("path");
const express = require("express");
const csvdb = require("csv-database");
const cors = require("cors");

const app = express(); // create express app
app.use(cors());

// add middlewares
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", "build", "index.html"));
// });
app.get('/', async(req, res) => {
	res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.get('/api/members', async(req, res) => {
	try {
		const db = await csvdb("beerclubdata.csv", ["member", "beer-style", "date"], ",");
		const result = await db.get();
		res.status(200).send(result);
	} catch (err) {
		console.error("Error in getting members", err);
		res.sendStatus(500);
	}
})

app.get('/api/beers/:member', async(req, res) => {
	try {
		const db = await csvdb("beerclubdata.csv", ["member", "beer-style", "date"], ",");
		const results = await db.get({member: req.params.member});
		res.status(200).send(results);
	} catch (err) {
		console.error("Error in getting beer styles", err);
		res.sendStatus(500);
	}
})

app.get('/api/consumptions/:member/:beer', async (req, res) => {
	try {
		const db = await csvdb("beerclubdata.csv", ["member", "beer-style", "date"], ",");
		const beers = await db.get({member: req.params.member});
		const results = beers.filter((obj) => obj["beer-style"] === req.params.beer);
		res.status(200).send(results);
	} catch (err) {
		console.error("Error in getting consumptions", err);
		res.sendStatus(500);
	}
})

// start express server on port 3000
app.listen(3000, function () {
	console.log('listening on port 3000!');
});

