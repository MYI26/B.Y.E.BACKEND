exports.getStockData = async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  const polygonKey = process.env.POLYGON_API_KEY;
  const twelveKey = process.env.TWELVE_API_KEY;

  try {
    // 1. Nom complet (Polygon.io)
    const urlName = `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${polygonKey}`;
    const respName = await fetch(urlName);
    const dataName = await respName.json();
    const name = dataName?.results?.name || 'Nom inconnu';

    // 2. Données de prix (TwelveData)
    const urlPrices = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=2&apikey=${twelveKey}`;
    const respPrices = await fetch(urlPrices);
    const dataPrices = await respPrices.json();

    const today = dataPrices?.values?.[0];
    const yesterday = dataPrices?.values?.[1];

    if (!today || !yesterday) {
      return res.status(404).json({ message: 'Données de prix indisponibles' });
    }

    const roundedPrice = Math.round(parseFloat(today.close) * 100) / 100;
    const roundedOpen = Math.round(parseFloat(today.open) * 100) / 100;
    const close = Math.round(parseFloat(yesterday.close) * 100) / 100;
    const percentage = Math.round(((roundedPrice - close) / close) * 10000) / 100;

    // 3. Logo (TwelveData)
    const urlLogo = `https://api.twelvedata.com/logo?symbol=${symbol}&apikey=${twelveKey}`;
    const respLogo = await fetch(urlLogo);
    const dataLogo = await respLogo.json();

    const logoUrl = dataLogo?.url || '';

    // 4. Retour
    return res.json({
      ticker: symbol,
      name,
      price: roundedPrice,
      open: roundedOpen,
      close,
      percentage,
      logoUrl
    });

  } catch (err) {
    console.error('Error recovery stock :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
