const app = require('./app');
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';


app.listen(PORT, () => {
  console.log(` Notre Serveur backend sur http://localhost:${PORT}`);
    console.log(`Serveur Backend démarré sur http://${HOST}:${PORT}`);
     console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
        console.log(`=================================`);
});

  // les endpoints disponibles
  console.log('Endpoints API:');
  console.log(`- GET    http://${HOST}:${PORT}/api`);
  console.log(`- POST   http://${HOST}:${PORT}/api/pieces`);
  console.log(`- POST   http://${HOST}:${PORT}/api/panier`);
  console.log(`- POST   http://${HOST}:${PORT}/api/annuler`);
  console.log(`- POST   http://${HOST}:${PORT}/api/paiement`);