/******************************************************************************
***
* ITE5315 – Assignment 1
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Anuj Deol Student ID:N01550000 Date: 3RD OCT 2023
*
*
******************************************************************************
**/

const express = require('express');
const app = express();
const fs = require('fs');

const port = 5500; // Listen on port 5500

// Define a route for the home page
app.get('/', (req, res) => {
  const name = 'Anuj Deol';
  const studentID = 'N01550000';
  res.send(`Name: ${name}<br>Student ID: ${studentID}`);

  
});




app.get('/search/invoiceNo', (req, res) => {
  const form = `
    ${cssStyles}
    <form action="/srch/invoiceNo" method="get">
      <label for="index">Enter Invoice Index Number:</label>
      <input type="text" id="index" name="index" required>
      <button type="submit">Search</button>
    </form>
  `;
  res.send(form);
});



// Handle form submission
app.get('/srch/invoiceNo', (req, res) => {
  const index = req.query.index;
  //console.log("Index::: " + index);
  fs.readFile(__dirname + '/carsales.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error loading JSON data');
      console.error(err);
    } else {
      const jsonData = JSON.parse(data);

      if (jsonData.carSales[index] && jsonData.carSales[index].InvoiceNo) {
        const invoiceNo = jsonData.carSales[index].InvoiceNo;
        const result = `
          ${cssStyles}
          InvoiceNo: ${invoiceNo}
        `;
        res.send(result);
      } else {
        res.status(404).send('InvoiceNo not found for the specified index.');
      }
    }
  });
});





//manu

app.use(express.urlencoded({ extended: true }));

// Serve an HTML form for user input
app.get('/search/Manufacturer', (req, res) => {
    const form = `
        <form action="/search/Manufacturer" method="post">
            <label for="manufacturer">Enter Manufacturer Name (Partial Search):</label>
            <input type="text" id="manufacturer" name="manufacturer" required>
            <button type="submit">Search</button>
        </form>
    `;
    res.send(form);
});

// Handle form submission and display results
app.post('/search/Manufacturer', (req, res) => {
  const searchManufacturer = req.body.manufacturer;

  fs.readFile(__dirname + '/ite5315-A1-Car_sales.json', 'utf8', (err, data) => {
      if (err) {
          res.status(500).send('Error loading JSON data');
          console.error(err);
      } else {
          const jsonData = JSON.parse(data);
          const matchingCars = jsonData.carSales.filter(car => car.Manufacturer.toLowerCase().includes(searchManufacturer.toLowerCase()));

          if (matchingCars.length > 0) {
              // CSS styles for the result
              
          const result = `
              ${cssStyles}
              <div id="container">
                  <h2>Matching Cars:</h2>
                  <ul>
                      ${matchingCars.slice(0, 3).map(car => `
                          <li>
                
                              <div>
                                  <strong>InvoiceNo:</strong> ${car.InvoiceNo}<br>
                                  <strong>Manufacturer:</strong> ${car.Manufacturer}<br>
                                  <!-- Add more fields here -->
                              </div>
                          </li>
                      `).join('')}
                  </ul>
              </div>
          `;
          
              res.send(result);
          } else {
              res.send('No matching cars found.');
          }
      }
  });
});


const cssStyles = `
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #ffebcd; 
                      margin: 0;
                      padding: 0;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                  }
          
                  #container {
                      background-color: #fff;
                      border-radius: 10px;
                      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
                      padding: 20px;
                  }
          
                  h2 {
                      color: #ff5733;
                  }
          
                  ul {
                      list-style-type: none;
                      padding: 0;
                  }
          
                  li {
                      border: 1px solid #ff9a8b; 
                      border-radius: 5px;
                      margin: 10px 0;
                      padding: 10px;
                      background-color: #fffae5; 
                      display: flex;
                      align-items: center;
                  }
          
                  li:hover {
                      background-color: #fffbda; 
                  }
          
                  strong {
                      font-weight: bold;
                  }
          
                  img {
                      max-width: 100px;
                      max-height: 100px;
                      margin-right: 20px;
                  }
              </style>
          `;
          

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
