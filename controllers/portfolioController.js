const Transaction = require('../models/Transaction');     

exports.getPortfolio = async (req, res) => {        // Récupérer le portefeuille de l'utilisateur connecté
  const userId = req.user.userId;     // ID de l'utilisateur connecté
  const twelveKey = process.env.TWELVE_API_KEY2;

  try {
    // 1. Récupérer toutes les transactions de l'utilisateur
    const transactions = await Transaction.find({ userId });

    // 2. Grouper par symbol
    const portfolioMap = new Map();     // Utilisation d'une Map pour regrouper les transactions par symbole

    for (const tx of transactions) {        // Parcourir chaque transaction
      const { stockSymbol, type, quantity, pricePerUnit, logoUrl } = tx;
      
      if (!portfolioMap.has(stockSymbol)) {    // Si le symbole n'existe pas encore dans la Map
        portfolioMap.set(stockSymbol, {
          stockSymbol,
          logoUrl,
          totalBuy: 0,
          totalSell: 0,
          invested: 0
        });
      }

      const entry = portfolioMap.get(stockSymbol);     // Récupérer l'entrée correspondante au symbole

      if (type === 'buy') {
        entry.totalBuy += quantity;
        entry.invested += pricePerUnit * quantity;
      } else if (type === 'sell') {
        entry.totalSell += quantity;
        entry.invested -= pricePerUnit * quantity; // optional adjustment
      }

      portfolioMap.set(stockSymbol, entry);      // Mettre à jour l'entrée dans la Map
    }

    const portfolio = [];       // Tableau pour stocker les lignes du portefeuille
    let totalInitial = 0;       // Valeur initiale totale investie
    let totalCurrent = 0;       // Valeur actuelle totale du portefeuille

    for (const [stockSymbol, data] of portfolioMap) {
      const quantity = +(data.totalBuy - data.totalSell).toFixed(2);// Calculer la quantité nette de l'actif

      if (quantity <= 0) continue; // stock liquidé, on ignore
      // Récupère prix courant
      const urlPrices = `https://api.twelvedata.com/time_series?symbol=${stockSymbol}&interval=1day&outputsize=2&apikey=${twelveKey}`;
      const respPrices = await fetch(urlPrices);
      const dataPrices = await respPrices.json();
      const today = dataPrices?.values?.[0];
      if (!today) {
      return res.status(404).json({ message: 'Données de prix indisponibles' });
    }
      const roundedPrice = Math.round(parseFloat(today.close) * 100) / 100;
      console.log('roundedPrice', roundedPrice);
      const totalPrice = +(data.invested).toFixed(2);// Prix total investi pour ce symbole
      const currentTotal = +(roundedPrice * quantity).toFixed(2);// Valeur actuelle totale de ce symbole
      const performance$ = +(currentTotal - totalPrice).toFixed(2);
      const performancePercent = +((performance$ / totalPrice) * 100).toFixed(2);

      // Ajout à la liste des lignes
      portfolio.push({
        stockSymbol,
        logoUrl: data.logoUrl,
        quantity,
        totalPrice,
        currentTotal,
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
