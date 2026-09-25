/**
 * wanderlust-email.js
 * Generates dynamic travel email content
 * Replace AMPscript variables with JavaScript-driven values
 */

// ============================================
// CONFIGURATION
// ============================================
const config = {
    baseUrl: 'https://wanderlust-travel.com',
    // Use relative paths for images - will work both locally and when deployed
    imageBase: './images',
    discountPercentages: {
        Platinum: 20,
        Gold: 15,
        Silver: 10,
        Bronze: 5
    },
    styles: ['Beach', 'Adventure', 'Culture', 'Wildlife', 'Foodie', 'City'],
    destinations: [
        { name: 'Bali Paradise', tagline: 'Tropical vibes await', style: 'Beach', price: 599, img: 'dest-Beach.jpg' },
        { name: 'Alpine Adventure', tagline: 'Mountain peaks calling', style: 'Adventure', price: 799, img: 'dest-Adventure.jpg' },
        { name: 'Rome Eternal', tagline: 'History in every corner', style: 'Culture', price: 899, img: 'dest-Culture.jpg' },
        { name: 'Safari Dreams', tagline: 'Wild encounters guaranteed', style: 'Wildlife', price: 1299, img: 'dest-Wildlife.jpg' },
        { name: 'Paris Gourmet', tagline: 'Culinary delights', style: 'Foodie', price: 999, img: 'dest-Foodie.jpg' },
        { name: 'Tokyo Modern', tagline: 'Future meets tradition', style: 'City', price: 1099, img: 'dest-City.jpg' }
    ]
};

// ============================================
// DATA GENERATORS
// ============================================

// Simulating SFMC attribute values (for demo)
const mockUserData = {
    FirstName: ['Alex', 'Jordan', 'Taylor', 'Casey', 'Sam', 'Riley'],
    LastDestination: ['Bali', 'Tokyo', 'Paris', 'New York', 'London', 'Sydney'],
    TravelStyle: ['Beach', 'Adventure', 'Culture', 'Wildlife', 'Foodie', 'City'],
    LoyaltyTier: ['Platinum', 'Gold', 'Silver', 'Bronze'],
    HomeCity: ['San Francisco', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Austin']
};

// Generate random date in past (0-180 days ago)
function getRandomPastDate() {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

// Calculate days since a date
function calculateDaysSince(dateString) {
    if (!dateString) return 0;
    const diff = Date.now() - new Date(dateString).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Pick random element from array
function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================
// CORE GENERATION FUNCTIONS
// ============================================

/**
 * Generate user profile data
 */
function generateUserProfile() {
    const hasTrip = Math.random() > 0.1 ? true : false; // 90% have trip history

    return {
        fName: randomChoice(mockUserData.FirstName),
        lastDest: hasTrip ? randomChoice(mockUserData.LastDestination) : '',
        lastTripDate: hasTrip ? getRandomPastDate() : '',
        style: randomChoice(mockUserData.TravelStyle),
        tier: randomChoice(mockUserData.LoyaltyTier),
        points: Math.floor(Math.random() * 100000) + 500,
        homeCity: randomChoice(mockUserData.HomeCity)
    };
}

/**
 * Match destination based on travel style
 */
function getRecommendedDestination(style) {
    let filtered = config.destinations.filter(d => d.style === style);

    if (filtered.length === 0) {
        filtered = config.destinations;
    }

    const dest = randomChoice(filtered);

    return {
        destName: dest.name,
        destTagline: dest.tagline,
        destImg: `${config.imageBase}/${dest.img}`,
        destPrice: dest.price,
        bookURL: `${config.baseUrl}/book?dest=${encodeURIComponent(dest.name)}`,
        nights: Math.floor(Math.random() * 5) + 3, // 3-7 nights
        country: 'Surprise Country',
        region: 'Any Region'
    };
}

/**
 * Get tier discount and perk info
 */
function getTierInfo(tier) {
    const disc = config.discountPercentages[tier] || 5;

    const perks = {
        Platinum: 'Platinum members save 20% + free room upgrade + priority boarding',
        Gold: 'Gold members save 15% + free airport lounge access',
        Silver: 'Silver members save 10% on every trip',
        Bronze: 'Bronze members save 5% on every trip'
    };

    return {
        disc,
        tierPerk: perks[tier] || perks.Bronze
    };
}

/**
 * Calculate sale price
 */
function calculatePricing(basePrice, discount) {
    const baseNum = parseInt(basePrice.replace('$', '').replace(',', ''));
    const salePrice = Math.round(baseNum * (100 - discount) / 100);

    return {
        baseFmt: `$${baseNum.toLocaleString()}`,
        saleFmt: `$${salePrice.toLocaleString()}`
    };
}

/**
 * Format date and calculate days since
 */
function formatDateInfo(lastTripDate) {
    if (!lastTripDate) {
        return {
            lastTripFmt: 'Recently',
            daysSince: 0,
            dayWord: 'days'
        };
    }

    const dateObj = new Date(lastTripDate);
    const formatted = dateObj.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const daysSince = calculateDaysSince(lastTripDate);
    const dayWord = daysSince === 1 ? 'day' : 'days';

    return {
        lastTripFmt: formatted,
        daysSince,
        dayWord
    };
}

/**
 * Get emoji based on travel style
 */
function getEmojiForStyle(style) {
    const emojis = {
        Beach: '🏖️',
        Adventure: '🪂',
        City: '🏙️',
        Culture: '🏛️',
        Wildlife: '🦁',
        Foodie: '🍽️'
    };
    return emojis[style] || '🌍';
}

/**
 * Get hero image path
 */
function getHeroImage(style) {
    const styleLower = style.toLowerCase();
    const validStyles = ['beach', 'adventure', 'culture', 'wildlife', 'foodie', 'city'];

    if (validStyles.includes(styleLower)) {
        // Capitalize first letter of style to match actual filenames
        const styleCapitalized = style.charAt(0).toUpperCase() + style.slice(1).toLowerCase();
        return `${config.imageBase}/hero-${styleCapitalized}.jpg`;
    }
    // Fallback to beach hero image instead of general (which doesn't exist locally)
    return `${config.imageBase}/hero-Beach.jpg`;
}

/**
 * Generate preheader text
 */
function generatePreheader(fName, hasTrip, daysSince, dayWord, lastDest, destName) {
    if (hasTrip && daysSince > 0) {
        return `${fName}, it's been ${daysSince} ${dayWord} since ${lastDest}. Ready for ${destName}?`;
    }
    return `${fName}, your next escape is ready.`;
}

/**
 * MAIN: Generate ALL data at once
 */
function generateEmailData() {
    const userProfile = generateUserProfile();
    const destination = getRecommendedDestination(userProfile.style);
    const tierInfo = getTierInfo(userProfile.tier);
    const pricing = calculatePricing(destination.destPrice, tierInfo.disc);
    const dateInfo = formatDateInfo(userProfile.lastTripDate);

    const hasTrip = !!userProfile.lastTripDate;
    const preheader = generatePreheader(userProfile.fName, hasTrip, dateInfo.daysSince, dateInfo.dayWord, userProfile.lastDest || 'somewhere amazing', destination.destName);

    return {
        // User fields
        fName: userProfile.fName,
        lastDest: userProfile.lastDest || 'somewhere amazing',
        lastTripDate: userProfile.lastTripDate || '',
        lastTripFmt: dateInfo.lastTripFmt,
        daysSince: dateInfo.daysSince,
        dayWord: dateInfo.dayWord,
        style: userProfile.style,
        tier: userProfile.tier,
        points: userProfile.points,
        pointsFmt: userProfile.points.toLocaleString(),
        homeCity: userProfile.homeCity,
        hasTrip,

        // Destination fields
        destName: destination.destName,
        destTagline: destination.destTagline,
        destImg: destination.destImg,
        destAlt: `Discover ${destination.destName}`,
        destPrice: destination.destPrice,
        saleFmt: pricing.saleFmt,
        baseFmt: pricing.baseFmt,
        bookURL: destination.bookURL,
        ctaText: `Book ${destination.destName}`,
        nights: destination.nights,
        country: destination.country,
        region: destination.region,

        // Tier fields
        disc: tierInfo.disc,
        tierPerk: tierInfo.tierPerk,

        // Visual fields
        emoji: getEmojiForStyle(userProfile.style),
        heroImg: getHeroImage(userProfile.style),
        heroAlt: 'Your next escape awaits',

        // Content fields
        preheader: preheader,
        headline: `Where to next, ${userProfile.fName}?`,
        subhead: `We matched you with ${destination.destName}, picked for your ${userProfile.style} travel style.`
    };
}

// ============================================
// DOM INJECTION (Run after page load)
// ============================================

function injectEmailContent(data) {
    // Map data to HTML placeholders
    const replacements = {
        '@fName': data.fName,
        '@lastDest': data.lastDest,
        '@lastTripFmt': data.lastTripFmt,
        '@daysSince': data.daysSince,
        '@dayWord': data.dayWord,
        '@style': data.style,
        '@tier': data.tier,
        '@pointsFmt': data.pointsFmt,
        '@destName': data.destName,
        '@destTagline': data.destTagline,
        '@saleFmt': data.saleFmt,
        '@baseFmt': data.baseFmt,
        '@tierPerk': data.tierPerk,
        '@ctaText': data.ctaText,
        '@headline': data.headline,
        '@subhead': data.subhead,
        '@preheader': data.preheader,
        '@emoji': data.emoji,

        // Images
        '@heroImg': data.heroImg,
        '@destImg': data.destImg,

        // Alt text
        '@heroAlt': data.heroAlt,
        '@destAlt': data.destAlt,

        // Links
        '@bookURL': data.bookURL
    };

    // Text replacements
    Object.keys(replacements).forEach(key => {
        document.querySelectorAll(`[data-field="${key}"]`).forEach(el => {
            el.textContent = replacements[key];
        });

        // Also handle old %%=v(@var)=%% style placeholders
        document.body.innerHTML = document.body.innerHTML.replaceAll(
            new RegExp(`%%=v\\(@${key.replace('@', '')}\\)=%%`, 'g'),
            replacements[key]
        );
    });
}
// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const emailData = generateEmailData();
    console.log('Generated Email Data:', emailData);

    // Inject into DOM
    injectEmailContent(emailData);

    // Optional: expose for debugging/testing
    window.emailData = emailData;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateEmailData, generateUserProfile, config };
}