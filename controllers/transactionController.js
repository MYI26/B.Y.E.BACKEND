const Transaction = require('../models/Transaction');       // Importation du modèle Transaction

exports.createTransaction = async (req, res) => {
  const { userId, symbol, logoUrl, type, pricePerUnit, quantity } = req.body;

  if (!userId || !symbol || !logoUrl || !type || !pricePerUnit || !quantity) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  try {
    const totalPrice = pricePerUnit * quantity;

    const transaction = new Transaction({
      userId,
      stockSymbol: symbol,
      stockLogo: logoUrl,
      type,
      pricePerUnit,
      quantity,
      totalPrice
    });

    await transaction.save();

    res.status(201).json({
      message: 'Transaction enregistrée',
      transaction
    });
  } catch (err) {
    console.error('Erreur transaction :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
