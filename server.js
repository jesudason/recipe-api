let express =  require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
const PORT = 3000;


let pool = new pg.Pool({
  port: 5433,
  password: 'Pudding99!',
  database: 'recipebookdb',
  max: 10,
  host: 'localhost',
  user: 'postgres'
});

// pool.connect((err, db, done) => {
//   if(err) {
//     return console.log(err);
//   }
//   else {
//     db.query('SELECT * FROM recipebook."Recipes"', (err, table) => {
//       if(err) {
//         return console.log(err)
//       }
//       else {
//         console.log(table.rows[])
        
//       }
//     })
//   }
// })

// pool.client
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(function(req, response, next) {
  response.header('Access-Control-Allow-Origin', "*");
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/recipes', function(request, response) {
  pool.connect(function(err, db, done) {
    if(err) {
      return response.status(400).send(err)
    }
    else {
      db.query('SELECT * FROM recipebook."Recipes"', function(err, table) {
        done();
        if(err) {
          return response.status(400).send(err)
        }
        else {
          return response.status(200).send(table.rows)
        }
      });
    }
  })
});

app.post('/api/new-recipe', function(request, response) {
  var recipe_name = request.body.recipe_name;
  var recipe_ingredients = request.body.recipe_ingredients;
  var recipe_method = request.body.recipe_method;
  let values = [id, recipe_name, recipe_ingredients, recipe_method];

  pool.connect((err, db, done) => {
    if(err) {
      return response.status(400).send(err);
    }
    else {
      db.query('INSERT INTO recipebook."Recipes" (id, name, ingredients, directions) VALUES($1, $2, $3, $4)', [...values], (err, table) => {
        done();
        if(err) {
          return response.status(400).send(err);
        }
        else {
          console.log('success')
          db.end();
          response.status(201).send({message: 'Data inserted'});
        }
      })
    }
  })
});

app.listen(PORT, () => console.log('listening on port' + PORT));