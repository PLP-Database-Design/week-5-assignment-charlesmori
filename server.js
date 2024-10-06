
//importing dependancies
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');

//configure environment variable
dotenv.config()

//create a connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


//test for connection

db.connect((err) => {
    //connection not successful
    if(err) {
        return console.log("Error connecting to the database", err)
    }

    //connection successful
    console.log("Connected successful", db.threadId)
})


// //Question 1
// app.get('', (req, res) => {
//     const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
//     db.query(getPatients, (err, data) => {
//         if(err) {
//             return res.status(400).send("Failed to get patients", err)
//         }
//         res.status(200).send(data)
//     })
// });


// //Question 2
// app.get('', (req, res) => {
//     const getProvider = "SELECT first_name, last_name, provider_specialty FROM providers"
//     db.query(getProvider, (err, data) =>{
        
//         //checking if there is an error
//         if(err) {
//             return res.status(400).send("Failde to get provider's info", err)
//         }

//         res.status(200).send(data)
//     })
// })


//Question 3

app.get('/patients', (req, res) => {
    const { first_name } = req.query;
    if (!first_name) {
      return res.status(400).send({ error: 'Please provide a first name.' });
    }
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [first_name], (err, results) => {
      if (err) {
        return res.status(500).send({ error: 'Database query error' });
      }
      if (results.length === 0) {
        return res.status(404).send({ message: 'No patients found with that first name.' });
      }
      res.status(200).send(results);
    });
  });



//Question 4

app.get('/providers', (req, res) => {
    const { specialty } = req.query;
    if (!specialty) {
      return res.status(400).send({ error: 'Please provide a specialty.' });
    }
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(query, [specialty], (err, results) => {
      if (err) {
        return res.status(500).send({ error: 'Database query error' });
      }
      if (results.length === 0) {
        return res.status(404).send({ message: 'No providers found with that specialty.' });
      }
      res.status(200).send(results);
    });
  });


//listen to the server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});