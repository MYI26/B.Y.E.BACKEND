const Transaction = require('../models/Transaction');

exports.analyzePortfolio = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Récupérer les transactions de l'utilisateur
    const transactions = await Transaction.find({ userId });

    if (transactions.length === 0) {
      return res.status(400).json({ message: "Aucune transaction trouvée pour cet utilisateur." });
    }

    // Construction du prompt à envoyer au LLM
    let prompt = `Voici les actions actuellement détenues par l'utilisateur, avec leurs opérations d'achat/vente :\n\n`;

    for (const tx of transactions) {
      prompt += `- ${tx.type.toUpperCase()} ${tx.quantity} actions de ${tx.stockSymbol} à ${tx.pricePerUnit}$ le ${new Date(tx.date).toLocaleDateString()}\n`;
    }

    prompt += `\nAnalyse ce portefeuille du point de vue financier (performance, diversification, risques, conseils, etc) en restant factuel et pédagogique.`;

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
    console.error('Erreur analyse portefeuille :', err);
    res.status(500).json({ message: 'Erreur serveur pendant l\'analyse.' });
  }
};
