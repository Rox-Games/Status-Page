const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://rox-user-1:59sJ9XGzaNKgTvxK@cluster0.bjskb.mongodb.net/Rox-Database?retryWrites=true&w=majority';

let start = Date.now();

async function main() {

    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        const end = Date.now();
        const diff = (end - start) / 1000;
        const status = `${new Date().toISOString()}, success, ${diff.toFixed(4)}`;
        require('fs').appendFileSync('public/status/Database_report.log', `${status}\n`);
        console.log("Database is up")


    } catch (e) {
        console.error(e);
        const end = Date.now();
        const diff = (end - start) / 1000;
        const status = `${new Date().toISOString()}, failure, ${diff.toFixed(4)}`;
        require('fs').appendFileSync('public/status/Database_report.log', `${status}\n`);
    } finally {
        await client.close();

    }
}

main().catch(console.error);



// ping to google 
const https = require('https');
const http = require("http");
const fs = require('fs');

// rox games ping
start = Date.now();

const RoxRequest = https.request({
    hostname: 'www.rox.games',
    port: 443,
    path: '/',
    method: 'GET'
}, res => {
    const end = Date.now();
    const diff = (end - start) / 1000;
    const status = `${new Date().toISOString()}, success, ${diff.toFixed(4)}`;
    console.log('Home Page is up');
    fs.appendFileSync('public/status/Rox_report.log', `${status}\n`);
});

RoxRequest.on('error', error => {
    const end = Date.now();
    const diff = (end - start) / 1000;
    const status = `${new Date().toISOString()}, failure, ${diff.toFixed(4)}`;
    console.log('Home Page is down');
    fs.appendFileSync('public/status/Rox_report.log', `${status}\n`);

});

RoxRequest.end();


// rox cluster ping
start = Date.now();

clusterReq = https.request({
    hostname: 'www.api.rox.games',
    port: 443,
    path: '/',
    method: 'GET',
    rejectUnauthorized: false
}, res => {
    const end = Date.now();
    const diff = (end - start) / 1000;
    const status = `${new Date().toISOString()}, success, ${diff.toFixed(4)}`;
    console.log('Cluster is up');
    fs.appendFileSync('public/status/Cluster_report.log', `${status}\n`);
});

clusterReq.on('error', error => {
    const end = Date.now();
    const diff = (end - start) / 1000;
    const status = `${new Date().toISOString()}, failure, ${diff.toFixed(4)}`;
    console.log('Cluster is down', error);
    fs.appendFileSync('public/status/Cluster_report.log', `${status}\n`);

});

clusterReq.end();
