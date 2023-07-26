const apiKey = 'a6bfa070-5b7e-4765-8f62-866ceea26349';
const apiUrl = 'https://api.pokemontcg.io/v2/cards';

// Function to fetch and display the full bio of the card
// ... (previous code)

// Function to fetch and display the full bio of the card
async function displayCardBio(cardId) {
    try {
        const response = await fetch(`${apiUrl}/${encodeURIComponent(cardId)}`, {
            headers: {
                'X-Api-Key': apiKey,
            },
        });
        const card = await response.json();

        // Display the card's full bio on the page
        const cardBioContainer = document.getElementById('card-bio-container');
        cardBioContainer.innerHTML = `
      <div class="card-info">
        <div class="card-image">
          <img src="${card.data.images.large}" alt="${card.data.name}">
        </div>
        <div class="card-details">
          <h2>${card.data.name} - ${card.data.set.name} (${card.data.number}/${card.data.set.printedTotal})</h2>
          <p>${card.data.supertype} - ${card.data.subtypes.join(', ')}</p>
          <p>Rarity: ${card.data.rarity}</p>
          ${card.data.tcgplayer && card.data.tcgplayer.prices ? getMarketValues(card.data.tcgplayer.prices) : '<p>Market Values: Not available</p>'}
          <p>Updated At: ${card.data.tcgplayer.updatedAt}</p>
          <p>CardMarket Prices:</p>
          <p>Average Sell: ${card.data.cardmarket.averageSellPrice}</p> 
        </div>
      </div>
    `;
    } catch (error) {
        console.error('Error loading card bio:', error);
    }
}

// ... (previous code)


// Function to get the market values for each specific card type
function getMarketValues(prices) {
    let marketValuesHtml = '<p>Market Values(TCGPLAYER):</p>';
    const cardTypes = {
        normal: 'Standard',
        holofoil: 'Holofoil',
        reverseHolofoil: 'Reverse Holofoil',
        '1stEditionHolofoil': '1st Edition Holofoil',
        '1stEditionNormal': '1st Edition Standard'
    };

    let availableCardTypes = [];
    for (const cardType in cardTypes) {
        if (prices[cardType]) {
            availableCardTypes.push(cardType);
        }
    }

    if (availableCardTypes.length > 0) {
        for (const cardType of availableCardTypes) {
            const marketValue = prices[cardType].market ? `$${prices[cardType].market}` : 'Not available';
            marketValuesHtml += `<p>${cardTypes[cardType]}: ${marketValue}</p>`;
        }
    } else {
        marketValuesHtml += '<p>Not available</p>';
    }

    return marketValuesHtml;
}


// Load the card bio when the page loads (get the card ID from the URL)
const urlParams = new URLSearchParams(window.location.search);
const cardId = urlParams.get('id');
if (cardId) {
    displayCardBio(cardId);
}