const app = require('./app');
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';


app.listen(PORT, () => {
  console.log(` Notre Serveur backend sur http://localhost:${PORT}`);
    console.log(`Serveur Backend démarré sur http://${HOST}:${PORT}`);
     console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
        console.log(`=================================`);
});