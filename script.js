// Spotify Clone JavaScript Functionality

// Global variables
let currentSong = 0;
let isPlaying = false;
let currentTime = 0;
let duration = 213; // 3:33 in seconds
let volume = 50;

// Sample songs data
const songs = [
    {
        title: "Daylight",
        artist: "David Kushner",
        image: "./card4img.jpeg",
        duration: "3:33",
        genre: "Pop"
    },
    {
        title: "Top 50 Global",
        artist: "Various Artists",
        image: "./card1img.jpeg",
        duration: "4:12",
        genre: "Pop"
    },
    {
        title: "Trending Hits",
        artist: "Various Artists",
        image: "./card2img.jpeg",
        duration: "3:45",
        genre: "Electronic"
    },
    {
        title: "Chill Vibes",
        artist: "Lo-Fi Beats",
        image: "./card3img.jpeg",
        duration: "2:58",
        genre: "Chill"
    },
    {
        title: "Rock Classics",
        artist: "Rock Legends",
        image: "./card5img.jpeg",
        duration: "5:21",
        genre: "Rock"
    },
    {
        title: "Top Songs India",
        artist: "Bollywood Hits",
        image: "./card6img.jpeg",
        duration: "4:05",
        genre: "Bollywood"
    }
];

// Playlists data
let userPlaylists = [
    {
        name: "My Playlist #1",
        songs: [0, 1, 2],
        image: "./card1img.jpeg"
    },
    {
        name: "Favorites",
        songs: [0, 3, 4],
        image: "./card2img.jpeg"
    }
];

// Search data
let searchHistory = [];
let currentSearchResults = [];

// DOM Elements
const playPauseBtn = document.querySelector('.player-control-icon[src="./player_icon3.png"]');
const prevBtn = document.querySelector('.player-control-icon[src="./player_icon2.png"]');
const nextBtn = document.querySelector('.player-control-icon[src="./player_icon4.png"]');
const shuffleBtn = document.querySelector('.player-control-icon[src="./player_icon1.png"]');
const repeatBtn = document.querySelector('.player-control-icon[src="./player_icon5.png"]');
const progressBar = document.querySelector('.progress-bar');
const currentTimeSpan = document.querySelector('.curr-time');
const totalTimeSpan = document.querySelector('.tot-time');
const albumImg = document.querySelector('.album-img');
const albumTitle = document.querySelector('.album-title');
const albumSinger = document.querySelector('.album-singer-name');
const heartIcon = document.querySelector('.heart');
const cards = document.querySelectorAll('.card');
const navOptions = document.querySelectorAll('.nav-option');
const createPlaylistBtn = document.querySelector('.badge');
const browsePodcastsBtn = document.querySelectorAll('.badge')[1];
const backwardBtn = document.querySelector('img[src="./backward_icon.png"]');
const forwardBtn = document.querySelector('img[src="./forward_icon.png"]');
const installAppBtn = document.querySelector('.dark-badge');
const explorePremiumBtn = document.querySelector('.badge.nav-item.hide');
const userIcon = document.querySelector('.fa-user');
const plusIcon = document.querySelector('.fa-plus');
const arrowRightIcon = document.querySelector('.fa-arrow-right');
const laptopIcon = document.querySelector('.laptop');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializePlayer();
    setupEventListeners();
    setupCardHoverEffects();
    setupNavigationEffects();
    setupSearchFunctionality();
    setupAllButtonFunctionality();
});

// Initialize player with first song
function initializePlayer() {
    updatePlayerDisplay();
    progressBar.value = 0;
    currentTimeSpan.textContent = formatTime(0);
    totalTimeSpan.textContent = songs[currentSong].duration;
}

// Setup all event listeners
function setupEventListeners() {
    // Player controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', previousSong);
    nextBtn.addEventListener('click', nextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    // Progress bar
    progressBar.addEventListener('input', seekSong);
    progressBar.addEventListener('change', seekSong);
    
    // Heart icon (like/unlike)
    heartIcon.addEventListener('click', toggleLike);
    
    // Navigation
    navOptions.forEach(option => {
        option.addEventListener('click', handleNavigation);
    });
    
    // Playlist creation
    createPlaylistBtn.addEventListener('click', createPlaylist);
    browsePodcastsBtn.addEventListener('click', browsePodcasts);
    
    // Card clicks
    cards.forEach((card, index) => {
        card.addEventListener('click', () => playFromCard(index));
    });
}

// Setup all additional button functionality
function setupAllButtonFunctionality() {
    // Navigation buttons
    if (backwardBtn) {
        backwardBtn.addEventListener('click', goBack);
    }
    if (forwardBtn) {
        forwardBtn.addEventListener('click', goForward);
    }

    // Top navigation buttons
    if (installAppBtn) {
        installAppBtn.addEventListener('click', installApp);
    }
    if (explorePremiumBtn) {
        explorePremiumBtn.addEventListener('click', explorePremium);
    }
    if (userIcon) {
        userIcon.addEventListener('click', showUserMenu);
    }

    // Library buttons
    if (plusIcon) {
        plusIcon.addEventListener('click', addToLibrary);
    }
    if (arrowRightIcon) {
        arrowRightIcon.addEventListener('click', expandLibrary);
    }
    if (laptopIcon) {
        laptopIcon.addEventListener('click', connectDevice);
    }
}

// Play/Pause functionality
function togglePlayPause() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        playPauseBtn.src = './player_icon3.png'; // Keep play icon for demo
        playPauseBtn.style.opacity = '1';
        startProgressSimulation();
        showNotification('Playing: ' + songs[currentSong].title);
    } else {
        playPauseBtn.style.opacity = '0.7';
        stopProgressSimulation();
        showNotification('Paused');
    }
}

// Progress bar simulation
let progressInterval;

function startProgressSimulation() {
    progressInterval = setInterval(() => {
        if (currentTime < duration) {
            currentTime++;
            updateProgressBar();
        } else {
            nextSong();
        }
    }, 1000);
}

function stopProgressSimulation() {
    clearInterval(progressInterval);
}

function updateProgressBar() {
    const progress = (currentTime / duration) * 100;
    progressBar.value = progress;
    currentTimeSpan.textContent = formatTime(currentTime);
}

// Seek functionality
function seekSong() {
    const seekTime = (progressBar.value / 100) * duration;
    currentTime = Math.floor(seekTime);
    currentTimeSpan.textContent = formatTime(currentTime);
}

// Previous song
function previousSong() {
    currentSong = currentSong > 0 ? currentSong - 1 : songs.length - 1;
    changeSong();
}

// Next song
function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    changeSong();
}

// Change song
function changeSong() {
    currentTime = 0;
    updatePlayerDisplay();
    progressBar.value = 0;
    currentTimeSpan.textContent = formatTime(0);
    
    if (isPlaying) {
        stopProgressSimulation();
        startProgressSimulation();
    }
    
    showNotification('Now playing: ' + songs[currentSong].title);
}

// Update player display
function updatePlayerDisplay() {
    albumImg.src = songs[currentSong].image;
    albumTitle.textContent = songs[currentSong].title;
    albumSinger.textContent = songs[currentSong].artist;
    totalTimeSpan.textContent = songs[currentSong].duration;
}

// Shuffle functionality
function toggleShuffle() {
    shuffleBtn.style.opacity = shuffleBtn.style.opacity === '1' ? '0.7' : '1';
    showNotification('Shuffle ' + (shuffleBtn.style.opacity === '1' ? 'ON' : 'OFF'));
}

// Repeat functionality
function toggleRepeat() {
    repeatBtn.style.opacity = repeatBtn.style.opacity === '1' ? '0.7' : '1';
    showNotification('Repeat ' + (repeatBtn.style.opacity === '1' ? 'ON' : 'OFF'));
}

// Like/Unlike functionality
function toggleLike() {
    if (heartIcon.classList.contains('fa-regular')) {
        heartIcon.classList.remove('fa-regular');
        heartIcon.classList.add('fa-solid');
        heartIcon.style.color = '#1db954';
        showNotification('Added to Liked Songs');
    } else {
        heartIcon.classList.remove('fa-solid');
        heartIcon.classList.add('fa-regular');
        heartIcon.style.color = 'white';
        showNotification('Removed from Liked Songs');
    }
}

// Format time helper
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Card hover effects
function setupCardHoverEffects() {
    cards.forEach(card => {
        const playButton = document.createElement('div');
        playButton.className = 'play-button';
        playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
        playButton.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: #1db954;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: all 0.3s ease;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;
        
        card.style.position = 'relative';
        card.appendChild(playButton);
        
        card.addEventListener('mouseenter', () => {
            playButton.style.opacity = '1';
            playButton.style.transform = 'translateY(-5px)';
            card.style.backgroundColor = '#282828';
        });
        
        card.addEventListener('mouseleave', () => {
            playButton.style.opacity = '0';
            playButton.style.transform = 'translateY(0)';
            card.style.backgroundColor = 'transparent';
        });
    });
}

// Navigation effects
function setupNavigationEffects() {
    navOptions.forEach(option => {
        option.addEventListener('mouseenter', () => {
            if (option.style.opacity !== '1') {
                option.style.opacity = '0.8';
            }
        });
        
        option.addEventListener('mouseleave', () => {
            if (option.style.opacity !== '1') {
                option.style.opacity = '0.7';
            }
        });
    });
}

// Handle navigation clicks
function handleNavigation(event) {
    event.preventDefault();

    // Remove active state from all nav options
    navOptions.forEach(option => {
        option.style.opacity = '0.7';
    });

    // Add active state to clicked option
    event.currentTarget.style.opacity = '1';

    const navText = event.currentTarget.querySelector('a').textContent;

    if (navText === 'Search') {
        openSearchModal();
    } else if (navText === 'Home') {
        showHomeContent();
    } else if (navText === 'Your library') {
        showLibraryContent();
    }

    showNotification(`Navigated to ${navText}`);
}

// Setup search functionality
function setupSearchFunctionality() {
    // Create search modal if it doesn't exist
    if (!document.querySelector('.search-modal')) {
        createSearchModal();
    }
}

// Create search modal
function createSearchModal() {
    const searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    searchModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: none;
        z-index: 1000;
        align-items: center;
        justify-content: center;
    `;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
        background: #121212;
        border-radius: 10px;
        padding: 30px;
        width: 80%;
        max-width: 600px;
        max-height: 80%;
        overflow-y: auto;
    `;

    searchContainer.innerHTML = `
        <div class="search-header">
            <h2 style="margin: 0 0 20px 0; color: white;">Search Music</h2>
            <button class="close-search" style="
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
            ">&times;</button>
        </div>
        <div class="search-input-container">
            <input type="text" class="search-input" placeholder="What do you want to listen to?" style="
                width: 100%;
                padding: 12px 20px;
                border: none;
                border-radius: 25px;
                background: #2a2a2a;
                color: white;
                font-size: 16px;
                outline: none;
                margin-bottom: 20px;
            ">
        </div>
        <div class="search-filters" style="margin-bottom: 20px;">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="songs">Songs</button>
            <button class="filter-btn" data-filter="artists">Artists</button>
            <button class="filter-btn" data-filter="genres">Genres</button>
        </div>
        <div class="search-results"></div>
        <div class="search-history">
            <h3 style="color: white; margin-bottom: 15px;">Recent Searches</h3>
            <div class="history-items"></div>
        </div>
    `;

    searchModal.appendChild(searchContainer);
    document.body.appendChild(searchModal);

    // Add event listeners
    const closeBtn = searchContainer.querySelector('.close-search');
    const searchInput = searchContainer.querySelector('.search-input');
    const filterBtns = searchContainer.querySelectorAll('.filter-btn');

    closeBtn.addEventListener('click', closeSearchModal);
    searchInput.addEventListener('input', performSearch);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            performSearch();
        });
    });

    // Close on outside click
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            closeSearchModal();
        }
    });

    // Add filter button styles
    const style = document.createElement('style');
    style.textContent = `
        .filter-btn {
            background: #2a2a2a;
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            margin-right: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .filter-btn:hover, .filter-btn.active {
            background: #1db954;
        }
        .search-result-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.2s ease;
            margin-bottom: 5px;
        }
        .search-result-item:hover {
            background: #2a2a2a;
        }
        .search-result-img {
            width: 50px;
            height: 50px;
            border-radius: 5px;
            margin-right: 15px;
        }
        .search-result-info h4 {
            margin: 0;
            color: white;
            font-size: 14px;
        }
        .search-result-info p {
            margin: 5px 0 0 0;
            color: #b3b3b3;
            font-size: 12px;
        }
        .history-item {
            display: inline-block;
            background: #2a2a2a;
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            margin: 5px 5px 5px 0;
            cursor: pointer;
            font-size: 12px;
        }
        .history-item:hover {
            background: #3a3a3a;
        }
    `;
    document.head.appendChild(style);
}

// Open search modal
function openSearchModal() {
    const searchModal = document.querySelector('.search-modal');
    if (searchModal) {
        searchModal.style.display = 'flex';
        const searchInput = searchModal.querySelector('.search-input');
        setTimeout(() => searchInput.focus(), 100);
        updateSearchHistory();
    }
}

// Close search modal
function closeSearchModal() {
    const searchModal = document.querySelector('.search-modal');
    if (searchModal) {
        searchModal.style.display = 'none';
        const searchInput = searchModal.querySelector('.search-input');
        searchInput.value = '';
        clearSearchResults();
    }
}

// Perform search
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const activeFilter = document.querySelector('.filter-btn.active');
    const query = searchInput.value.toLowerCase().trim();

    if (query.length === 0) {
        clearSearchResults();
        return;
    }

    // Add to search history
    if (query.length > 2 && !searchHistory.includes(query)) {
        searchHistory.unshift(query);
        if (searchHistory.length > 10) {
            searchHistory.pop();
        }
    }

    const filter = activeFilter.dataset.filter;
    let results = [];

    // Search through songs
    songs.forEach((song, index) => {
        const matchesQuery =
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query) ||
            song.genre.toLowerCase().includes(query);

        const matchesFilter =
            filter === 'all' ||
            (filter === 'songs' && matchesQuery) ||
            (filter === 'artists' && song.artist.toLowerCase().includes(query)) ||
            (filter === 'genres' && song.genre.toLowerCase().includes(query));

        if (matchesQuery && matchesFilter) {
            results.push({...song, index});
        }
    });

    displaySearchResults(results);
}

// Display search results
function displaySearchResults(results) {
    const resultsContainer = document.querySelector('.search-results');

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p style="color: #b3b3b3; text-align: center;">No results found</p>';
        return;
    }

    resultsContainer.innerHTML = results.map(song => `
        <div class="search-result-item" data-song-index="${song.index}">
            <img src="${song.image}" alt="${song.title}" class="search-result-img">
            <div class="search-result-info">
                <h4>${song.title}</h4>
                <p>${song.artist} • ${song.genre} • ${song.duration}</p>
            </div>
        </div>
    `).join('');

    // Add click listeners to results
    resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const songIndex = parseInt(item.dataset.songIndex);
            playFromCard(songIndex);
            closeSearchModal();
        });
    });
}

// Clear search results
function clearSearchResults() {
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
}

// Update search history display
function updateSearchHistory() {
    const historyContainer = document.querySelector('.history-items');
    if (historyContainer && searchHistory.length > 0) {
        historyContainer.innerHTML = searchHistory.map(term =>
            `<span class="history-item">${term}</span>`
        ).join('');

        // Add click listeners to history items
        historyContainer.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const searchInput = document.querySelector('.search-input');
                searchInput.value = item.textContent;
                performSearch();
            });
        });
    }
}

// Play from card
function playFromCard(cardIndex) {
    if (cardIndex < songs.length) {
        currentSong = cardIndex;
        changeSong();
        if (!isPlaying) {
            togglePlayPause();
        }
    }
}

// Create playlist functionality
function createPlaylist() {
    const playlistName = prompt('Enter playlist name:');
    if (playlistName) {
        showNotification(`Created playlist: ${playlistName}`);
        // Here you could add logic to actually create and store the playlist
    }
}

// Browse podcasts functionality
function browsePodcasts() {
    showNotification('Opening podcast browser...');
    // Simulate podcast browsing
    setTimeout(() => {
        showNotification('Showing popular podcasts');
    }, 1000);
}

// Navigation button functions
function goBack() {
    showNotification('Going back...');
    // Simulate browser back functionality
}

function goForward() {
    showNotification('Going forward...');
    // Simulate browser forward functionality
}

// Top navigation functions
function installApp() {
    showNotification('Redirecting to app download...');
    // Simulate app installation
    setTimeout(() => {
        showNotification('Download started!');
    }, 1500);
}

function explorePremium() {
    showNotification('Opening Spotify Premium...');
    // Simulate premium exploration
    setTimeout(() => {
        showNotification('Premium features: Ad-free, offline downloads, better quality');
    }, 1000);
}

function showUserMenu() {
    // Create user menu if it doesn't exist
    let userMenu = document.querySelector('.user-menu');
    if (!userMenu) {
        userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: #282828;
            border-radius: 8px;
            padding: 10px 0;
            min-width: 200px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            z-index: 1000;
            display: none;
        `;

        userMenu.innerHTML = `
            <div class="menu-item" style="padding: 10px 20px; cursor: pointer; color: white; transition: background 0.2s;">Account</div>
            <div class="menu-item" style="padding: 10px 20px; cursor: pointer; color: white; transition: background 0.2s;">Profile</div>
            <div class="menu-item" style="padding: 10px 20px; cursor: pointer; color: white; transition: background 0.2s;">Settings</div>
            <hr style="border: none; border-top: 1px solid #404040; margin: 5px 0;">
            <div class="menu-item" style="padding: 10px 20px; cursor: pointer; color: white; transition: background 0.2s;">Log out</div>
        `;

        document.body.appendChild(userMenu);

        // Add hover effects
        userMenu.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#404040';
            });
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'transparent';
            });
            item.addEventListener('click', () => {
                showNotification(`Clicked: ${item.textContent}`);
                userMenu.style.display = 'none';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenu.contains(e.target) && !e.target.classList.contains('fa-user')) {
                userMenu.style.display = 'none';
            }
        });
    }

    // Toggle menu visibility
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
}

// Library functions
function addToLibrary() {
    showNotification('Add to library options...');
    // Create add menu
    let addMenu = document.querySelector('.add-menu');
    if (!addMenu) {
        addMenu = document.createElement('div');
        addMenu.className = 'add-menu';
        addMenu.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #282828;
            border-radius: 8px;
            padding: 20px;
            min-width: 250px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            z-index: 1000;
            color: white;
        `;

        addMenu.innerHTML = `
            <h3 style="margin: 0 0 15px 0;">Add to Library</h3>
            <div class="add-option" style="padding: 10px; cursor: pointer; border-radius: 5px; margin: 5px 0;">Create Playlist</div>
            <div class="add-option" style="padding: 10px; cursor: pointer; border-radius: 5px; margin: 5px 0;">Create Folder</div>
            <div class="add-option" style="padding: 10px; cursor: pointer; border-radius: 5px; margin: 5px 0;">Add Podcast</div>
            <button class="close-add-menu" style="
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
            ">&times;</button>
        `;

        document.body.appendChild(addMenu);

        // Add event listeners
        addMenu.querySelectorAll('.add-option').forEach(option => {
            option.addEventListener('mouseenter', () => {
                option.style.backgroundColor = '#404040';
            });
            option.addEventListener('mouseleave', () => {
                option.style.backgroundColor = 'transparent';
            });
            option.addEventListener('click', () => {
                showNotification(`Creating: ${option.textContent}`);
                addMenu.remove();
            });
        });

        addMenu.querySelector('.close-add-menu').addEventListener('click', () => {
            addMenu.remove();
        });
    }
}

function expandLibrary() {
    showNotification('Expanding library view...');
    // Simulate library expansion
    const library = document.querySelector('.library');
    if (library) {
        library.style.transform = library.style.transform === 'scale(1.05)' ? 'scale(1)' : 'scale(1.05)';
        library.style.transition = 'transform 0.3s ease';
    }
}

function connectDevice() {
    showNotification('Searching for devices...');
    // Simulate device connection
    setTimeout(() => {
        const devices = ['iPhone', 'MacBook Pro', 'Smart TV', 'Bluetooth Speaker'];
        const randomDevice = devices[Math.floor(Math.random() * devices.length)];
        showNotification(`Found device: ${randomDevice}`);
    }, 2000);
}

// Show home content
function showHomeContent() {
    showNotification('Showing home content');
    // Reset any filtered views
}

// Show library content
function showLibraryContent() {
    showNotification('Showing your library');
    // Could expand to show user's saved music, playlists, etc.
}

// Notification system
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1db954;
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    switch(event.code) {
        case 'Space':
            event.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowRight':
            if (event.ctrlKey) {
                event.preventDefault();
                nextSong();
            }
            break;
        case 'ArrowLeft':
            if (event.ctrlKey) {
                event.preventDefault();
                previousSong();
            }
            break;
    }
});
