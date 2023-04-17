const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://rox-user-1:59sJ9XGzaNKgTvxK@cluster0.bjskb.mongodb.net/Rox-Database?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const start = Date.now();
client.connect((err, client) => {
  if (err) {
    console.log('Connection to MongoDB failed');
    console.error(err);
    const end = Date.now();
    const diff = (end - start) / 1000;
    const status = `${new Date().toISOString()}, failure , ${diff.toFixed(4)}`;
    require('fs').appendFileSync('public/status/Database_report.log', status);
    process.exit(1);
  } else {
    console.log('Connection to MongoDB successful');
    const end = Date.now();
    const diff = (end - start) / 1000;
    const status = `${new Date().toISOString()}, success , ${diff.toFixed(4)}`;
    require('fs').appendFileSync('public/status/Database_report.log', status);
    client.close();
  }
});

// ping to google 
const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'www.google.com',
  port: 443,
  path: '/',
  method: 'GET'
};

const start = Date.now();

const req = https.request(options, res => {
  const end = Date.now();
  const diff = (end - start) / 1000;
  const status = `${new Date().toISOString()}, success , ${diff.toFixed(4)}`;
  console.log('Google is up');
  fs.appendFileSync('public/status/Google_report.log', status);
});

req.on('error', error => {
  const end = Date.now();
  const diff = (end - start) / 1000;
  const status = `${new Date().toISOString()}, failure , ${diff.toFixed(4)}`;
  console.log('Google is down');
  fs.appendFileSync('public/status/Google_report.log', status);
  process.exit(1);
});

req.end();



