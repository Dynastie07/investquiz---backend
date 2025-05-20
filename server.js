const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;
const SITE_ID = process.env.SITE_ID;

app.post('/cinetpay/init', async (req, res) => {
  const { amount, phoneNumber } = req.body;
  const transactionId = `INV-${Date.now()}`;

  try {
    const response = await axios.post('https://api-checkout.cinetpay.com/v2/payment', {
      apikey: API_KEY,
      site_id: SITE_ID,
      transaction_id: transactionId,
      amount,
      currency: 'XAF',
      description: 'Paiement pour jeu InvestQuiz',
      customer_name: phoneNumber,
      notify_url: 'https://votre-backend.com/notify',
      return_url: 'https://votre-app.com/success'
    });

    res.json({ payment_url: response.data.data.payment_url });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Échec de paiement' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur actif sur le port ${PORT}`));
