const express = require('express');
const cors = require('cors');

const app = express();
const whitelist = ['https://bd1-1.vercel.app'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  'Access-Control-Allow-Origin' : "https://bd1-1.vercel.app",
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 'Authorization', 'X-Requested-With',
    'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept'
  ],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
const PORT = 3000;

app.get('/cart-total', (req, res) => {
  const newItemPrice = parseFloat(req.query.newItemPrice);
  const cartTotal = parseFloat(req.query.cartTotal);

  if (isNaN(newItemPrice) || isNaN(cartTotal)) {
    return res.status(400).send('Invalid input');
  }

  const total = newItemPrice + cartTotal;
  res.send(total.toString());
});

app.get('/membership-discount', (req, res) => {
  const cartTotal = parseFloat(req.query.cartTotal);
  const isMember = req.query.isMember === 'true';

  if (isNaN(cartTotal)) {
    return res.status(400).send('Invalid input');
  }

  const discount = isMember ? 0.1 * cartTotal : 0;
  const finalPrice = cartTotal - discount;
  res.send(finalPrice.toString());
});

app.get('/calculate-tax', (req, res) => {
  const cartTotal = parseFloat(req.query.cartTotal);
  const taxRate = 0.05;

  if (isNaN(cartTotal)) {
    return res.status(400).send('Invalid input');
  }

  const tax = cartTotal * taxRate;
  res.send(tax.toString());
});

app.get('/estimate-delivery', (req, res) => {
  const shippingMethod = req.query.shippingMethod.toLowerCase();
  const distance = parseFloat(req.query.distance);

  if (isNaN(distance)) {
    return res.status(400).send('Invalid input');
  }

  let deliveryDays;
  if (shippingMethod === 'standard') {
    deliveryDays = Math.ceil(distance / 50);
  } else if (shippingMethod === 'express') {
    deliveryDays = Math.ceil(distance / 100);
  } else {
    return res.status(400).send('Invalid shipping method');
  }

  res.send(deliveryDays.toString());
});

app.get('/shipping-cost', (req, res) => {
  const weight = parseFloat(req.query.weight);
  const distance = parseFloat(req.query.distance);

  if (isNaN(weight) || isNaN(distance)) {
    return res.status(400).send('Invalid input');
  }

  const shippingCost = weight * distance * 0.1;
  res.send(shippingCost.toString());
});

app.get('/loyalty-points', (req, res) => {
  const purchaseAmount = parseFloat(req.query.purchaseAmount);

  if (isNaN(purchaseAmount)) {
    return res.status(400).send('Invalid input');
  }

  const loyaltyPoints = purchaseAmount * 2;
  res.send(loyaltyPoints.toString());
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
