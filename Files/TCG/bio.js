const apiKey = 'a6bfa070-5b7e-4765-8f62-866ceea26349';
const apiUrl = 'https://api.pokemontcg.io/v2/cards';

document.addEventListener('DOMContentLoaded', () => {
    const cardImage = document.getElementById('card-image');
    const cardTitle = document.querySelector('.card-title');
    const cardDetails = document.querySelector('.card-info-details');
    const attackListElem = document.getElementById('attack-list');
    const cardBioContainer = document.getElementById('card-bio-container');
    const cardEnlargedOverlay = document.getElementById('card-enlarged-overlay');
    const enlargedCardImage = document.getElementById('enlarged-card-image');
    const closeButton = document.getElementById('close-button');

    // Get the card ID from the URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const cardId = queryParams.get('id');

    if (cardId) {
        // Fetch card data by ID
        (async() => {
            try {
                const response = await fetch(`${apiUrl}/${cardId}`, {
                    headers: {
                        'X-Api-Key': apiKey,
                    },
                });
                const data = await response.json();

                if (data) {
                    const card = data.data;

                    // Display card image
                    const cardImageElem = document.createElement('img');
                    cardImageElem.src = card.images.large;
                    cardImageElem.alt = card.name;
                    cardImage.innerHTML = '';
                    cardImage.appendChild(cardImageElem);

                    // Display card title
                    cardTitle.textContent = (card.name + ' - ' + card.set.name + ' (' + card.number + '/' + card.set.printedTotal + ')');

                    // Display card details
                    cardDetails.innerHTML = `
                    <p>Set: ${card.set.name}</p>
                    <p>Rarity: ${card.rarity}</p>
                    <p>Type: ${card.supertype}</p>
                    <p>Card Type: ${card.subtypes}</p>
                    <p>Artist: ${card.artist}</p>
                    ${card.tcgplayer && card.tcgplayer.prices ? getMarketValues(card.tcgplayer.prices) : '<p>Market Values: Not available</p>'}
                    `;
                    // Display attack list
                    attackListElem.innerHTML = ''; // Clear existing content
                    if (card.attacks && card.attacks.length > 0) {
                        for (const attack of card.attacks) {
                            const attackListItem = document.createElement('li');
                            attackListItem.innerHTML = `
                <h4>${getEnergyIcon(attack.cost)} ${attack.name} - ${attack.damage}</h4>
                <p>${attack.text}</p>
              `;
                            attackListElem.appendChild(attackListItem);
                        }
                    } else {
                        attackListElem.innerHTML = '<p>No attacks found for this card.</p>';
                    }
                } else {
                    cardTitle.textContent = 'No card data found.';
                }
            } catch (error) {
                console.error('Error fetching card data:', error);
            }
        })();
    } else {
        cardTitle.textContent = 'No card ID found.';
    }

    cardImage.addEventListener('click', () => {
        cardBioContainer.classList.add('enlarged');
        enlargedCardImage.src = cardImage.firstElementChild.src.replace('/small/', '/large/');
        cardEnlargedOverlay.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        cardBioContainer.classList.remove('enlarged');
        cardEnlargedOverlay.style.display = 'none';
        enlargedCardImage.src = ''; // Reset the enlarged image
    });
});

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

    availableCardTypes.sort();

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

function getEnergyIcon(energyCost) {
    let energyIconsHtml = '';

    // Map energy cost to corresponding energy icons and text colors
    const energyIcons = {
        Colorless: { icon: 'C', color: '#f2f2f2' },
        Grass: { icon: 'g', color: '#78c850' },
        Fire: { icon: 'B', color: '#f04630' },
        Water: { icon: 'w', color: '#6890f0' },
        Lightning: { icon: 'l', color: '#f8d030' },
        Psychic: { icon: 'P', color: '#b27ad5' },
        Fighting: { icon: 'F', color: '#b36e4e' },
        Darkness: { icon: 'D', color: '#34302d' },
        Metal: { icon: 'M', color: '#b8b8d0' },
        Fairy: { icon: 'Y', color: '#c36479' },
        Dragon: { icon: 'N', color: '#9b6e29' },
    };

    for (const energy of energyCost) {
        const energyData = energyIcons[energy];
        if (energyData) {
            energyIconsHtml += `<span class="energy-icons" style="color: ${energyData.color}">${energyData.icon}</span>`;
        }
    }

    return energyIconsHtml;
}