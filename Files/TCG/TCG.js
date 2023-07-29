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
            <h2>(${card.number}/${card.set.printedTotal})</h2>
            <p>${card.supertype} - ${card.subtype}</p>
            <p>Rarity: ${card.rarity}</p>
            <p>Set: ${card.set.name}</p>
            ${card.tcgplayer && card.tcgplayer.prices ? getMarketValues(card.tcgplayer.prices) : '<p>Market Values: Not available</p>'}
          </a>
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

    availableCardTypes.sort(); // Sort the card types alphabetically

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

// Function to filter the cards based on user's selection
function applyFiltersAndSort() {
    const nameFilter = document.getElementById('search-input').value.trim();
    let subtypeFilter = document.getElementById('filter-select').value;
    let typeFilter = document.getElementById('type-select').value;

    // Reset filter values to default ("all") if "All" is selected
    if (subtypeFilter === 'all') {
        subtypeFilter = '';
    }
    if (typeFilter === 'all') {
        typeFilter = '';
    }

    const filteredCards = allCards.filter(card => {
        // Apply filters
        const nameMatches = nameFilter === '' || card.name.toLowerCase().includes(nameFilter.toLowerCase());
        const subtypeMatches = subtypeFilter === '' || card.subtypes.includes(subtypeFilter);
        const typeMatches = typeFilter === '' || card.supertype === typeFilter;

        // Return true only if all active filters match
        return nameMatches && subtypeMatches && typeMatches;
    });

    // Display the filtered cards
    displayFilteredCards(filteredCards);
}



// Function to display the filtered cards
function displayFilteredCards(filteredCards) {
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
          <h2>(${card.number}/${card.set.printedTotal})</h2>
          <p>${card.supertype} - ${card.subtype}</p>
          <p>Rarity: ${card.rarity}</p>
          <p>Set: ${card.set.name}</p>
          ${card.tcgplayer && card.tcgplayer.prices ? getMarketValues(card.tcgplayer.prices) : '<p>Market Values: Not available</p>'}
        </a>
      `;
            cardContainer.appendChild(cardElement);
        }
    } else {
        const searchInput = document.getElementById('search-input').value.trim();
        cardContainer.innerHTML = searchInput !== '' ? 'No matching cards found.' : '';
    }
}

// Function to sort the cards by card number in ascending order
function sortByCardNumberAscending() {
    const sortedCards = allCards.slice().sort((a, b) => {
        // Convert the card numbers to integers for comparison
        const aNumber = parseInt(a.number);
        const bNumber = parseInt(b.number);
        return aNumber - bNumber;
    });
    displayFilteredCards(sortedCards);
}

// Function to sort the cards by card name in ascending order
function sortByNameAscending() {
    const sortedCards = allCards.slice().sort((a, b) => a.name.localeCompare(b.name));
    displayFilteredCards(sortedCards);
}

// Function to sort the cards by card name in descending order
function sortByNameDescending() {
    const sortedCards = allCards.slice().sort((a, b) => b.name.localeCompare(a.name));
    displayFilteredCards(sortedCards);
}

// Function to get the average market value for a card
function getAverageMarketValue(prices) {
    const cardTypes = {
        normal: 'Normal',
        holofoil: 'Holofoil',
        reverseHolofoil: 'Reverse Holo',
        '1stEditionHolofoil': '1st Edition Holo',
        '1stEditionNormal': '1st Edition'
    };

    let totalMarketValue = 0;
    let numCardTypes = 0;

    for (const cardType in cardTypes) {
        if (prices[cardType] && prices[cardType].market) {
            totalMarketValue += prices[cardType].market;
            numCardTypes++;
        }
    }

    if (numCardTypes > 0) {
        return totalMarketValue / numCardTypes;
    } else {
        return 0;
    }
}

// Function to sort the cards by average market price in descending order
function sortByAverageMarketPriceDescending() {
    const sortedCards = allCards.slice().sort((a, b) => {
        const aAverageMarketPrice = a.tcgplayer ? getAverageMarketValue(a.tcgplayer.prices) : 0;
        const bAverageMarketPrice = b.tcgplayer ? getAverageMarketValue(b.tcgplayer.prices) : 0;
        return bAverageMarketPrice - aAverageMarketPrice;
    });
    displayFilteredCards(sortedCards);
}

// Function to sort the cards by average market price in ascending order
function sortByAverageMarketPriceAscending() {
    const sortedCards = allCards.slice().sort((a, b) => {
        const aAverageMarketPrice = a.tcgplayer ? getAverageMarketValue(a.tcgplayer.prices) : 0;
        const bAverageMarketPrice = b.tcgplayer ? getAverageMarketValue(b.tcgplayer.prices) : 0;
        return aAverageMarketPrice - bAverageMarketPrice;
    });
    displayFilteredCards(sortedCards);
}

// Function to sort the cards based on user's selection
function sortCards() {
    const sortSelect = document.getElementById('sort-select').value;
    let sortedCards;

    switch (sortSelect) {
        case 'cardNumberAsc':
            sortedCards = allCards.slice().sort((a, b) => {
                const aNumber = parseInt(a.number);
                const bNumber = parseInt(b.number);
                return aNumber - bNumber;
            });
            break;
        case 'nameAsc':
            sortedCards = allCards.slice().sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'nameDesc':
            sortedCards = allCards.slice().sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'marketPriceDesc':
            sortedCards = allCards.slice().sort((a, b) => {
                const aAverageMarketPrice = a.tcgplayer ? getAverageMarketValue(a.tcgplayer.prices) : 0;
                const bAverageMarketPrice = b.tcgplayer ? getAverageMarketValue(b.tcgplayer.prices) : 0;
                return bAverageMarketPrice - aAverageMarketPrice;
            });
            break;
        case 'marketPriceAsc':
            sortedCards = allCards.slice().sort((a, b) => {
                const aAverageMarketPrice = a.tcgplayer ? getAverageMarketValue(a.tcgplayer.prices) : 0;
                const bAverageMarketPrice = b.tcgplayer ? getAverageMarketValue(b.tcgplayer.prices) : 0;
                return aAverageMarketPrice - bAverageMarketPrice;
            });
            break;
        default:
            // Default sorting is by card number ascending
            sortedCards = allCards.slice().sort((a, b) => {
                const aNumber = parseInt(a.number);
                const bNumber = parseInt(b.number);
                return aNumber - bNumber;
            });
            // Set the default sorting option to "cardNumberAsc"
            document.getElementById('sort-select').value = 'cardNumberAsc';
            break;
    }

    displayFilteredCards(sortedCards);
}


// Attach event listeners once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-button').addEventListener('click', () => {
        searchAndDisplayCards(document.getElementById('search-input').value);
    });

    document.getElementById('search-input').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchAndDisplayCards(document.getElementById('search-input').value);
        }
    });

    document.getElementById('filter-select').addEventListener('change', applyFiltersAndSort);
    document.getElementById('sort-select').addEventListener('change', sortCards);
    document.getElementById('type-select').addEventListener('change', applyFiltersAndSort); // New: Listen for type filter changes

    // Fetch card data and display cards when the page loads
    (async() => {
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'X-Api-Key': apiKey,
                },
            });
            const data = await response.json();

            allCards = data.data; // Store all cards data
            applyFiltersAndSort(); // Display all cards initially
        } catch (error) {
            console.error('Error fetching card data:', error);
        }
    })();
});