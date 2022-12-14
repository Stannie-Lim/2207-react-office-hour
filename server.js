const express = require('express');
const Sequelize = require('sequelize');

const db = new Sequelize('postgres://localhost/reactthing');

const HotSauce = db.define('hot_sauce', {
  name: Sequelize.DataTypes.STRING,
  intensity: Sequelize.DataTypes.DECIMAL,
});

const syncAndSeed = async () => {
  try {
    await db.sync({ force: true });

    const hotsauces = [
      { name: 'sriracha', intensity: 2 },
      { name: 'wasabi', intensity: 8 },
      { name: 'valentina', intensity: 10 },
      { name: 'korean fire noodle', intensity: 69 },
    ];

    await Promise.all(
      hotsauces.map(hotsauce => HotSauce.create(hotsauce))
    );
  } catch (error) {
    console.log(error);
  }
};

const app = express();
const path = require('path');
app.use(express.json());

app.use('/dist', express.static('dist'));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/hotsauces', async (req, res, next) => {
  res.send(await HotSauce.findAll());
});

app.post('/hotsauce', async (req, res, next) => {
  console.log(req.body);
  // we want to create a new database entry with the name and intensity that that user typed in
  const { name, intensity } = req.body;
  const hotsauce = await HotSauce.create({ name, intensity });
  res.send(hotsauce);
});

const port = process.env.PORT || 3000;

const init = async ()=> {
  //sync database and seed data here
  try {
    await syncAndSeed();
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
}

init();
