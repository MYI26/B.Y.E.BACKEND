const Transaction = require('../models/Transaction');

exports.analyzePortfolio = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Récupérer les transactions de l'utilisateur
    const transactions = await Transaction.find({ userId });

    if (transactions.length === 0) {
      return res.status(400).json({ message: "No transaction found for this user." });
    }

    // Construction du prompt à envoyer au LLM
    let prompt = `Here are the shares currently held by the user, with their purchase/sale operations :\n\n`;

    for (const tx of transactions) {
      prompt += `- ${tx.type.toUpperCase()} ${tx.quantity} shares of ${tx.stockSymbol} at ${tx.pricePerUnit}$ on ${new Date(tx.date).toLocaleDateString()}\n`;
    }

    prompt += `\nAnalyze this portfolio from a financial perspective (performance, diversification, risks, advice, etc.) while remaining factual and educational.`;

    // Appel à Ollama local
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral', // ou llama3 ou autre selon ton setup
        prompt,
        stream: false, // Pour recevoir les données en streaming
      })
    });

    const data = await ollamaRes.json();

    res.json({ analysis: data.response });
  } catch (err) {
    console.error('Error analyzing portfolio:', err);
    res.status(500).json({ message: 'Server error during analysis.' });
  }
};
