const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/config');
const recommendation = require('./models/recommendation');
const authRoutes = require('./routes/auth');
const registerRoutes = require('./routes/register');
const registerRouter = require('./routes/register');
const loginRoutes = require('./routes/login');
const loginRouter = require('./routes/login');
const User = require('./models/user');

const { ayam_petelur, ayam_pedaging, Recommendation } = require('./models/recommendation');

const authRouter = require('./routes/auth');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/api', registerRouter);
app.use('/api', loginRouter);

app.post('/recommendation', (req, res) => {
  const { peruntukan, banyak, fase } = req.body;

  if (peruntukan === "1") {
    result = recommendation.ayam_petelur(fase, banyak);
  } else if (peruntukan === "2") {
    result = recommendation.ayam_pedaging(fase, banyak);
  } else {
    result = { error: "Masukan anda harus berupa angka 1 atau 2 pada kolom 'Peruntukan Ternak'." };
  }

  res.json(result);
});


app.delete('/recommendation/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Recommendation.deleteRecommendationById(id);
    if (result) {
      res.json({ success: true, message: 'Recommendation deleted successfully.' });
    } else {
      res.json({ success: false, error: 'No recommendation found for the given ID.' });
    }
  } catch (error) {
    console.error('Error in delete route:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});


app.get('/recommendation/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Recommendation.getRecommendationById(id);

    if (result) {
      res.json(result);
    } else {
      res.json({ error: 'No recommendation found for the given ID.' });
    }
  } catch (error) {
    console.error('Error in get route:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.put('/recommendations/:id', async (req, res) => {
  const { id } = req.params;
  const { peruntukan, fase, banyak, recommendation } = req.body;

  try {
    const updatedRecommendation = await Recommendation.updateRecommendation(id, peruntukan, fase, banyak, recommendation);

    if (updatedRecommendation) {
      res.status(200).json(updatedRecommendation);
    } else {
      res.status(404).json({ error: `No recommendation found with id ${id}.` });
    }
  } catch (error) {
    console.error('Error handling PUT request:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await sequelize.sync();
    console.log('Database synchronized successfully.');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};


startServer();