document.addEventListener("DOMContentLoaded", function () {
    // Initialize variables
    let map;
    let countriesLayer;
    let markersLayer;
    let allCountriesData = {};
    let geoJSONLoaded = false;

    // Initialize tabs
    document.getElementById('listViewBtn').addEventListener('click', function () {
        document.getElementById('listView').classList.remove('hidden');
        document.getElementById('mapView').classList.add('hidden');
        this.classList.add('text-red-600', 'border-b-2', 'border-red-600');
        this.classList.remove('text-gray-500');
        document.getElementById('mapViewBtn').classList.remove('text-red-600', 'border-b-2', 'border-red-600');
        document.getElementById('mapViewBtn').classList.add('text-gray-500');
    });

    document.getElementById('mapViewBtn').addEventListener('click', function () {
        document.getElementById('mapView').classList.remove('hidden');
        document.getElementById('listView').classList.add('hidden');
        this.classList.add('text-red-600', 'border-b-2', 'border-red-600');
        this.classList.remove('text-gray-500');
        document.getElementById('listViewBtn').classList.remove('text-red-600', 'border-b-2', 'border-red-600');
        document.getElementById('listViewBtn').classList.add('text-gray-500');

        // Initialize map if it hasn't been initialized yet
        if (!map) {
            initMap();
        }
    });

    // Initialize map
    function initMap() {
        map = L.map('map').setView([20, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create layer for markers
        markersLayer = L.layerGroup().addTo(map);

        // Load countries GeoJSON
        fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
            .then(response => response.json())
            .then(data => {
                const features = data.features || [];
                countriesLayer = L.geoJSON(features, {
                    style: {
                        fillColor: "#f3f4f6",
                        weight: 1,
                        opacity: 1,
                        color: "#d1d5db",
                        fillOpacity: 0.7
                    },
                    onEachFeature: function (feature, layer) {
                        const countryName = (feature.properties.name || feature.properties.ADMIN || "").toLowerCase();
                        if (!countryName) return;

                        // Store country data for later use
                        allCountriesData[countryName.toLowerCase()] = {
                            layer: layer,
                            feature: feature,
                            center: layer.getBounds().getCenter()
                        };

                        layer.on({
                            mouseover: function () {
                                layer.setStyle({ weight: 2, color: "#9ca3af" });
                            },
                            mouseout: function () {
                                countriesLayer.resetStyle(layer);
                            }
                        });
                    }
                }).addTo(map);
                geoJSONLoaded = true;
            })
            .catch(err => {
                console.error("Error loading GeoJSON:", err);
                geoJSONLoaded = true;
            });
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // Search function
    document.getElementById('countrySearch').addEventListener('input', debounce(function (e) {
        const country = e.target.value.trim();
        searchApps(country);
    }, 300));

    function searchApps(country) {
        clearError();
        if (!geoJSONLoaded) {
            setTimeout(() => searchApps(country), 500);
            return;
        }
        if (!country) {
            hideResults();
            resetMap();
            return;
        }

        fetch(PANINI_SEARCH_URL + "?country=" + encodeURIComponent(country))
            .then(response => response.json())
            .then(data => {
                if (!data.apps || data.apps.length === 0) {
                    showNoResults();
                    highlightCountry(country, false);
                } else {
                    showResults(data.apps);
                    placeCountryMarker(country, data.apps);
                    highlightCountry(country, true);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError("Could not fetch data. Please try again.")
            });
    }

    // Highlight country 
    function highlightCountry(country, hasApps) {
        if (!map || !countriesLayer) return;
        resetMap();

        const lower = country.toLowerCase();
        const countryData = allCountriesData[lower];
        if (!countryData) return;

        countryData.layer.setStyle({
            fillColor: hasApps ? '#ef4444' : '#a1a1aa',
            weight: 2,
            color: hasApps ? '#b91c1c' : '#71717a',
            fillOpacity: 0.8
        });

        map.flyToBounds(countryData.layer.getBounds(), { duration: 1.2 });
    }

    // Place marker
    function placeCountryMarker(country, apps) {
        if (!markersLayer) return;
        markersLayer.clearLayers();

        const lower = country.toLowerCase();
        const countryData = allCountriesData[lower];
        if (!countryData) return;

        const center = countryData.center;
        const count = apps.length;
        const displayCount = count;
        const markerHTML = `
                    <div style="position: relative; width: 42px; height: 42px;">
                        <div style="width: 42px; height: 42px; border-radius: 50% 50% 50% 0; background: #dc2626; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: 700; box-shadow: 0 0 10px rgba(0,0,0,0.25); ">
                            <div style="transform: rotate(45deg);">
                                ${displayCount}
                            </div>
                        </div>
                    </div>`;

        const marker = L.marker(center, {
            icon: L.divIcon({
                className: "map-pin-marker",
                html: markerHTML,
                iconSize: [42, 42],
                iconAnchor: [21, 42]
            })
        });

        marker.bindTooltip(
            `${count} banned ${count === 1 ? "app" : "apps"}`,
            { permanent: false, direction: "top", offset: [0, -5] }
        );

        // Banned apps in map
        marker.on("click", () => {
            showCountryInfo(country, apps);
        });

        markersLayer.addLayer(marker);
    }

    function showResults(apps) {
        const grid = document.getElementById('appsGrid');
        grid.innerHTML = '';

        apps.forEach(app => {
            const card = createAppCard(app);
            grid.appendChild(card);
        });

        document.getElementById('resultsSection').classList.remove('hidden');
        document.getElementById('noResults').classList.add('hidden');
    }

    function createAppCard(app) {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow';

        div.innerHTML = `
                    <h3 class="text-xl font-semibold mb-2 text-red-600">${app.app_name}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${app.app_type}</p>
                    <p class="text-gray-800 dark:text-gray-200 mb-4">${app.ban_reason}</p>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        <p>Ban Date: ${new Date(app.ban_date).toLocaleDateString()}</p>
                        ${app.source_url ? `<a href="${app.source_url}" target="_blank" class="text-red-600 hover:underline">Source →</a>` : ''}
                    </div>
                `;

        return div;
    }

    function showCountryInfo(country, apps) {
        const countryInfoDiv = document.getElementById('countryInfo');
        const countryNameDiv = document.getElementById('countryName');
        const bannedAppsCountDiv = document.getElementById('bannedAppsCount');
        const bannedAppsListDiv = document.getElementById('bannedAppsList');

        // Update country name
        countryNameDiv.textContent = country.charAt(0).toUpperCase() + country.slice(1);

        // Update banned apps count
        bannedAppsCountDiv.textContent = `${apps.length} Banned Apps`;

        // Update banned apps list
        bannedAppsListDiv.innerHTML = apps.map(app => `
                    <div class="py-2 border-b border-gray-200 dark:border-gray-700">
                        <h4 class="font-semibold text-red-600">${app.app_name}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${app.app_type}</p>
                        <p class="text-sm mt-1">${app.ban_reason}</p>
                        <p class="text-xs mt-1">Ban Date: ${new Date(app.ban_date).toLocaleDateString()}</p>
                    </div>
                `).join('');

        // Show the country info section
        countryInfoDiv.classList.remove('hidden');
    }

    function showNoResults() {
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('noResults').classList.remove('hidden');
        document.getElementById('countryInfo').classList.add('hidden');
    }

    function hideResults() {
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('noResults').classList.add('hidden');
        document.getElementById('countryInfo').classList.add('hidden');
    }

    function resetMap() {
        if (!map || !countriesLayer) return;

        // Reset country styles
        countriesLayer.eachLayer(layer => {
            countriesLayer.resetStyle(layer);
        });

        // Hide country info
        document.getElementById('countryInfo').classList.add('hidden');
    }
    function showError(message) {
        const el = document.getElementById("errorMessage");
        el.textContent = message;
        el.classList.remove("hidden");
    }

    function clearError() {
        const el = document.getElementById("errorMessage");
        el.textContent = "";
        el.classList.add("hidden");
    }

    // Set default view to List View
    document.getElementById('listViewBtn').click();
});

