/******************************************************************************
***
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name:ANUJ DEOL Student ID: N01550000 Date: 3RD NOVEMBER, 2023
*
*
******************************************************************************
**/ 
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const fs = require('fs');
const { title } = require('process');
const port = process.env.PORT || 3000;

app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'public')));
//app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    filterZero: function (val) {
    
      if (val === 0) {
        console.log("FILTERZERO CALLED");
        return 'zero';
      }
      return val;
    }
    , 
    isZero: function (val) {
      if (val === 0) {
        console.log("ISZERO CALLED");
        return true;
      }
      return false;
    }
    
  }
}));






app.get('/', (req, res) => {
  // Create an array of buttons with their labels and URLs
  const buttons = [
    { label: 'Users', url: '/users' },
    { label: 'About Me!', url: '/about' },
    { label: 'Index Search', url: '/data/invoiceNo/:index' },
    { label: 'Search Product Line', url: ' /search/produceLine' },
    { label: 'Show all data replace 0-zero', url: ' /searchAllReplaceZero' },
    { label: 'Show all data without Zero rating', url: ' /searchAllWithoutZero' },
    { label: 'Search All Data', url: '/searchAll' }
  ];
  res.render('index', { button: buttons, title: 'root' });
});

app.get('/users', (req, res) => {
  res.render('users', { title: 'Users' ,message: 'This is users page' });
});

// Define a route for the "/about" page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Me!!' });
});

// Define a specific route handler for /wrongRoute
app.get('/wrongRoute', (req, res) => {
  res.render('error', { title: 'Error encountered!!', message: "Wrong Route Please try another link"});
});


// Define a route for loading JSON data
app.get('/data', (req, res) => {
  // Read the JSON data from the file
  fs.readFile(__dirname + '/SuperSales.json', 'utf8', (err, data) => {
    if (err) {
      res.render('error', { title: 'Error: JSON_Data!!', message: "Error while loading JSON Data"});;
      console.error(err);
    } else {
      const jsonData = JSON.parse(data);
      console.log('JSON data:', jsonData);
      res.render('loaddata', { title: 'JSON_Data!!', message: "JSON Data Loaded"});;
    }
  });
});

// Define a dynamic route to retrieve InvoiceNo by index
app.get('/data/invoiceNo/:index', (req, res) => {
  //const index = req.params.index.substring(1);
  

  fs.readFile(__dirname + '/SuperSales.json', 'utf8', (err, data) => {
    if (err) {
      res.render('error', { title: 'error!!', message: "Data Not loaded: " + err });
    } else {
      const jsonData = JSON.parse(data);
      // const test =jsonData.carSales[1].InvoiceNo
      // console.log(test);

      if (jsonData && jsonData[index] && jsonData[index]['Invoice ID']) {
        const invoiceNo = jsonData[index]['Invoice ID'];
        const branch = jsonData[index]['Branch'];
        const city = jsonData[index]['City'];
        const customer = jsonData[index]['Customer type'];
        const productLine = jsonData[index]['Product line'];
        const name = jsonData[index]['name'];
        const image = jsonData[index]['image'];
        const unitPrice = jsonData[index]['Unit price'];
        const quantity = jsonData[index]['Quantity'];
        const tax = jsonData[index]['Tax 5%'];
        const total = jsonData[index]['Total'];
        const date = jsonData[index]['Date'];
        const time = jsonData[index]['Time'];
        const payment = jsonData[index]['Payment'];
        const cogs = jsonData[index]['cogs'];
        const rating = jsonData[index]['Rating'];
      
        res.render('indexsearch', { title: 'Index Search!!', invoiceNo, branch, city, customer, productLine, name, image, unitPrice, quantity, tax, total, date, time, payment, cogs, rating });

      }
      else {
        res.render('error', { title: 'error!!', message: "No Data at the specific index" });
      }
    }
  });
});

//

// Define a dynamic route to retrieve InvoiceNo by index
app.get('/search/produceLine', (req, res) => {
  res.render('productline', { title: 'Search Product Line' });
});

app.get('/srch/produceLine', (req, res) => {
  const userInput = req.query.pl;

  fs.readFile(__dirname + '/SuperSales.json', 'utf8', (err, data) => {
    if (err) {
      res.render('error', { title: 'Error', message: 'Data Not Loaded: ' + err });
    } else {
      const jsonData = JSON.parse(data);

      const matchingProductLines = jsonData.filter((item) =>
        item['Product line'].toLowerCase().includes(userInput.toLowerCase())
      );
      const test = matchingProductLines[1]['Invoice ID'];
      console.log("&&&&&*******   "+test)

      if (matchingProductLines.length > 0) {
        res.render('productlineoutput', {
          title: 'Matching Product Lines',
          productLine: matchingProductLines,
        });
      } else {
        res.render('error', { title: 'Error', message: 'No Matching Product Lines Found' });
      }
    }
  });
});



//search all products
app.get('/searchAllReplaceZero', (req, res) => {
  fs.readFile(__dirname + '/SuperSales.json', 'utf8', (err, data) => {
    if (err) {
      res.render('error', { title: 'Error', message: 'Data Not Loaded: ' + err });
    } else {
      const jsonData = JSON.parse(data);

      if (jsonData.length > 0) {
        console.log('Rendering the template...');
        res.render('productLineFilteredResult', {
          title: 'Matching Product Lines',
          productLine: jsonData,
        });
      } else {
        res.render('error', { title: 'Error', message: 'No Matching Product Lines Found' });
      }
    }
  });
});

//filter zero


app.get('/searchAllWithoutZero', (req, res) => {
  fs.readFile(__dirname + '/SuperSales.json', 'utf8', (err, data) => {
    if (err) {
      res.render('error', { title: 'Error', message: 'Data Not Loaded: ' + err });
    } else {
      const jsonData = JSON.parse(data);

      // Filter invoices with a "rating" not equal to zero
      const filteredData = jsonData.filter((productLine) => productLine.Rating !== 0);
      if (filteredData.length > 0) {
        res.render('productlineoutput', {
          title: 'Matching Product Lines (Filtered without Zero rating)',
          productLine: filteredData,
        });
      } else {
        res.render('error', { title: 'Error', message: 'No Matching Product Lines Found' });
      }
    }
  });
});



//all data 
app.get('/searchAll', (req, res) => {
  fs.readFile(__dirname + '/SuperSales.json', 'utf8', (err, data) => {
    if (err) {
      res.render('error', { title: 'Error', message: 'Data Not Loaded: ' + err });
    } else {
      const jsonData = JSON.parse(data);

      // Filter invoices with a "rating" not equal to zero
      if (jsonData.length > 0) {
        res.render('productlineoutput', {
          title: 'Show all data',
          productLine: jsonData,
        });
      } else {
        res.render('error', { title: 'Error', message: 'Not Found' });
      }
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
