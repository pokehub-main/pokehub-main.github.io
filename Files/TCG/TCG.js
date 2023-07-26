const apiKey = 'a6bfa070-5b7e-4765-8f62-866ceea26349';
const apiUrl = 'https://api.pokemontcg.io/v2/cards';

let allCards = []; // Store all cards data



// Function to search for cards and display them on the screen
async function searchAndDisplayCards(cardName) {
    try {
        const response = await fetch(`${apiUrl}?q=name:${encodeURIComponent(cardName)}`, {
            headers: {
                'X-Api-Key': apiKey,
            },
        });
        const data = await response.json();

        allCards = data.data; // Store all cards data

        // Check if any cards were found
        if (allCards.length > 0) {
            const cardContainer = document.getElementById('card-container');
            cardContainer.innerHTML = ''; // Clear previous card information

            // Display each card on the screen
            for (const card of allCards) {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.innerHTML = `
          <a href="bio.html?id=${encodeURIComponent(card.id)}">
          <img src="${card.images.small}" alt="${card.name}">
          <h2>${card.name}</h2>
          <p>${card.supertype} - ${card.subtypes.join(', ')}</p>
          <p>Rarity: ${card.rarity}</p>
          <p>Set: ${card.set.name}</p> 
          ${card.tcgplayer && card.tcgplayer.prices ? getMarketValues(card.tcgplayer.prices) : '<p>Market Values: Not available</p>'}
        `;
                cardContainer.appendChild(cardElement);
            }
        } else {
            const cardContainer = document.getElementById('card-container');
            cardContainer.innerHTML = 'No matching cards found.';
        }
    } catch (error) {
        console.error('Error searching for cards:', error);
    }
}

function showCardDetails(cardData) {
    // Code to display card details in the card bio page
    // ...

    // Redirect to card bio page
    window.location.href = 'card_bio.html';
}



// Function to filter the cards based on rarity
function filterCards() {
    const filterSelect = document.getElementById('filter-select');
    const selectedRarity = filterSelect.value;

    const filteredCards = selectedRarity ? allCards.filter(card => card.rarity === selectedRarity) : allCards;

    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';

    if (filteredCards.length > 0) {
        for (const card of filteredCards) {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `
            <a href="bio.html?id=${encodeURIComponent(card.id)}">
            <img src="${card.images.small}" alt="${card.name}">
            <h2>${card.name}</h2>
            <p>${card.supertype} - ${card.subtypes.join(', ')}</p>
            <p>Rarity: ${card.rarity}</p>
            <p>Set: ${card.set.name}</p> 
            ${card.tcgplayer && card.tcgplayer.prices ? getMarketValues(card.tcgplayer.prices) : '<p>Market Values: Not available</p>'}
            `;
            cardContainer.appendChild(cardElement);
        }
    } else {
        cardContainer.innerHTML = 'No matching cards found.';
    }
}

// Function to filter the cards based on rarity
function filterTYPECards() {
    const filterSelect = document.getElementById('filter-select');
    const selectedTYPE = filterSelect.value;

    const filteredCards = selectedTYPE ? allCards.filter(card => card.supertype === selectedTYPE) : allCards;

    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';

    if (filteredCards.length > 0) {
        for (const card of filteredCards) {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `
            <a href="bio.html?id=${encodeURIComponent(card.id)}">
            <img src="${card.images.small}" alt="${card.name}">
            <h2>${card.name}</h2>
            <p>${card.supertype} - ${card.subtypes.join(', ')}</p>
            <p>Rarity: ${card.rarity}</p>
            <p>Set: ${card.set.name}</p> 
            ${card.tcgplayer && card.tcgplayer.prices ? getMarketValues(card.tcgplayer.prices) : '<p>Market Values: Not available</p>'}
      `;
            cardContainer.appendChild(cardElement);
        }
    } else {
        cardContainer.innerHTML = 'No matching cards found.';
    }
}

// Function to get the market values for each specific card type
function getMarketValues(prices) {
    let marketValuesHtml = '<h3>Market Values:</h3>';
    const cardTypes = {
        normal: 'Normal',
        holofoil: 'Holofoil',
        reverseHolofoil: 'Reverse Holo',
        '1stEditionHolofoil': '1st Edition Holo',
        '1stEditionNormal': '1st Edition'
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
            marketValuesHtml += `<h4>${cardTypes[cardType]}: ${marketValue}</h4>`;
        }
    } else {
        marketValuesHtml += '<p>Not available</p>';
    }

    return marketValuesHtml;
}

function searchCards() {
    const searchInput = document.getElementById('search-input').value;
    searchAndDisplayCards(searchInput);
}


const cardElements = document.querySelectorAll('.card');
cardElements.forEach((card) => {
    card.addEventListener('click', () => {
        const cardData = getCardDataFromElement(card);
        showCardDetails(cardData);
    });
});