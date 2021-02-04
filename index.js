const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./queries')



const app = express()

//CORS Middleware
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
  });



const port = 3000
// app.use(cors)
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
//User
app.post('/user',db.createUser);
app.get('/user/:id',db.getUser);
//Game
app.post('/game',db.createGame);
app.get('/game/:id',db.getGamesById);
app.get('/game/:id/getPlayers',db.getPlayers);
app.get('/game/:id/getReady',db.getReady);

//Card
app.post('/card',db.createCard);

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


