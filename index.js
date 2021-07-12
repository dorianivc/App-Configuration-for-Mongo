const appConfig = require("@azure/app-configuration");
const express = require('express')
const dotenv = require('dotenv');
let MongoClient = require('mongodb').MongoClient
dotenv.config();
const app = express()
const port =  process.env.PORT || 3000

const client = new appConfig.AppConfigurationClient(process.env.AppConfigurationConnectionString);
let connectionString=  client.getConfigurationSetting({ key: "mongo-endpoint", label: process.env.LABEL});
let mongoUrl;

app.get('/', (req, res) => {
  connectionString=  client.getConfigurationSetting({ key: "mongo-endpoint", label: process.env.LABEL });
  connectionString.then(body=>{ mongoUrl=body});
  setTimeout(() => { /*console.log("connection string " + mongoUrl.value);*/ console.log('Secreto Obtenido') }, 300);
  MongoClient.connect(mongoUrl.value, { useNewUrlParser: true }, (err, db) => {
    if (err) {
      res.status(500).send('💥 Error con la conexion a la base de datos. ¿Es el App Config Secret correcto? 💥: ' + err);
    } else {
      res.send('Me conecté a la DB mongo de Dorian usando el Label: "' + process.env.LABEL + '"  del App Configuration ! 😎');
      db.close();
    }
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`))

