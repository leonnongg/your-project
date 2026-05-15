module.exports = async (req, res) => {
  try {

    const response = await fetch(
      'https://de6jvomfbm0af.cloudfront.net/public/offers/feed.php?user_id=777591&api_key=fc3d56106a3668c1e98c'
    );

    const offers = await response.json();

    // Remove CPI/install offers
    const filtered = offers.filter(offer => {
      const text = JSON.stringify(offer).toLowerCase();

      return (
        !text.includes('install') &&
        !text.includes('android') &&
        !text.includes('ios') &&
        !text.includes('app')
      );
    });

    // Sort highest paying first
    filtered.sort((a, b) => {

      const payA =
        parseFloat(
          String(a.conversion || '0')
          .replace(/[^0-9.]/g, '')
        ) || 0;

      const payB =
        parseFloat(
          String(b.conversion || '0')
          .replace(/[^0-9.]/g, '')
        ) || 0;

      return payB - payA;
    });

    // Send top 3
    res.status(200).json(filtered.slice(0, 3));

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: 'Failed to fetch offers'
    });

  }
};
