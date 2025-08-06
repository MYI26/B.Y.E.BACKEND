const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,          // Référence à l'utilisateur
    ref: 'User',
    required: true
  },
  stockSymbol: {
    type: String,
    required: true
  },
  stockLogo: {
    type: String
  },
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
