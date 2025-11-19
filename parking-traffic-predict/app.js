// City Data Management
const CITY_CONFIG = {
  name: 'Smart City - Metro District',
  gridSize: 12,
  updateInterval: 4000,
  zonesTotal: 144,
  peakHours: [8, 9, 12, 13, 17, 18, 19]
};

const PRICING_CONFIG = {
  basePrice: 2.00,
  occupancyMultiplierRange: [0.5, 2.0],
  trafficMultiplierRange: [0.8, 1.8],
  peakMultiplier: 1.5,
  offpeakMultiplier: 0.7,
  eventMultiplier: 2.0,
  weekendMultiplier: 1.3
};

const AMENITIES = [
  { id: 'restroom', name: 'Restrooms', icon: '🚺', priceImpact: 0, distance: 50 },
  { id: 'ev_charging', name: 'EV Charging', icon: '⚡', priceImpact: 0.75, distance: 100 },
  { id: 'food_services', name: 'Food Services', icon: '🍔', priceImpact: 0.25, distance: 75 },
  { id: 'security', name: '24/7 Security', icon: '🛡️', priceImpact: 0.25, distance: 0 },
  { id: 'accessible', name: 'Accessible', icon: '♿', priceImpact: -0.50, distance: 0 },
  { id: 'covered', name: 'Covered', icon: '🏠', priceImpact: 0.50, distance: 0 },
  { id: 'car_wash', name: 'Car Wash', icon: '💧', priceImpact: 0.15, distance: 150 },
  { id: 'mechanics', name: 'Auto Repair', icon: '🔧', priceImpact: 0.10, distance: 200 }
];

const LOYALTY_TIERS = [
  {
    tier: 'BRONZE',
    minPoints: 0,
    maxPoints: 499,
    pointsPerDollar: 1.0,
    parkingDiscount: 0,
    color: '#A9A9A9',
    benefits: ['Standard pricing', 'Basic support']
  },
  {
    tier: 'SILVER',
    minPoints: 500,
    maxPoints: 1499,
    pointsPerDollar: 1.5,
    parkingDiscount: 0.05,
    color: '#4169E1',
    benefits: ['5% parking discount', 'Priority support', '1 free hour/month', '10% off mechanics']
  },
  {
    tier: 'GOLD',
    minPoints: 1500,
    maxPoints: 3499,
    pointsPerDollar: 2.0,
    parkingDiscount: 0.10,
    color: '#FFD700',
    benefits: ['10% parking discount', 'VIP support', '1 free hour/week', '15% off mechanics', 'Priority zone access']
  },
  {
    tier: 'PLATINUM',
    minPoints: 3500,
    maxPoints: 999999,
    pointsPerDollar: 3.0,
    parkingDiscount: 0.20,
    color: '#9370DB',
    benefits: ['20% parking discount', 'Concierge service', 'Unlimited premium spots', '25% off mechanics', 'VIP events access', 'Personal account manager']
  }
];

const PARTNER_BUSINESSES = [
  { name: 'Elite Auto Repair', category: 'Mechanics', discount: '15-25%', icon: '🔧' },
  { name: 'Premium Car Wash', category: 'Car Wash', discount: '20-30%', icon: '💧' },
  { name: 'FuelStation Premium', category: 'Gas', discount: '5-10%', icon: '⛽' },
  { name: 'Urban Cafe', category: 'Restaurant', discount: '10-15%', icon: '☕' },
  { name: 'EV Charger Network', category: 'EV Charging', discount: 'Priority access', icon: '⚡' }
];

const MODELS = [
  { name: 'CNN-LSTM', accuracy: '92.3%', latency: '45ms' },
  { name: 'Graph Neural Network', accuracy: '94.1%', latency: '52ms' },
  { name: 'Transformer-based', accuracy: '95.2%', latency: '78ms' }
];

const COLORS = {
  parking: {
    abundant: '#2ecc71',
    moderate: '#f39c12',
    scarce: '#e74c3c'
  },
  traffic: {
    smooth: '#27ae60',
    moderate: '#f39c12',
    congested: '#c0392b'
  }
};

// State Management
let appState = {
  zones: [],
  currentView: 'dashboard',
  selectedZone: null,
  heatmapLayer: 'parking',
  autoRefresh: true,
  updateIntervalId: null,
  lastUpdate: new Date(),
  currentModel: MODELS[2],
  predictionHorizon: 30,
  user: {
    parkCoins: 1250,
    lifetimeCoins: 1250,
    points: 750,
    tier: 'SILVER',
    referralCode: 'PARK1250',
    bookingHistory: []
  }
};

// Initialize zones
function initializeZones() {
  const zones = [];
  const zoneNames = [
    'Downtown Central', 'Business District', 'University Area', 'Shopping Mall',
    'Residential North', 'Tech Park', 'Convention Center', 'Financial District',
    'Medical Complex', 'Sports Arena', 'Arts District', 'Waterfront',
    'Airport Terminal', 'Industrial Zone', 'Historic Quarter', 'Transit Hub'
  ];

  for (let i = 0; i < CITY_CONFIG.zonesTotal; i++) {
    const hour = new Date().getHours();
    const isPeakHour = CITY_CONFIG.peakHours.includes(hour);
    const baseOccupancy = isPeakHour ? 70 : 40;
    const baseTraffic = isPeakHour ? 65 : 35;

    // Assign random amenities (3-5 per zone)
    const numAmenities = Math.floor(Math.random() * 3) + 3;
    const zoneAmenities = [];
    const amenityCopy = [...AMENITIES];
    for (let j = 0; j < numAmenities && amenityCopy.length > 0; j++) {
      const idx = Math.floor(Math.random() * amenityCopy.length);
      zoneAmenities.push(amenityCopy.splice(idx, 1)[0]);
    }

    zones.push({
      id: i + 1,
      name: zoneNames[i % zoneNames.length] + (i >= zoneNames.length ? ` ${Math.floor(i / zoneNames.length) + 1}` : ''),
      capacity: Math.floor(Math.random() * 150) + 50,
      occupancy: Math.min(95, Math.max(10, baseOccupancy + (Math.random() * 40 - 20))),
      traffic: Math.min(95, Math.max(5, baseTraffic + (Math.random() * 40 - 20))),
      demandTrend: Math.random() > 0.5 ? 'up' : 'down',
      trendPercentage: Math.floor(Math.random() * 15) + 1,
      amenities: zoneAmenities,
      hasEvent: Math.random() > 0.9
    });
  }

  return zones;
}

// Calculate dynamic pricing
function calculateDynamicPrice(zone) {
  const hour = new Date().getHours();
  const isPeakHour = CITY_CONFIG.peakHours.includes(hour);
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;

  let price = PRICING_CONFIG.basePrice;

  // Occupancy multiplier (higher occupancy = higher price)
  const occupancyMultiplier = PRICING_CONFIG.occupancyMultiplierRange[0] + 
    (zone.occupancy / 100) * (PRICING_CONFIG.occupancyMultiplierRange[1] - PRICING_CONFIG.occupancyMultiplierRange[0]);
  price *= occupancyMultiplier;

  // Traffic multiplier
  const trafficMultiplier = PRICING_CONFIG.trafficMultiplierRange[0] + 
    (zone.traffic / 100) * (PRICING_CONFIG.trafficMultiplierRange[1] - PRICING_CONFIG.trafficMultiplierRange[0]);
  price *= trafficMultiplier;

  // Time-based multiplier
  price *= isPeakHour ? PRICING_CONFIG.peakMultiplier : PRICING_CONFIG.offpeakMultiplier;

  // Weekend multiplier
  if (isWeekend) {
    price *= PRICING_CONFIG.weekendMultiplier;
  }

  // Event multiplier
  if (zone.hasEvent) {
    price *= PRICING_CONFIG.eventMultiplier;
  }

  // Amenity pricing
  zone.amenities.forEach(amenity => {
    price += amenity.priceImpact;
  });

  // Apply loyalty discount
  const currentTier = LOYALTY_TIERS.find(t => 
    appState.user.points >= t.minPoints && appState.user.points <= t.maxPoints
  );
  if (currentTier) {
    price *= (1 - currentTier.parkingDiscount);
  }

  return Math.max(0.5, price);
}

// Get price trend
function getPriceTrend(zone) {
  const currentPrice = calculateDynamicPrice(zone);
  const futureOccupancy = zone.occupancy + (zone.demandTrend === 'up' ? 5 : -5);
  const futureZone = { ...zone, occupancy: futureOccupancy };
  const futurePrice = calculateDynamicPrice(futureZone);

  if (futurePrice > currentPrice * 1.05) return 'up';
  if (futurePrice < currentPrice * 0.95) return 'down';
  return 'stable';
}

// Update zone data simulation
function updateZones() {
  const hour = new Date().getHours();
  const isPeakHour = CITY_CONFIG.peakHours.includes(hour);

  appState.zones.forEach(zone => {
    // Simulate gradual changes
    const occupancyChange = (Math.random() - 0.5) * 3;
    const trafficChange = (Math.random() - 0.5) * 3;

    zone.occupancy = Math.min(95, Math.max(5, zone.occupancy + occupancyChange));
    zone.traffic = Math.min(95, Math.max(5, zone.traffic + trafficChange));

    // Tend towards peak values during peak hours
    if (isPeakHour) {
      zone.occupancy = zone.occupancy + (70 - zone.occupancy) * 0.02;
      zone.traffic = zone.traffic + (65 - zone.traffic) * 0.02;
    } else {
      zone.occupancy = zone.occupancy + (40 - zone.occupancy) * 0.02;
      zone.traffic = zone.traffic + (35 - zone.traffic) * 0.02;
    }

    // Update trend
    if (Math.random() > 0.9) {
      zone.demandTrend = zone.demandTrend === 'up' ? 'down' : 'up';
      zone.trendPercentage = Math.floor(Math.random() * 15) + 1;
    }
  });

  appState.lastUpdate = new Date();
}

// Color calculation
function getColorForValue(value, type = 'parking') {
  const colors = type === 'parking' ? COLORS.parking : COLORS.traffic;
  
  if (type === 'parking') {
    // Lower occupancy = more available = green
    if (value < 40) return colors.abundant;
    if (value < 75) return colors.moderate;
    return colors.scarce;
  } else {
    // Lower traffic = better = green
    if (value < 40) return colors.smooth;
    if (value < 70) return colors.moderate;
    return colors.congested;
  }
}

// Render city grid
function renderCityGrid(containerId, layer = 'parking') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  appState.zones.forEach(zone => {
    const cell = document.createElement('div');
    cell.className = 'zone-cell';
    const value = layer === 'parking' ? zone.occupancy : zone.traffic;
    cell.style.backgroundColor = getColorForValue(value, layer);
    cell.setAttribute('data-zone-id', zone.id);
    cell.title = `${zone.name}: ${Math.round(value)}%`;
    
    cell.addEventListener('click', () => showZoneDetail(zone.id));
    
    container.appendChild(cell);
  });
}

// Update dashboard metrics
function updateDashboardMetrics() {
  const totalCapacity = appState.zones.reduce((sum, z) => sum + z.capacity, 0);
  const totalOccupied = appState.zones.reduce((sum, z) => sum + (z.capacity * z.occupancy / 100), 0);
  const totalAvailable = Math.floor(totalCapacity - totalOccupied);
  const avgTraffic = Math.round(appState.zones.reduce((sum, z) => sum + z.traffic, 0) / appState.zones.length);

  document.getElementById('totalAvailable').textContent = totalAvailable.toLocaleString();
  document.getElementById('avgTraffic').textContent = avgTraffic + '%';
  document.getElementById('activeZones').textContent = CITY_CONFIG.zonesTotal;

  // Update trends
  const parkingTrend = Math.random() * 5 + 2;
  document.getElementById('parkingTrend').textContent = parkingTrend.toFixed(1) + '%';
  
  const trafficTrendContainer = document.getElementById('trafficTrendContainer');
  const trafficTrend = (Math.random() - 0.5) * 4;
  document.getElementById('trafficTrend').textContent = Math.abs(trafficTrend).toFixed(1) + '%';
  
  if (trafficTrend > 0) {
    trafficTrendContainer.className = 'metric-trend negative';
    trafficTrendContainer.querySelector('i').className = 'fas fa-arrow-up';
  } else {
    trafficTrendContainer.className = 'metric-trend positive';
    trafficTrendContainer.querySelector('i').className = 'fas fa-arrow-down';
  }

  // Update time
  const now = appState.lastUpdate;
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('lastUpdate').textContent = timeStr;

  // Update model info
  document.getElementById('activeModel').textContent = appState.currentModel.name;
  document.getElementById('modelAccuracy').textContent = appState.currentModel.accuracy;
  document.getElementById('modelLatency').textContent = appState.currentModel.latency;
}

// Update top lists
function updateTopLists() {
  // Best parking availability (lowest occupancy)
  const bestParking = [...appState.zones]
    .sort((a, b) => a.occupancy - b.occupancy)
    .slice(0, 5);

  const parkingList = document.getElementById('topParkingList');
  parkingList.innerHTML = bestParking.map(zone => {
    const available = Math.floor(zone.capacity * (1 - zone.occupancy / 100));
    return `
      <div class="zone-list-item" onclick="showZoneDetail(${zone.id})">
        <span class="zone-list-name">${zone.name}</span>
        <span class="zone-list-value good">${available} spots</span>
      </div>
    `;
  }).join('');

  // High congestion zones
  const highTraffic = [...appState.zones]
    .sort((a, b) => b.traffic - a.traffic)
    .slice(0, 5);

  const trafficList = document.getElementById('topTrafficList');
  trafficList.innerHTML = highTraffic.map(zone => `
    <div class="zone-list-item" onclick="showZoneDetail(${zone.id})">
      <span class="zone-list-name">${zone.name}</span>
      <span class="zone-list-value bad">${Math.round(zone.traffic)}%</span>
    </div>
  `).join('');
}

// Show zone detail
function showZoneDetail(zoneId) {
  const zone = appState.zones.find(z => z.id === zoneId);
  if (!zone) return;

  appState.selectedZone = zone;

  // Calculate pricing
  const zonePrice = calculateDynamicPrice(zone);
  const priceTrend = getPriceTrend(zone);
  const trendIcon = priceTrend === 'up' ? '↑' : priceTrend === 'down' ? '↓' : '→';
  const trendColor = priceTrend === 'up' ? 'var(--color-error)' : priceTrend === 'down' ? 'var(--color-success)' : 'var(--color-text-secondary)';

  // Update detail view
  document.getElementById('zoneName').textContent = zone.name;
  
  const available = Math.floor(zone.capacity * (1 - zone.occupancy / 100));
  document.getElementById('zoneAvailable').textContent = available;
  document.getElementById('zoneCapacity').textContent = `of ${zone.capacity} total`;
  document.getElementById('zoneOccupancy').textContent = Math.round(zone.occupancy) + '%';
  document.getElementById('zoneTraffic').textContent = Math.round(zone.traffic) + '%';
  
  // Update pricing
  document.getElementById('zonePrice').textContent = `$${zonePrice.toFixed(2)}`;
  const zonePriceTrendEl = document.getElementById('zonePriceTrend');
  zonePriceTrendEl.innerHTML = `<span style="color: ${trendColor}">${trendIcon}</span> per hour`;

  // Update trend
  const trendEl = document.getElementById('zoneTrend');
  trendEl.innerHTML = `
    <i class="fas fa-arrow-${zone.demandTrend === 'up' ? 'up' : 'down'}"></i>
    <span id="zoneTrendValue">${zone.trendPercentage}%</span>
  `;

  // Traffic status
  const statusEl = document.getElementById('zoneTrafficStatus');
  if (zone.traffic < 40) {
    statusEl.textContent = 'Smooth Flow';
    statusEl.style.background = 'rgba(46, 204, 113, 0.2)';
    statusEl.style.color = '#27ae60';
  } else if (zone.traffic < 70) {
    statusEl.textContent = 'Moderate';
    statusEl.style.background = 'rgba(243, 156, 18, 0.2)';
    statusEl.style.color = '#f39c12';
  } else {
    statusEl.textContent = 'Congested';
    statusEl.style.background = 'rgba(231, 76, 60, 0.2)';
    statusEl.style.color = '#c0392b';
  }

  // Render amenities
  const amenitiesList = document.getElementById('zoneAmenitiesList');
  amenitiesList.innerHTML = zone.amenities.map(amenity => `
    <div class="amenity-item">
      <div class="amenity-icon">${amenity.icon}</div>
      <div class="amenity-info">
        <div class="amenity-name">${amenity.name}</div>
        <div class="amenity-distance">${amenity.distance > 0 ? amenity.distance + 'm away' : 'On-site'}</div>
      </div>
    </div>
  `).join('');

  // Calculate price breakdown
  const basePrice = PRICING_CONFIG.basePrice;
  const amenitiesPrice = zone.amenities.reduce((sum, a) => sum + a.priceImpact, 0);
  const currentTier = LOYALTY_TIERS.find(t => 
    appState.user.points >= t.minPoints && appState.user.points <= t.maxPoints
  );
  const loyaltyDiscount = currentTier ? (basePrice + amenitiesPrice) * currentTier.parkingDiscount : 0;
  
  document.getElementById('priceBase').textContent = `$${basePrice.toFixed(2)}/hr`;
  
  if (amenitiesPrice !== 0) {
    document.getElementById('priceAmenitiesRow').style.display = 'flex';
    document.getElementById('priceAmenities').textContent = (amenitiesPrice >= 0 ? '+' : '') + `$${amenitiesPrice.toFixed(2)}/hr`;
  } else {
    document.getElementById('priceAmenitiesRow').style.display = 'none';
  }
  
  if (loyaltyDiscount > 0) {
    document.getElementById('priceLoyaltyRow').style.display = 'flex';
    document.getElementById('priceLoyalty').textContent = `-$${loyaltyDiscount.toFixed(2)}/hr`;
  } else {
    document.getElementById('priceLoyaltyRow').style.display = 'none';
  }
  
  document.getElementById('priceTotal').textContent = `$${zonePrice.toFixed(2)}/hr`;

  // Book now button
  const bookNowBtn = document.getElementById('bookNowBtn');
  bookNowBtn.onclick = () => bookParking(zone);

  // Generate recommendations
  generateRecommendations(zone);

  // Show charts
  renderPredictionChart(zone);
  renderHistoricalChart();

  // Switch to detail view
  switchView('zoneDetail');
}

// Generate recommendations
function generateRecommendations(currentZone) {
  const nearby = appState.zones
    .filter(z => z.id !== currentZone.id)
    .map(z => ({
      ...z,
      distance: Math.random() * 2 + 0.2
    }))
    .sort((a, b) => a.occupancy - b.occupancy)
    .slice(0, 5);

  const list = document.getElementById('recommendationsList');
  list.innerHTML = nearby.map(zone => {
    const available = Math.floor(zone.capacity * (1 - zone.occupancy / 100));
    return `
      <div class="recommendation-item" onclick="showZoneDetail(${zone.id})">
        <div class="recommendation-info">
          <div class="recommendation-name">${zone.name}</div>
          <div class="recommendation-distance">${zone.distance.toFixed(1)} km away</div>
        </div>
        <div class="recommendation-value">${available}</div>
      </div>
    `;
  }).join('');
}

// Prediction chart
let predictionChartInstance = null;

function renderPredictionChart(zone) {
  const canvas = document.getElementById('predictionChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Generate prediction data
  const currentAvailable = Math.floor(zone.capacity * (1 - zone.occupancy / 100));
  const labels = [];
  const data = [currentAvailable];
  
  const horizon = appState.predictionHorizon;
  const steps = Math.ceil(horizon / 10);
  
  labels.push('Now');
  
  for (let i = 1; i <= steps; i++) {
    const minutes = (horizon / steps) * i;
    labels.push(`+${Math.round(minutes)}m`);
    
    // Simulate prediction with some variation
    const change = (Math.random() - 0.5) * 20;
    const predicted = Math.max(0, Math.min(zone.capacity, data[data.length - 1] + change));
    data.push(Math.round(predicted));
  }

  if (predictionChartInstance) {
    predictionChartInstance.destroy();
  }

  predictionChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Available Spots',
        data: data,
        borderColor: '#32b8c6',
        backgroundColor: 'rgba(50, 184, 198, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: zone.capacity
        }
      }
    }
  });
}

// Historical pattern chart
let historicalChartInstance = null;

function renderHistoricalChart() {
  const canvas = document.getElementById('historicalChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const labels = hours.map(h => `${h}:00`);
  const data = hours.map(h => {
    if (CITY_CONFIG.peakHours.includes(h)) {
      return 30 + Math.random() * 20;
    }
    return 60 + Math.random() * 20;
  });

  if (historicalChartInstance) {
    historicalChartInstance.destroy();
  }

  historicalChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Typical Occupancy %',
        data: data,
        backgroundColor: '#32b8c6',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

// Traffic forecast chart
let trafficForecastChartInstance = null;

function renderTrafficForecastChart() {
  const canvas = document.getElementById('trafficForecastChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  const labels = [];
  const data = [];
  const currentHour = new Date().getHours();
  
  for (let i = 0; i <= 12; i++) {
    const hour = (currentHour + i) % 24;
    labels.push(`${hour}:00`);
    
    const isPeak = CITY_CONFIG.peakHours.includes(hour);
    const baseValue = isPeak ? 65 : 35;
    data.push(baseValue + (Math.random() - 0.5) * 20);
  }

  if (trafficForecastChartInstance) {
    trafficForecastChartInstance.destroy();
  }

  trafficForecastChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Traffic Intensity %',
        data: data,
        borderColor: '#f39c12',
        backgroundColor: 'rgba(243, 156, 18, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

// Comparison chart
let comparisonChartInstance = null;

function renderComparisonChart() {
  const canvas = document.getElementById('comparisonChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const select = document.getElementById('compareZones');
  const selectedIds = Array.from(select.selectedOptions).map(opt => parseInt(opt.value));
  
  const zones = selectedIds.map(id => appState.zones.find(z => z.id === id)).filter(Boolean);
  
  if (zones.length === 0) {
    // Show first 3 zones by default
    zones.push(...appState.zones.slice(0, 3));
  }

  const labels = ['Now', '+30m', '+60m', '+90m', '+120m'];
  const datasets = zones.map((zone, idx) => {
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F', '#DB4545'];
    const currentAvailable = Math.floor(zone.capacity * (1 - zone.occupancy / 100));
    const data = [currentAvailable];
    
    for (let i = 1; i < 5; i++) {
      const change = (Math.random() - 0.5) * 15;
      data.push(Math.round(Math.max(0, data[data.length - 1] + change)));
    }
    
    return {
      label: zone.name,
      data: data,
      borderColor: colors[idx % colors.length],
      backgroundColor: colors[idx % colors.length] + '20',
      borderWidth: 2,
      tension: 0.4
    };
  });

  if (comparisonChartInstance) {
    comparisonChartInstance.destroy();
  }

  comparisonChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Traffic view updates
function updateTrafficView() {
  const avgTraffic = Math.round(appState.zones.reduce((sum, z) => sum + z.traffic, 0) / appState.zones.length);
  const avgSpeed = Math.round(100 - avgTraffic * 0.6);
  const congestionCount = appState.zones.filter(z => z.traffic > 70).length;

  document.getElementById('avgSpeed').textContent = avgSpeed + ' km/h';
  document.getElementById('congestionCount').textContent = congestionCount;

  // Update alerts
  const alerts = appState.zones
    .filter(z => z.traffic > 75)
    .slice(0, 3)
    .map(zone => `
      <div class="alert-item">
        <div class="alert-icon"><i class="fas fa-exclamation-triangle"></i></div>
        <div class="alert-content">
          <div class="alert-title">${zone.name}</div>
          <div class="alert-description">Heavy congestion detected - ${Math.round(zone.traffic)}% intensity</div>
        </div>
      </div>
    `).join('');

  const alertsList = document.getElementById('alertsList');
  if (alerts.length === 0) {
    alertsList.innerHTML = '<div class="alert-item"><div class="alert-content"><div class="alert-description">No active alerts - traffic flowing smoothly</div></div></div>';
  } else {
    alertsList.innerHTML = alerts;
  }

  renderCityGrid('trafficGrid', 'traffic');
  renderTrafficForecastChart();
}

// View switching
function switchView(viewName) {
  // Update state
  appState.currentView = viewName;

  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  // Show selected view
  const viewMap = {
    'dashboard': 'dashboardView',
    'traffic': 'trafficView',
    'analytics': 'analyticsView',
    'settings': 'settingsView',
    'zoneDetail': 'zoneDetailView',
    'pricing': 'pricingView',
    'loyalty': 'loyaltyView',
    'payment': 'paymentView'
  };

  const viewElement = document.getElementById(viewMap[viewName]);
  if (viewElement) {
    viewElement.classList.add('active');
  }

  // Update nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.view === viewName) {
      item.classList.add('active');
    }
  });

  // Load view-specific data
  if (viewName === 'traffic') {
    updateTrafficView();
  } else if (viewName === 'analytics') {
    renderComparisonChart();
  } else if (viewName === 'dashboard') {
    updateDashboard();
  } else if (viewName === 'pricing') {
    renderPricingView();
  } else if (viewName === 'loyalty') {
    renderLoyaltyView();
  } else if (viewName === 'payment') {
    renderPaymentHistory();
  }
}

// Update dashboard
function updateDashboard() {
  updateDashboardMetrics();
  renderCityGrid('cityGrid', appState.heatmapLayer);
  updateTopLists();
}

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  
  // Update icon
  const icon = document.querySelector('#themeToggle i');
  icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Auto refresh management
function startAutoRefresh() {
  if (appState.updateIntervalId) {
    clearInterval(appState.updateIntervalId);
  }

  const interval = parseInt(document.getElementById('updateInterval')?.value || CITY_CONFIG.updateInterval);
  
  appState.updateIntervalId = setInterval(() => {
    if (appState.autoRefresh) {
      updateZones();
      if (appState.currentView === 'dashboard') {
        updateDashboard();
      } else if (appState.currentView === 'traffic') {
        updateTrafficView();
      }
    }
  }, interval);
}

// Update user profile display
function updateUserProfile() {
  document.getElementById('parkCoinsBalance').textContent = appState.user.parkCoins.toLocaleString();
  
  const currentTier = LOYALTY_TIERS.find(t => 
    appState.user.points >= t.minPoints && appState.user.points <= t.maxPoints
  );
  
  if (currentTier) {
    const tierBadge = document.getElementById('tierBadge');
    const tierName = document.getElementById('tierName');
    tierBadge.className = `tier-badge ${currentTier.tier.toLowerCase()}`;
    tierName.textContent = currentTier.tier;
    
    appState.user.tier = currentTier.tier;
  }
}

// Render pricing view
function renderPricingView() {
  // Calculate prices for all zones
  const zonesWithPrices = appState.zones.map(zone => ({
    ...zone,
    price: calculateDynamicPrice(zone),
    trend: getPriceTrend(zone)
  }));

  // Find cheapest, most expensive, and best value
  const sortedByPrice = [...zonesWithPrices].sort((a, b) => a.price - b.price);
  const cheapest = sortedByPrice[0];
  const mostExpensive = sortedByPrice[sortedByPrice.length - 1];
  
  // Best value: good availability (low occupancy) with reasonable price
  const bestValue = [...zonesWithPrices]
    .map(z => ({ ...z, valueScore: (100 - z.occupancy) / z.price }))
    .sort((a, b) => b.valueScore - a.valueScore)[0];

  // Update overview cards
  document.getElementById('cheapestZone').textContent = cheapest.name;
  document.getElementById('cheapestRate').textContent = `$${cheapest.price.toFixed(2)}/hr`;
  
  document.getElementById('expensiveZone').textContent = mostExpensive.name;
  document.getElementById('expensiveRate').textContent = `$${mostExpensive.price.toFixed(2)}/hr`;
  
  document.getElementById('bestValueZone').textContent = bestValue.name;
  document.getElementById('bestValueRate').textContent = `$${bestValue.price.toFixed(2)}/hr`;

  // Render pricing list
  const pricingList = document.getElementById('pricingZonesList');
  pricingList.innerHTML = zonesWithPrices.slice(0, 20).map(zone => {
    const trendIcon = zone.trend === 'up' ? '↑' : zone.trend === 'down' ? '↓' : '→';
    const amenitiesStr = zone.amenities.map(a => a.icon).join(' ');
    
    return `
      <div class="pricing-item" onclick="showZoneDetail(${zone.id})">
        <div class="pricing-item-info">
          <div class="pricing-item-name">${zone.name}</div>
          <div class="pricing-item-amenities">${amenitiesStr}</div>
        </div>
        <div class="pricing-item-rate">
          <span class="pricing-rate">$${zone.price.toFixed(2)}</span>
          <span class="pricing-trend ${zone.trend}">${trendIcon}</span>
        </div>
      </div>
    `;
  }).join('');

  // Render pricing chart
  renderPricingChart(zonesWithPrices);
}

let pricingChartInstance = null;

function renderPricingChart(zonesWithPrices) {
  const canvas = document.getElementById('pricingChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Show top 10 zones by variety
  const topZones = zonesWithPrices.slice(0, 10);
  
  if (pricingChartInstance) {
    pricingChartInstance.destroy();
  }

  pricingChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: topZones.map(z => z.name.split(' ').slice(0, 2).join(' ')),
      datasets: [{
        label: 'Price per Hour',
        data: topZones.map(z => z.price),
        backgroundColor: '#32b8c6',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toFixed(2);
            }
          }
        }
      }
    }
  });
}

// Render loyalty view
function renderLoyaltyView() {
  const currentTier = LOYALTY_TIERS.find(t => 
    appState.user.points >= t.minPoints && appState.user.points <= t.maxPoints
  );
  
  if (!currentTier) return;

  // Update tier badge
  const tierBadgeLarge = document.getElementById('tierBadgeLarge');
  const tierNameLarge = document.getElementById('tierNameLarge');
  tierBadgeLarge.style.background = `${currentTier.color}20`;
  tierBadgeLarge.style.color = currentTier.color;
  tierNameLarge.textContent = currentTier.tier;

  // Update stats
  document.getElementById('currentPoints').textContent = appState.user.points.toLocaleString();
  document.getElementById('lifetimeCoins').textContent = appState.user.lifetimeCoins.toLocaleString();

  // Calculate progress to next tier
  const nextTierIndex = LOYALTY_TIERS.findIndex(t => t.tier === currentTier.tier) + 1;
  if (nextTierIndex < LOYALTY_TIERS.length) {
    const nextTier = LOYALTY_TIERS[nextTierIndex];
    const pointsToNext = nextTier.minPoints - appState.user.points;
    const progress = (appState.user.points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints) * 100;
    
    document.getElementById('pointsToNext').textContent = `${appState.user.points} / ${nextTier.minPoints}`;
    document.getElementById('tierProgressBar').style.width = `${progress}%`;
  } else {
    document.getElementById('pointsToNext').textContent = 'Max tier reached';
    document.getElementById('tierProgressBar').style.width = '100%';
  }

  // Render benefits
  const benefitsList = document.getElementById('benefitsList');
  benefitsList.innerHTML = currentTier.benefits.map(benefit => `
    <div class="benefit-item">
      <i class="fas fa-check-circle"></i>
      <span>${benefit}</span>
    </div>
  `).join('');

  // Render partner offers
  const partnerOffersList = document.getElementById('partnerOffersList');
  partnerOffersList.innerHTML = PARTNER_BUSINESSES.map(partner => `
    <div class="partner-card">
      <div class="partner-icon">${partner.icon}</div>
      <div class="partner-name">${partner.name}</div>
      <div class="partner-category">${partner.category}</div>
      <div class="partner-discount">${partner.discount}</div>
    </div>
  `).join('');

  // Update referral code
  document.getElementById('referralCode').textContent = appState.user.referralCode;
}

// Render payment history
function renderPaymentHistory() {
  // Generate sample transactions if none exist
  if (appState.user.bookingHistory.length === 0) {
    const sampleZones = appState.zones.slice(0, 5);
    appState.user.bookingHistory = sampleZones.map((zone, idx) => ({
      id: `TXN${Date.now() - idx * 86400000}`,
      zone: zone.name,
      amount: (Math.random() * 10 + 5).toFixed(2),
      duration: Math.floor(Math.random() * 4) + 1,
      status: idx === 0 ? 'Pending' : 'Confirmed',
      hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
      coinsEarned: Math.floor(Math.random() * 20 + 5),
      timestamp: new Date(Date.now() - idx * 86400000)
    }));
  }

  const transactionsList = document.getElementById('transactionsList');
  transactionsList.innerHTML = appState.user.bookingHistory.map(txn => `
    <div class="transaction-item">
      <div class="transaction-info">
        <div class="transaction-header">
          <span class="transaction-zone">${txn.zone}</span>
          <span class="transaction-status ${txn.status.toLowerCase()}">${txn.status}</span>
        </div>
        <div class="transaction-details">
          ${txn.duration} hour${txn.duration > 1 ? 's' : ''} • ${txn.timestamp.toLocaleDateString()}
        </div>
        <div class="transaction-hash">${txn.hash}</div>
      </div>
      <div class="transaction-amount">
        <div class="transaction-price">$${txn.amount}</div>
        <div class="transaction-coins">+${txn.coinsEarned} coins</div>
      </div>
    </div>
  `).join('');
}

// Initialize app
function initApp() {
  // Initialize zones
  appState.zones = initializeZones();

  // Set up event listeners
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      if (view) switchView(view);
    });
  });

  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
  document.getElementById('themeSwitch')?.addEventListener('click', toggleTheme);
  
  document.getElementById('refreshBtn')?.addEventListener('click', () => {
    updateZones();
    updateDashboard();
    
    // Animate refresh button
    const btn = document.getElementById('refreshBtn');
    const icon = btn.querySelector('i');
    icon.style.animation = 'spin 0.5s linear';
    setTimeout(() => {
      icon.style.animation = '';
    }, 500);
  });

  document.getElementById('backBtn')?.addEventListener('click', () => {
    switchView('dashboard');
  });

  // Heatmap layer toggle
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const layer = btn.dataset.layer;
      if (!layer) return;
      
      appState.heatmapLayer = layer;
      
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      renderCityGrid('cityGrid', layer);
      
      // Update legend labels
      if (layer === 'parking') {
        document.getElementById('legendLow').textContent = 'Abundant';
        document.getElementById('legendMid').textContent = 'Moderate';
        document.getElementById('legendHigh').textContent = 'Critical';
      } else {
        document.getElementById('legendLow').textContent = 'Smooth';
        document.getElementById('legendMid').textContent = 'Moderate';
        document.getElementById('legendHigh').textContent = 'Congested';
      }
    });
  });

  // Prediction tabs
  document.querySelectorAll('.pred-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const horizon = parseInt(tab.dataset.horizon);
      appState.predictionHorizon = horizon;
      
      document.querySelectorAll('.pred-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      if (appState.selectedZone) {
        renderPredictionChart(appState.selectedZone);
      }
    });
  });

  // Analytics controls
  document.getElementById('horizonSelect')?.addEventListener('change', (e) => {
    appState.predictionHorizon = parseInt(e.target.value);
  });

  document.getElementById('compareZones')?.addEventListener('change', () => {
    renderComparisonChart();
  });

  // Settings controls
  document.getElementById('autoRefreshToggle')?.addEventListener('change', (e) => {
    appState.autoRefresh = e.target.checked;
  });

  document.getElementById('updateInterval')?.addEventListener('change', () => {
    startAutoRefresh();
  });

  // Initial render
  updateUserProfile();
  updateDashboard();
  startAutoRefresh();
  
  // Initialize sample booking history for first load
  if (appState.user.bookingHistory.length === 0) {
    renderPaymentHistory();
  }

  // Detect system theme
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    const icon = document.querySelector('#themeToggle i');
    if (icon) icon.className = 'fas fa-sun';
  }
}

// Book parking
function bookParking(zone) {
  const price = calculateDynamicPrice(zone);
  const duration = 2; // Default 2 hours
  const totalAmount = (price * duration).toFixed(2);
  
  const currentTier = LOYALTY_TIERS.find(t => 
    appState.user.points >= t.minPoints && appState.user.points <= t.maxPoints
  );
  
  const coinsEarned = Math.floor(totalAmount * (currentTier ? currentTier.pointsPerDollar : 1));
  
  // Simulate blockchain transaction
  const txnHash = `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`;
  
  // Add to booking history
  const booking = {
    id: `TXN${Date.now()}`,
    zone: zone.name,
    amount: totalAmount,
    duration: duration,
    status: 'Pending',
    hash: txnHash,
    coinsEarned: coinsEarned,
    timestamp: new Date()
  };
  
  appState.user.bookingHistory.unshift(booking);
  
  // Keep only last 20 bookings
  if (appState.user.bookingHistory.length > 20) {
    appState.user.bookingHistory = appState.user.bookingHistory.slice(0, 20);
  }
  
  // Update user stats
  appState.user.parkCoins += coinsEarned;
  appState.user.lifetimeCoins += coinsEarned;
  appState.user.points += coinsEarned;
  
  // Simulate blockchain confirmation after 3 seconds
  setTimeout(() => {
    booking.status = 'Confirmed';
    if (appState.currentView === 'payment') {
      renderPaymentHistory();
    }
  }, 3000);
  
  // Update UI
  updateUserProfile();
  
  // Show confirmation
  alert(`Booking Confirmed!\n\nZone: ${zone.name}\nDuration: ${duration} hours\nTotal: $${totalAmount}\n\nTransaction: ${txnHash}\nParkCoins Earned: +${coinsEarned}\n\nYour booking is being recorded on the blockchain...`);
  
  // Switch to payment view to see the new transaction
  switchView('payment');
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}