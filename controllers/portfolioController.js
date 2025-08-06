const Transaction = require('../models/Transaction');

exports.getPortfolio = async (req, res) => {        // Récupérer le portefeuille de l'utilisateur connecté
  const userId = req.user.userId;
  const twelveKey = process.env.TWELVE_API_KEY;

  try {
    // 1. Récupérer toutes les transactions de l'utilisateur
    const transactions = await Transaction.find({ userId });

    // 2. Grouper par symbol
    const portfolioMap = new Map();

    for (const tx of transactions) {
      const { symbol, type, quantity, pricePerUnit, logoUrl } = tx;

      if (!portfolioMap.has(symbol)) {
        portfolioMap.set(symbol, {
          symbol,
          logoUrl,
          totalBuy: 0,
          totalSell: 0,
          invested: 0
        });
      }

      const entry = portfolioMap.get(symbol);

      if (type === 'buy') {
        entry.totalBuy += quantity;
        entry.invested += pricePerUnit * quantity;
      } else if (type === 'sell') {
        entry.totalSell += quantity;
        entry.invested -= pricePerUnit * quantity; // optional adjustment
      }

      portfolioMap.set(symbol, entry);
    }

    const portfolio = [];
    let totalInitial = 0;
    let totalCurrent = 0;

    for (const [symbol, data] of portfolioMap) {
      const quantity = +(data.totalBuy - data.totalSell).toFixed(2);

      if (quantity <= 0) continue; // stock liquidé, on ignore

      // Récupère prix courant
      const url = `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${twelveKey}`;
      const response = await fetch(url);
      const priceData = await response.json();

      const currentPrice = parseFloat(priceData.price);
      const totalPrice = +(data.invested).toFixed(2);
      const currentTotal = +(currentPrice * quantity).toFixed(2);
      const performance$ = +(currentTotal - totalPrice).toFixed(2);
      const performancePercent = +((performance$ / totalPrice) * 100).toFixed(2);

      // Ajout à la liste des lignes
      portfolio.push({
        symbol,
        logoUrl: data.logoUrl,
        quantity,
        totalPrice,
        currentPrice,
        performanceDollar: performance$,
        performancePercent: performancePercent
      });

      totalInitial += totalPrice;
      totalCurrent += currentTotal;
    }

    const liquidity = 2000; // à modifier plus tard
    const globalPerf$ = +(totalCurrent - totalInitial).toFixed(2);
    const globalPerfPercent = +((globalPerf$ / totalInitial) * 100).toFixed(2);
    const portfolioValue = +(totalCurrent + liquidity).toFixed(2);

    res.json({
      portfolio,
      summary: {
        initialValue: +totalInitial.toFixed(2),
        currentValue: +totalCurrent.toFixed(2),
        performanceDollar: globalPerf$,
        performancePercent: globalPerfPercent,
        liquidity,
        portfolioValue
      }
    });

  } catch (err) {
    console.error('Erreur portefeuille :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
