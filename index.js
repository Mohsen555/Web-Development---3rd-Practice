// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const http = require('http');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res){
  //console.log(req.body.crypto);
  var cTicker = req.body.crypto;
  var fTicker = req.body.fiat;
  var amount = req.body.amount;

  var options = {
    url: "https://apiv2.bitcoinaverage.com/convert/global",
    method: "GET",
    qs: {
      from: cTicker,
      to: fTicker,
      amount: amount
    }
  };

  request(options, function(error, response, body){
      var data = JSON.parse(body);
      var price = data.price.toFixed(2);

      var currentDate = data.time;

      res.write("<p>The current date is " + currentDate + "</p>");
      res.write("<h1> " + amount +" "+ cTicker + " is currently worth " + price +" "+ fTicker + "</h1>");

      res.send();
  });

});

var httpServer = http.createServer(app);

httpServer.listen(8080, function(){
  console.log("Server is running on port 8080");
});
