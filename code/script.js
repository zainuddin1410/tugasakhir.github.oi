let map; 
let selectedVillageMarker = null; 
let drawnPolygon = null; 
let farmersByRegency = JSON.parse(localStorage.getItem('farmersByRegency')) || {}; 
let kiosAccounts;

const FIXED_CREDENTIALS = {
    "pegawai": "petanisejahtera",    
    "pemerintah": "panenraya2025"    
};

const cropSpecificFertilizer = {
    "padi": {
        "Urea": 250,  
        "SP-36": 100, 
        "KCl": 100    
    },
    "jagung": {
        "Urea": 200,
        "SP-36": 120,
        "KCl": 100
    },
    "ubi_kayu": {
        "Urea": 150,
        "SP-36": 80,
        "KCl": 150
    },
    "ubi_jalar": {
        "Urea": 100,
        "SP-36": 60,
        "KCl": 80
    }
};

const villagesInKalsel = [
    { name: "Sungai Lulut", district: "Sungai Tabuk", regency: "Banjar", lat: -3.3156, lng: 114.6543 },
    { name: "Alalak", district: "Alalak", regency: "Barito Kuala", lat: -3.2750, lng: 114.5800 },
    { name: "Gambut", district: "Gambut", regency: "Banjar", lat: -3.4210, lng: 114.8010 },
    { name: "Martapura Kota", district: "Martapura", regency: "Banjar", lat: -3.4090, lng: 114.7820 },
    { name: "Cempaka", district: "Cempaka", regency: "Banjarbaru", lat: -3.4500, lng: 114.8500 },
    { name: "Liang Anggang", district: "Liang Anggang", regency: "Banjarbaru", lat: -3.5300, lng: 114.7700 },
    { name: "Batulicin", district: "Batulicin", regency: "Tanah Bumbu", lat: -3.4580, lng: 116.0300 },
    { name: "Kertak Hanyar", district: "Kertak Hanyar", regency: "Banjar", lat: -3.3700, lng: 114.6400 },
    { name: "Sungai Tabuk", district: "Sungai Tabuk", regency: "Banjar", lat: -3.3000, lng: 114.6800 },
    { name: "Handil Bakti", district: "Alalak", regency: "Barito Kuala", lat: -3.2800, lng: 114.5900 },
    { name: "Landasan Ulin", district: "Landasan Ulin", regency: "Banjarbaru", lat: -3.4500, lng: 114.7500 },
    { name: "Bati-Bati", district: "Bati-Bati", regency: "Tanah Laut", lat: -3.7300, lng: 114.8200 },
    { name: "Pelaihari", district: "Pelaihari", regency: "Tanah Laut", lat: -3.7800, lng: 114.7300 },
    { name: "Jorong", district: "Jorong", regency: "Tanah Laut", lat: -3.9100, lng: 115.1500 },
    { name: "Angsana", district: "Angsana", regency: "Tanah Bumbu", lat: -3.6600, lng: 115.8900 },
    { name: "Satui", district: "Satui", regency: "Tanah Bumbu", lat: -3.7500, lng: 115.5800 },
    { name: "Simpang Empat", district: "Simpang Empat", regency: "Tanah Bumbu", lat: -3.4500, lng: 115.9000 },
    { name: "Kusan Hilir", district: "Kusan Hilir", regency: "Tanah Bumbu", lat: -3.4000, lng: 116.2000 },
    { name: "Paringin", district: "Paringin", regency: "Balangan", lat: -2.3500, lng: 115.4800 },
    { name: "Awayan", district: "Awayan", regency: "Balangan", lat: -2.3000, lng: 115.3500 },
    { name: "Karang Bintang", district: "Karang Bintang", regency: "Tanah Bumbu", lat: -3.35, lng: 115.95 },
    { name: "Kuala Tambangan", district: "Takisung", regency: "Tanah Laut", lat: -3.85, lng: 114.78 },
    { name: "Lok Baintan", district: "Sungai Tabuk", regency: "Banjar", lat: -3.35, lng: 114.65 },
    { name: "Paramasan", district: "Paramasan", regency: "Banjar", lat: -3.10, lng: 115.50 },
    { name: "Panggung", district: "Pelaihari", regency: "Tanah Laut", lat: -3.80, lng: 114.75 },
    { name: "Sungai Danau", district: "Satui", regency: "Tanah Bumbu", lat: -3.78, lng: 115.65 },
    { name: "Tanjung", district: "Tanjung", regency: "Tabalong", lat: -2.18, lng: 115.38 },
    { name: "Amuntai Kota", district: "Amuntai Tengah", regency: "Hulu Sungai Utara", lat: -2.41, lng: 115.25 },
    { name: "Kandangan", district: "Kandangan", regency: "Hulu Sungai Selatan", lat: -2.77, lng: 115.22 },
    { name: "Barabai", district: "Barabai", regency: "Hulu Sungai Tengah", lat: -2.58, lng: 115.37 },
    { name: "Rantau", district: "Rantau", regency: "Tapin", lat: -2.97, lng: 115.08 },
    { name: "Banjarmasin Tengah", district: "Banjarmasin Tengah", regency: "Banjarmasin (Kota)", lat: -3.32, lng: 114.59 },
    { name: "Banjarbaru Utara", district: "Banjarbaru Utara", regency: "Banjarbaru (Kota)", lat: -3.44, lng: 114.74 }
];

let sisaPupuk = JSON.parse(localStorage.getItem("sisaJatahPupuk")) || {};
let riwayatPengambilan = JSON.parse(localStorage.getItem("riwayatPengambilan")) || [];
let autoPlayInterval; 
function setAuth(role, username = '') {
    sessionStorage.setItem("userRole", role);
    sessionStorage.setItem("loggedInUsername", username);
    console.log(`[AUTH] User role set to: ${role}, username: ${username}`);
}

function getAuthRole() {
    return sessionStorage.getItem("userRole");
}

function getLoggedInUsername() {
    return sessionStorage.getItem("loggedInUsername");
}

function clearAuth() {
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("loggedInUsername");
    console.log("[AUTH] Session cleared.");
}

function logout() {
    clearAuth();
    alert('Anda telah logout.');
    window.location.href = 'index.html'; 
}

function checkAccess(allowedRoles) {
    const userRole = getAuthRole();
    
    const currentPage = window.location.pathname.split("/").pop(); 

    
    const publicPages = ["index.html", "beranda.html", "login.html", "register-kios.html", "pupuk.html", "riwayat.html"];

    
    const adminOnlyPages = ["register.html", "Datapetani.html", "Pencarian.html"]; 
    const kiosOnlyPages = ["pengambilan.html"]; 

    if (!publicPages.includes(currentPage)) {
        if (!userRole) { 
            alert("Anda harus login untuk mengakses halaman ini.");
            window.location.href = "index.html"; 
            return;
        }

        if (adminOnlyPages.includes(currentPage)) {
            
            if (userRole !== 'pegawai' && userRole !== 'pemerintah') {
                alert('Anda tidak memiliki izin untuk mengakses halaman ini. Silakan login sebagai Pegawai atau Pemerintah.');
                window.location.href = 'index.html'; 
                return;
            }
        } else if (kiosOnlyPages.includes(currentPage)) {
            
            if (userRole !== 'kios' && userRole !== 'pegawai' && userRole !== 'pemerintah') {
                alert('Anda tidak memiliki izin untuk mengakses halaman ini. Silakan login sebagai Kios, Pegawai, atau Pemerintah.');
                window.location.href = 'index.html'; 
                return;
            }
        } else {
            console.warn(`[AUTH] Halaman "${currentPage}" tidak memiliki aturan otorisasi yang jelas. Memerlukan peninjauan.`);
        }
    }
}

function updateLogoutButtonVisibility() {
    const logoutButton = document.getElementById("logoutButton"); 
    const floatingLogoutButton = document.getElementById("floatingLogoutButton"); 

    const isLoggedIn = !!getAuthRole(); 

    if (logoutButton) {
        logoutButton.style.display = isLoggedIn ? "block" : "none";
    }
    if (floatingLogoutButton) {
        floatingLogoutButton.style.display = isLoggedIn ? "block" : "none";
    }
}

function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.warn("Elemen peta dengan ID 'map' tidak ditemukan. Mungkin Anda tidak berada di halaman register.html.");
        return;
    }

    
    if (!map) {
        map = L.map(mapElement).setView([-2.977464, 114.773725], 8); 

        
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

        
        const esriSatLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        osmLayer.addTo(map); 

        
        const baseMaps = {
            "OpenStreetMap": osmLayer,
            "Satelit (Esri)": esriSatLayer
        };
        L.control.layers(baseMaps).addTo(map);


        const drawnItems = new L.FeatureGroup().addTo(map);
        const drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems,
                poly: { allowIntersection: false }
            },
            draw: {
                polygon: { allowIntersection: false, showArea: true },
                polyline: false, circle: false, circlemarker: false, rectangle: false,
                marker: true 
            }
        });
        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, function (event) {
            const type = event.layerType;
            const layer = event.layer;

            if (type === 'polygon') {
                if (drawnPolygon) map.removeLayer(drawnPolygon); 
                drawnPolygon = layer;
                
                
                
                const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]) / 10000;
                document.getElementById('landSize').value = area.toFixed(4); 
                
                
                const coordinates = JSON.stringify(layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]));
                document.getElementById('drawnLandCoordinates').value = coordinates;

            } else if (type === 'marker') {
                if (selectedVillageMarker) map.removeLayer(selectedVillageMarker); 
                selectedVillageMarker = layer;
            }
            drawnItems.addLayer(layer); 
        });

        map.on(L.Draw.Event.EDITED, function(event) {
            event.layers.eachLayer(function(layer) {
                if (layer === drawnPolygon && layer instanceof L.Polygon) {
                    const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]) / 10000;
                    document.getElementById('landSize').value = area.toFixed(4);
                    const coordinates = JSON.stringify(layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]));
                    document.getElementById('drawnLandCoordinates').value = coordinates;
                }
            });
        });

        map.on(L.Draw.Event.DELETED, function(event) {
            event.layers.eachLayer(function(layer) {
                if (layer === drawnPolygon) {
                    drawnPolygon = null;
                    document.getElementById('landSize').value = '';
                    document.getElementById('drawnLandCoordinates').value = '';
                } else if (layer === selectedVillageMarker) {
                    selectedVillageMarker = null;
                }
            });
        });
    }
}

let searchVillageTimeout;

async function searchVillage() {
    clearTimeout(searchVillageTimeout); 
    
    
    searchVillageTimeout = setTimeout(async () => {
        const autocompleteInput = document.getElementById('autocomplete');
        const villageSearchStatus = document.getElementById('villageSearchStatus');
        const regencySelect = document.getElementById('regency'); 
        const query = autocompleteInput.value.trim();

        
        

        if (query.length < 3) {
            villageSearchStatus.textContent = 'Masukkan minimal 3 karakter untuk mencari lokasi di peta.';
            villageSearchStatus.style.color = 'red';
            if (selectedVillageMarker) {
                map.removeLayer(selectedVillageMarker);
                selectedVillageMarker = null;
            }
            return;
        }

        villageSearchStatus.textContent = 'Mencari lokasi...';
        villageSearchStatus.style.color = 'gray';

        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${query}, Kalimantan Selatan, Indonesia&limit=5&accept-language=id`;

        try {
            const response = await fetch(nominatimUrl);
            const data = await response.json();

            if (data && data.length > 0) {
                const relevantResults = data.filter(item => {
                    const typeMatch = (item.type === 'village' || item.type === 'hamlet' || item.type === 'suburb' || 
                                       item.type === 'residential' || item.type === 'city_district' || item.type === 'town' || 
                                       item.type === 'city' || item.type === 'administrative');

                    const kalselMatch = (item.display_name.includes('Kalimantan Selatan') || item.display_name.includes('Kalimantan S.E.L.A.T.A.N'));
                    
                    const queryMatchesDisplayName = item.display_name.toLowerCase().includes(query.toLowerCase());

                    return typeMatch && kalselMatch && queryMatchesDisplayName;
                });

                if (relevantResults.length > 0) {
                    const result = relevantResults[0]; 
                    const lat = parseFloat(result.lat);
                    const lon = parseFloat(result.lon);

                    
                    if (selectedVillageMarker) {
                        map.removeLayer(selectedVillageMarker);
                    }

                    
                    selectedVillageMarker = L.marker([lat, lon]).addTo(map)
                        .bindPopup(`<b>${result.display_name}</b>`).openPopup();

                    map.setView([lat, lon], 13); 

                    villageSearchStatus.textContent = `Lokasi ditemukan: ${result.display_name}. Silakan isi Desa/Kelurahan dan Kecamatan secara manual.`;
                    villageSearchStatus.style.color = 'green';

                    
                    const addressParts = result.address || {};
                    let detectedRegencyValue = '';
                     if (addressParts.city_district) { 
                        detectedRegencyValue = addressParts.county || addressParts.state || addressParts.city; 
                    } else if (addressParts.village || addressParts.hamlet || addressParts.suburb || addressParts.residential) {
                        detectedRegencyValue = addressParts.county || addressParts.state_district || addressParts.state || '';
                    } else if (addressParts.town || addressParts.city) {
                        detectedRegencyValue = addressParts.county || addressParts.state || addressParts.city || '';
                    } else if (addressParts.county) {
                        detectedRegencyValue = addressParts.county;
                    }

                    if (detectedRegencyValue) {
                        const options = Array.from(regencySelect.options);
                        const matchedOption = options.find(opt => 
                            opt.value.toLowerCase().includes(detectedRegencyValue.toLowerCase()) || 
                            detectedRegencyValue.toLowerCase().includes(opt.value.toLowerCase()) ||
                            (opt.value === "Banjarmasin (Kota)" && detectedRegencyValue.toLowerCase().includes("banjarmasin")) ||
                            (opt.value === "Banjarbaru (Kota)" && detectedRegencyValue.toLowerCase().includes("banjarbaru"))
                        );
                        if (matchedOption) {
                            regencySelect.value = matchedOption.value;
                        } else {
                            console.warn(`Kabupaten '${detectedRegencyValue}' dari Nominatim tidak cocok dengan opsi dropdown. Silakan pilih manual.`);
                        }
                    }

                } else {
                    villageSearchStatus.textContent = 'Tidak ada hasil yang relevan di Kalimantan Selatan. Coba kata kunci lain atau periksa penulisan. Mohon isi Desa/Kelurahan dan Kecamatan secara manual.';
                    villageSearchStatus.style.color = 'orange';
                    if (selectedVillageMarker) {
                        map.removeLayer(selectedVillageMarker);
                    }
                }
            } else {
                villageSearchStatus.textContent = 'Lokasi tidak ditemukan. Coba kata kunci lain. Mohon isi Desa/Kelurahan dan Kecamatan secara manual.';
                villageSearchStatus.style.color = 'red';
                if (selectedVillageMarker) {
                    map.removeLayer(selectedVillageMarker);
                }
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat mencari lokasi:', error);
            villageSearchStatus.textContent = 'Terjadi kesalahan saat mencari lokasi. Coba lagi nanti. Mohon isi Desa/Kelurahan dan Kecamatan secara manual.';
            villageSearchStatus.style.color = 'red';
            if (selectedVillageMarker) {
                map.removeLayer(selectedVillageMarker);
            }
        }
    }, 500); 
}

function calculateFertilizer() {
    
    const landSizeInput = document.getElementById('landSize');
    
    const cropTypeSelect = document.getElementById('cropType');
    const fertilizerResultDiv = document.getElementById('fertilizerResult');

    const landSize = parseFloat(landSizeInput.value);
    const cropType = cropTypeSelect.value;

    
    if (isNaN(landSize) || landSize <= 0) {
        alert("Mohon gambar lahan di peta terlebih dahulu atau masukkan luas lahan yang valid (lebih dari 0).");
        fertilizerResultDiv.innerHTML = "";
        fertilizerResultDiv.removeAttribute('data-json');
        return;
    }
    
    if (!cropType) {
        alert("Mohon pilih jenis tanaman.");
        fertilizerResultDiv.innerHTML = "";
        fertilizerResultDiv.removeAttribute('data-json');
        return;
    }

    
    const requirements = cropSpecificFertilizer[cropType];
    
    if (!requirements) {
        alert(`Data kebutuhan pupuk untuk jenis tanaman "${cropType}" tidak ditemukan.`);
        fertilizerResultDiv.innerHTML = "";
        fertilizerResultDiv.removeAttribute('data-json');
        return;
    }

    let resultHTML = `<h4>Kebutuhan Pupuk Estimasi (${cropTypeSelect.options[cropTypeSelect.selectedIndex].text}, ${landSize} ha):</h4><ul>`;
    let fertilizerData = {};

    
    for (const fertilizer in requirements) {
        const amount = requirements[fertilizer] * landSize; 
        resultHTML += `<li>${fertilizer}: ${amount.toFixed(2)} kg</li>`;
        fertilizerData[fertilizer] = parseFloat(amount.toFixed(2));
    }
    resultHTML += "</ul>";
    fertilizerResultDiv.innerHTML = resultHTML;
    fertilizerResultDiv.setAttribute('data-json', JSON.stringify(fertilizerData)); 
}

function submitForm() {
    
    const farmerName = document.getElementById('farmerName');
    const farmerAddress = document.getElementById('farmerAddress');
    const farmerPhone = document.getElementById('farmerPhone');
    const farmerEmail = document.getElementById('farmerEmail');
    const regency = document.getElementById('regency');
    const village = document.getElementById('village');
    const district = document.getElementById('district');
    const drawnLandCoordinates = document.getElementById('drawnLandCoordinates');
    const cropType = document.getElementById('cropType');
    const landSizeInput = document.getElementById('landSize'); 
    const fertilizerResultDiv = document.getElementById('fertilizerResult');

    
    if (!farmerName || !farmerAddress || !regency || !village || !district || !drawnLandCoordinates || !cropType || !landSizeInput || !fertilizerResultDiv) {
        alert('Terjadi kesalahan: Beberapa elemen formulir tidak ditemukan. Harap periksa HTML.');
        console.error('Missing form elements');
        return;
    }

    const name = farmerName.value.trim();
    const address = farmerAddress.value.trim();
    const phone = farmerPhone.value.trim();
    const email = farmerEmail.value.trim();
    const selectedRegency = regency.value.trim();
    const selectedVillage = village.value.trim(); 
    const selectedDistrict = district.value.trim(); 
    const coordinates = drawnLandCoordinates.value.trim();
    const selectedCropType = cropType.value;
    const landSize = parseFloat(landSizeInput.value);
    const fertilizerResultJson = fertilizerResultDiv.dataset.json;
    const fertilizerResult = fertilizerResultJson ? JSON.parse(fertilizerResultJson) : null;


    if (!name || !address || !selectedRegency || !selectedVillage || !selectedDistrict || !coordinates || isNaN(landSize) || landSize <= 0 || !selectedCropType || !fertilizerResult || Object.keys(fertilizerResult).length === 0) {
        alert('Harap lengkapi semua data pendaftaran petani dengan benar:\n- Isi semua kolom teks yang wajib\n- Gambarkan lahan di peta (akan mengisi luas lahan dan koordinat secara otomatis)\n- Isi Desa/Kelurahan dan Kecamatan secara manual\n- Pilih jenis tanaman\n- Klik "Hitung Kebutuhan Pupuk"');
        return;
    }

    if (!drawnPolygon) {
        alert('Harap gambarkan lahan di peta terlebih dahulu menggunakan alat gambar polygon.');
        return;
    }
    
    const polygonCoords = drawnPolygon.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);

    
    let lastId = parseInt(localStorage.getItem('lastFarmerId')) || 0;
    lastId++;
    localStorage.setItem('lastFarmerId', lastId);
    const farmerId = `FARMER-${lastId.toString().padStart(4, '0')}`;

    const newFarmer = {
        id: farmerId,
        name,
        address,
        phone,
        email,
        regency: selectedRegency,
        district: selectedDistrict,
        village: selectedVillage,
        landSize,
        coordinates: polygonCoords, 
        cropType: selectedCropType,
        fertilizerResult: fertilizerResult
    };

    if (!farmersByRegency[selectedRegency]) {
        farmersByRegency[selectedRegency] = [];
    }
    farmersByRegency[selectedRegency].push(newFarmer);
    localStorage.setItem('farmersByRegency', JSON.stringify(farmersByRegency));

    
    let initialPupukJatah = {};
    for (const pupukJenis in fertilizerResult) {
        initialPupukJatah[pupukJenis] = parseFloat(fertilizerResult[pupukJenis]);
    }
    
    
    let farmerPupukEntryFound = false;
    if (sisaPupuk[selectedRegency]) {
        for (let i = 0; i < sisaPupuk[selectedRegency].length; i++) {
            if (sisaPupuk[selectedRegency][i].farmerId === newFarmer.id) {
                sisaPupuk[selectedRegency][i].pupuk = initialPupukJatah; 
                farmerPupukEntryFound = true;
                break;
            }
        }
    }
    if (!farmerPupukEntryFound) {
        if (!sisaPupuk[selectedRegency]) {
            sisaPupuk[selectedRegency] = [];
        }
        sisaPupuk[selectedRegency].push({
            farmerId: newFarmer.id, 
            farmerName: newFarmer.name,
            pupuk: initialPupukJatah 
        });
    }
    localStorage.setItem("sisaJatahPupuk", JSON.stringify(sisaPupuk));


    alert('Pendaftaran petani berhasil! ID Petani Anda: ' + farmerId);
    document.getElementById('farmerRegistrationForm').reset(); 
    document.getElementById('fertilizerResult').innerHTML = ''; 
    document.getElementById('fertilizerResult').dataset.json = '';
    document.getElementById('landSize').value = ''; 
    document.getElementById('drawnLandCoordinates').value = ''; 
    
    document.getElementById('villageSearchStatus').textContent = 'Cari lokasi untuk menempatkan marker di peta, lalu isi Desa/Kelurahan dan Kecamatan secara manual.'; 
    document.getElementById('villageSearchStatus').style.color = 'gray';

    
    if (map) {
        const drawnItemsLayer = map.getLayers().find(layer => layer instanceof L.FeatureGroup);
        if (drawnItemsLayer) {
            drawnItemsLayer.clearLayers();
        }
        drawnPolygon = null;
        if (selectedVillageMarker) {
            map.removeLayer(selectedVillageMarker);
            selectedVillageMarker = null;
        }
    }
}

function displayFarmers() {
    const farmersTableBody = document.getElementById('farmersTableBody'); 
    if (!farmersTableBody) return; 

    farmersTableBody.innerHTML = '';
    let totalFarmers = 0;

    if (Object.keys(farmersByRegency).length === 0) {
        
        const row = farmersTableBody.insertRow();
        row.innerHTML = `<td colspan="14" style="text-align: center;">Belum ada data petani terdaftar.</td>`;
        return;
    }

    
    for (const regency in farmersByRegency) {
        farmersByRegency[regency].forEach((farmer, index) => {
            totalFarmers++;
            const row = farmersTableBody.insertRow();
            
            const coordinatesDisplay = farmer.coordinates && farmer.coordinates.length > 0
                ? farmer.coordinates.map(coord => `[${coord[0].toFixed(4)}, ${coord[1].toFixed(4)}]`).join('; ')
                : '-';

            
            const fertilizerHtml = farmer.fertilizerResult ?
                Object.entries(farmer.fertilizerResult).map(([jenis, jumlah]) => {
                    return `&nbsp;&nbsp;- ${jenis}: ${parseFloat(jumlah).toFixed(2)} kg`; 
                }).join('<br>') : 'Belum dihitung';

            row.innerHTML = `
                <td>${totalFarmers}</td>
                <td>${farmer.id}</td>
                <td>${farmer.name}</td>
                <td>${farmer.phone || '-'}</td>
                <td>${farmer.email || '-'}</td>
                <td>${farmer.address}</td>
                <td>${farmer.regency}</td>
                <td>${farmer.district}</td>
                <td>${farmer.village}</td>
                <td>${farmer.landSize.toFixed(2)} ha</td>
                <td>${farmer.cropType ? farmer.cropType.toUpperCase() : '-'}</td>
                <td>${fertilizerHtml}</td>
                <td>${coordinatesDisplay}</td>
                <td>
                    <button class="edit-btn" onclick="editFarmer('${regency}', ${index})">✏️ Edit</button>
                    <button class="hapus-btn" onclick="deleteFarmer('${regency}', ${index})">🗑️ Hapus</button>
                </td>
            `;
        });
    }
}

function deleteFarmer(regency, index) {
    if (!farmersByRegency[regency] || farmersByRegency[regency].length <= index) return;

    if (confirm("Yakin ingin menghapus data ini?")) {
        const farmerToDelete = farmersByRegency[regency][index];
        
        
        if (sisaPupuk[regency]) {
            sisaPupuk[regency] = sisaPupuk[regency].filter(data => data.farmerId !== farmerToDelete.id);
            if (sisaPupuk[regency].length === 0) {
                delete sisaPupuk[regency]; 
            }
            localStorage.setItem("sisaJatahPupuk", JSON.stringify(sisaPupuk));
        }
        
        farmersByRegency[regency].splice(index, 1);
        if (farmersByRegency[regency].length === 0) {
            delete farmersByRegency[regency]; 
        }
        localStorage.setItem('farmersByRegency', JSON.stringify(farmersByRegency));
        displayFarmers(); 
        alert("Data petani berhasil dihapus.");
    }
}

function editFarmer(regency, index) {
    if (!farmersByRegency[regency] || farmersByRegency[regency].length <= index) return;

    const farmer = farmersByRegency[regency][index];

    const newName = prompt("Edit Nama:", farmer.name);
    const newPhone = prompt("Edit Nomor Telepon:", farmer.phone || '');
    const newEmail = prompt("Edit Email:", farmer.email || '');
    const newAddress = prompt("Edit Alamat:", farmer.address);
    const newDistrict = prompt("Edit Kecamatan:", farmer.district);
    const newVillage = prompt("Edit Desa/Kelurahan:", farmer.village);
    const newLandSize = prompt("Edit Luas Lahan (ha):", farmer.landSize);
    const newCropType = prompt("Edit Jenis Tanaman (padi/jagung/ubi_kayu/ubi_jalar):", farmer.cropType);


    
    if (newName === null || newPhone === null || newEmail === null || newAddress === null || newDistrict === null || newVillage === null || newLandSize === null || newCropType === null) {
        alert("Edit dibatalkan.");
        return;
    }

    const parsedLandSize = parseFloat(newLandSize);
    if (isNaN(parsedLandSize) || parsedLandSize <= 0) {
        alert("Luas lahan tidak valid. Harap masukkan angka positif.");
        return;
    }
    const lowerCaseCropType = newCropType.toLowerCase().trim();
    if (!cropSpecificFertilizer[lowerCaseCropType]) {
        alert(`Jenis tanaman "${newCropType}" tidak valid. Harap pilih dari: padi, jagung, ubi_kayu, ubi_jalar.`);
        return;
    }

    
    farmer.name = newName.trim();
    farmer.phone = newPhone.trim();
    farmer.email = newEmail.trim();
    farmer.address = newAddress.trim();
    farmer.district = newDistrict.trim();
    farmer.village = newVillage.trim();
    farmer.landSize = parsedLandSize;
    farmer.cropType = lowerCaseCropType; 

    
    const fertilizerNeeds = cropSpecificFertilizer[farmer.cropType];
    let updatedFertilizerResult = {};
    if (fertilizerNeeds) {
        for (const type in fertilizerNeeds) {
            updatedFertilizerResult[type] = (farmer.landSize * fertilizerNeeds[type]).toFixed(2);
        }
        farmer.fertilizerResult = updatedFertilizerResult;
    } else {
        console.warn(`Jenis tanaman "${farmer.cropType}" tidak memiliki data kebutuhan pupuk.`);
        farmer.fertilizerResult = {}; 
    }

    
    let farmerPupukEntryFound = false;
    if (sisaPupuk[regency]) {
        for (let i = 0; i < sisaPupuk[regency].length; i++) {
            if (sisaPupuk[regency][i].farmerId === farmer.id) {
                sisaPupuk[regency][i].farmerName = farmer.name;
                sisaPupuk[regency][i].pupuk = { ...updatedFertilizerResult }; 
                farmerPupukEntryFound = true;
                break;
            }
        }
    }
    if (!farmerPupukEntryFound) {
        if (!sisaPupuk[regency]) {
            sisaPupuk[regency] = [];
        }
        sisaPupuk[regency].push({
            farmerId: farmer.id,
            farmerName: farmer.name,
            pupuk: { ...updatedFertilizerResult }
        });
    }
    
    localStorage.setItem("sisaJatahPupuk", JSON.stringify(sisaPupuk));
    localStorage.setItem('farmersByRegency', JSON.stringify(farmersByRegency)); 
    displayFarmers(); 
    alert("Data petani berhasil diperbarui.");
}

function searchAndDisplayJatah() {
    const ktpInput = document.getElementById('ktpPetani'); 
    const infoJatahDiv = document.getElementById('infoJatah');
    const hasilDiv = document.getElementById('hasilPengambilan');
    const pengambilanForm = document.getElementById('pengambilanForm');
    const selectJenisPupuk = document.getElementById('jenisPupukAmbil');

    if (!ktpInput || !infoJatahDiv || !hasilDiv || !pengambilanForm || !selectJenisPupuk) {
        return; 
    }

    infoJatahDiv.style.display = 'none';
    hasilDiv.innerHTML = '';
    pengambilanForm.style.display = 'none'; 
    selectJenisPupuk.innerHTML = '<option value="">-- Pilih Jenis Pupuk --</option>'; 

    const farmerIdToSearch = ktpInput.value.trim();

    if (!farmerIdToSearch) {
        hasilDiv.innerHTML = '<p style="color: orange;">Mohon masukkan ID Petani untuk pencarian.</p>';
        return;
    }

    let foundFarmer = null;
    let farmerRegency = null;
    for (const regency in farmersByRegency) {
        foundFarmer = farmersByRegency[regency].find(f => f.id === farmerIdToSearch); 
        if (foundFarmer) {
            farmerRegency = regency;
            break;
        }
    }

    if (foundFarmer) {
        
        let farmerPupukData = null;
        if (sisaPupuk[farmerRegency]) {
            farmerPupukData = sisaPupuk[farmerRegency].find(data => data.farmerId === foundFarmer.id);
        }

        
        if (!farmerPupukData) {
            farmerPupukData = {
                farmerId: foundFarmer.id,
                farmerName: foundFarmer.name,
                pupuk: foundFarmer.fertilizerResult ? { ...foundFarmer.fertilizerResult } : {}
            };
            if (!sisaPupuk[farmerRegency]) {
                sisaPupuk[farmerRegency] = [];
            }
            sisaPupuk[farmerRegency].push(farmerPupukData);
            localStorage.setItem("sisaJatahPupuk", JSON.stringify(sisaPupuk)); 
        }

        
        let initialNeedsHtml = '<ul>';
        const originalFertilizerResult = foundFarmer.fertilizerResult || {};
        for (const jenisPupuk in originalFertilizerResult) {
            initialNeedsHtml += `<li><strong>${jenisPupuk}:</strong> ${parseFloat(originalFertilizerResult[jenisPupuk]).toFixed(2)} kg</li>`;
        }
        initialNeedsHtml += '</ul>';

        
        let pupukDetailsHtml = '<ul>';
        let hasPupukTersedia = false; 

        for (const jenisPupuk in farmerPupukData.pupuk) {
            const sisa = parseFloat(farmerPupukData.pupuk[jenisPupuk]); 
            pupukDetailsHtml += `<li><strong>${jenisPupuk}:</strong> <span style="font-weight: bold; color: ${sisa < (originalFertilizerResult[jenisPupuk] * 0.2) ? 'red' : 'green'};">${sisa.toFixed(2)} kg</span></li>`;
            
            
            if (sisa > 0) {
                const option = document.createElement('option');
                option.value = jenisPupuk;
                option.textContent = `${jenisPupuk} (Sisa: ${sisa.toFixed(2)} kg)`;
                selectJenisPupuk.appendChild(option);
                hasPupukTersedia = true;
            }
        }
        pupukDetailsHtml += '</ul>';

        hasilDiv.innerHTML = `
            <div style="padding: 15px; border: 1px solid #ccc; border-radius: 8px; margin-bottom: 10px;">
                <p><strong>Nama:</strong> ${foundFarmer.name}</p>
                <p><strong>ID Petani:</strong> ${foundFarmer.id}</p>
                <p><strong>Alamat:</strong> ${foundFarmer.address}</p>
                <p><strong>Kabupaten:</strong> ${farmerRegency}</p>
            </div>
            <div style="display: flex; justify-content: space-around; gap: 10px;">
                <div style="flex: 1; padding: 15px; border: 1px solid #a8e063; border-radius: 8px; background-color: #f0fff0;">
                    <h4>Kebutuhan Pupuk Estimasi Awal:</h4>
                    ${initialNeedsHtml}
                </div>
                <div style="flex: 1; padding: 15px; border: 1px solid #4CAF50; border-radius: 8px; background-color: #e6ffe6;">
                    <h4>Sisa Jatah Pupuk Saat Ini:</h4>
                    ${pupukDetailsHtml}
                </div>
            </div>
        `;
        infoJatahDiv.style.display = 'block';
        
        
        if (hasPupukTersedia) {
            pengambilanForm.style.display = 'block';
        } else {
            hasilDiv.innerHTML += '<p style="color: orange; font-weight: bold; margin-top: 10px;">Tidak ada sisa jatah pupuk yang tersedia untuk petani ini.</p>';
        }

        
        document.getElementById('idPetaniPengambilan').value = foundFarmer.id; 

    } else {
        hasilDiv.innerHTML = '<p style="color: red;">Petani dengan ID tersebut tidak ditemukan.</p>';
        infoJatahDiv.style.display = 'none';
        pengambilanForm.style.display = 'none';
    }
}

function submitPengambilan() {
    const farmerId = document.getElementById('idPetaniPengambilan').value; 
    const jenisPupukAmbil = document.getElementById('jenisPupukAmbil').value;
    const jumlahAmbil = parseFloat(document.getElementById('jumlahAmbil').value);
    const fotoInput = document.getElementById('fotoPengambilan');
    const foto = fotoInput.files[0];
    const hasilDiv = document.getElementById('hasilPengambilan');

    if (!farmerId || !jenisPupukAmbil || isNaN(jumlahAmbil) || jumlahAmbil <= 0 || !foto) {
        hasilDiv.innerHTML = '<p style="color: red;">Mohon lengkapi semua data pengambilan (Jenis Pupuk, Jumlah, Foto).</p>';
        return;
    }

    let foundFarmer = null;
    let farmerRegency = null;

    for (const regency in farmersByRegency) {
        const farmers = farmersByRegency[regency];
        const farmer = farmers.find(f => f.id === farmerId);
        if (farmer) {
            foundFarmer = farmer;
            farmerRegency = regency;
            break;
        }
    }

    if (!foundFarmer) {
        hasilDiv.innerHTML = '<p style="color: red;">Petani tidak ditemukan.</p>';
        return;
    }
    
    let farmerPupukData = null;
    if (sisaPupuk[farmerRegency]) {
        farmerPupukData = sisaPupuk[farmerRegency].find(data => data.farmerId === farmerId);
    }

    if (!farmerPupukData || farmerPupukData.pupuk[jenisPupukAmbil] === undefined) {
        hasilDiv.innerHTML = '<p style="color: red;">Jenis pupuk tidak tersedia untuk petani ini atau jatah belum diinisialisasi.</p>';
        return;
    }

    let currentSisa = parseFloat(farmerPupukData.pupuk[jenisPupukAmbil]);

    if (jumlahAmbil > currentSisa) {
        hasilDiv.innerHTML = `<p style="color: orange;">⚠️ Jumlah yang diminta (${jumlahAmbil.toFixed(2)} kg) melebihi sisa jatah ${jenisPupukAmbil} (${currentSisa.toFixed(2)} kg).</p>`;
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const fotoURL = e.target.result; 
        
        
        farmerPupukData.pupuk[jenisPupukAmbil] -= jumlahAmbil; 
        localStorage.setItem("sisaJatahPupuk", JSON.stringify(sisaPupuk));

        const newRiwayat = {
            date: new Date().toISOString().split('T')[0], 
            farmerId: foundFarmer.id,
            farmerName: foundFarmer.name,
            regency: farmerRegency,
            pupukType: jenisPupukAmbil,
            amount: jumlahAmbil.toFixed(2),
            remaining: farmerPupukData.pupuk[jenisPupukAmbil].toFixed(2), 
            kiosUsername: getLoggedInUsername() || "N/A", 
            fotoBase64: fotoURL, 
            fotoNama: foto.name
        };
        riwayatPengambilan.push(newRiwayat);
        localStorage.setItem("riwayatPengambilan", JSON.stringify(riwayatPengambilan));

        hasilDiv.innerHTML = `
            <div style="padding: 15px; border: 1px solid #ccc; border-radius: 8px;">
                <p><strong>Pengambilan berhasil!</strong></p>
                <p><strong>Nama:</strong> ${foundFarmer.name}</p>
                <p><strong>ID Petani:</strong> ${foundFarmer.id}</p>
                <p><strong>Jenis Pupuk:</strong> ${jenisPupukAmbil}</p>
                <p><strong>Jumlah Diambil:</strong> ${jumlahAmbil.toFixed(2)} kg</p>
                <p><strong>Sisa Jatah Sekarang:</strong> <span style="font-weight: bold; color: ${farmerPupukData.pupuk[jenisPupukAmbil] < (foundFarmer.fertilizerResult[jenisPupukAmbil] * 0.2) ? 'red' : 'green'};">${farmerPupukData.pupuk[jenisPupukAmbil].toFixed(2)}</span> kg</p>
                <img src="${fotoURL}" alt="Foto Pengambilan" style="max-width: 200px; margin-top: 10px;">
            </div>
        `;
        document.getElementById('jumlahAmbil').value = '';
        document.getElementById('fotoPengambilan').value = '';
        document.getElementById('jenisPupukAmbil').value = ''; 
        document.getElementById('preview').src = ''; 
        document.getElementById('preview').style.display = 'none'; 

        
        searchAndDisplayJatah(); 
        alert('Pengambilan pupuk berhasil dicatat!');
    };
    reader.readAsDataURL(foto);
}

function setupImagePreview() {
    const fotoPengambilanInput = document.getElementById('fotoPengambilan');
    const previewImage = document.getElementById('preview');
    if (fotoPengambilanInput && previewImage) {
        fotoPengambilanInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                previewImage.src = '';
                previewImage.style.display = 'none';
            }
        });
    }
}

function displayRiwayatPengambilan() {
    const riwayatTableBody = document.getElementById('riwayatTableBody');
    if (!riwayatTableBody) return;

    const riwayatPengambilan = JSON.parse(localStorage.getItem("riwayatPengambilan")) || [];
    riwayatTableBody.innerHTML = '';

    if (riwayatPengambilan.length === 0) {
        const row = riwayatTableBody.insertRow();
        row.innerHTML = `<td colspan="8" style="text-align: center;">Belum ada riwayat pengambilan pupuk.</td>`; 
    } else {
        riwayatPengambilan.forEach((entry, index) => {
            const row = riwayatTableBody.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.date}</td>
                <td>${entry.farmerId}</td>
                <td>${entry.farmerName}</td>
                <td>${entry.regency}</td>
                <td>${entry.pupukType}</td>
                <td>${entry.amount}</td>
                <td>${entry.remaining}</td>
                <td>${entry.kiosUsername}</td>
                <td><img src="${entry.fotoBase64}" alt="Foto ${entry.fotoNama}" style="max-width: 100px; max-height: 100px;"></td>
            `;
        });
    }
}

function searchFarmers() {
    const searchName = document.getElementById('searchName')?.value.trim().toLowerCase();
    const searchId = document.getElementById('searchIdPencarian')?.value.trim().toLowerCase();
    const resultDiv = document.getElementById('searchResult');

    if (!resultDiv) {
        return;
    }

    resultDiv.innerHTML = ''; 
    let found = false;

    if (!searchName && !searchId) {
        resultDiv.innerHTML = "<p style='color: red;'>Harap masukkan Nama Petani atau ID Petani untuk pencarian.</p>";
        return;
    }

    for (const regency in farmersByRegency) {
        const farmers = farmersByRegency[regency];
        const matchedFarmers = farmers.filter(f => {
            const nameMatch = searchName ? f.name.toLowerCase().includes(searchName) : true;
            const idMatch = searchId ? (f.id && f.id.toLowerCase().includes(searchId)) : true;
            return nameMatch && idMatch;
        });

        matchedFarmers.forEach(f => {
            found = true;
            const coord = f.coordinates?.[0] || ["-", "-"]; 
            resultDiv.innerHTML += `
                <div style="border: 1px solid #ccc; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                    <strong>Nama:</strong> ${f.name}<br>
                    <strong>ID Petani:</strong> ${f.id || '-'}<br>
                    <strong>Nomor Telepon:</strong> ${f.phone || '-'}<br>
                    <strong>Email:</strong> ${f.email || '-'}<br>
                    <strong>Alamat:</strong> ${f.address}<br>
                    <strong>Kabupaten:</strong> ${regency}<br>
                    <strong>Desa/Kecamatan:</strong> ${f.village}, ${f.district}<br>
                    <strong>Luas Lahan:</strong> ${f.landSize.toFixed(2)} ha<br>
                    <strong>Jenis Tanaman:</strong> ${f.cropType ? f.cropType.toUpperCase() : '-'}<br>
                    <strong>Kebutuhan Pupuk Estimasi:</strong><br>
                ${f.fertilizerResult ? Object.entries(f.fertilizerResult).map(([jenis, jumlah]) => {
                 return `&nbsp;&nbsp;- ${jenis}: ${parseFloat(jumlah).toFixed(2)} kg`; 
                  } ).join('<br>') : 'Belum dihitung'}<br>
                    <strong>Koordinat Lahan (Contoh):</strong> ${Array.isArray(coord) && coord.length === 2 ? `${coord[0]?.toFixed(4)}, ${coord[1]?.toFixed(4)}` : '-'}
                    <strong>Tanggal Daftar:</strong> ${f.registrationDate || 'Tidak Tersedia'}
                </div>
            `;
        });
    }
    if (!found) {
        resultDiv.innerHTML = "<p style='color: red;'>Data petani tidak ditemukan.</p>";
    }
}

function displayLoginUI() {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    const loginTitle = document.getElementById('loginTitle');
    const roleSelection = document.getElementById('roleSelection');
    const loginForm = document.getElementById('loginForm');
    const registerLinkKios = document.getElementById('registerLinkKios');

    if (role) {
        loginTitle.textContent = `Login sebagai ${role.charAt(0).toUpperCase() + role.slice(1)}`;
        if (roleSelection) roleSelection.style.display = 'none';
        if (loginForm) loginForm.style.display = 'flex';
        sessionStorage.setItem('tempRole', role);
        
        if (role === 'kios') {
            if (registerLinkKios) registerLinkKios.style.display = 'block';
        } else {
            if (registerLinkKios) registerLinkKios.style.display = 'none';
        }
    } else {
        if (loginTitle) loginTitle.textContent = 'Pilih Peran Login';
        if (roleSelection) roleSelection.style.display = 'flex';
        if (loginForm) loginForm.style.display = 'none';
        if (registerLinkKios) registerLinkKios.style.display = 'none';
        sessionStorage.removeItem('tempRole');
    }
}

function validateLogin() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const loginMsg = document.getElementById("loginMessage");
    const role = sessionStorage.getItem('tempRole');

    const credentials = {
        "pegawai": { username: "pegawai", password: "petanisejahtera" }, 
        "pemerintah": { username: "pemerintah", password: "panenraya2025" }, 
        "kios": {} 
    };

    let isValid = false;
    let redirectPage = "beranda.html"; 

    if (role === 'kios') {
        const registeredKios = JSON.parse(localStorage.getItem("kiosAccounts")) || {};
        if (registeredKios[user] === pass) {
            isValid = true;
            redirectPage = "pengambilan.html";
        }
    } else if (role === 'pegawai' || role === 'pemerintah') {
        
        if (FIXED_CREDENTIALS[role] && user.toLowerCase() === role && FIXED_CREDENTIALS[role] === pass) {
            isValid = true;
            if (role === 'pegawai' || role === 'pemerintah') {
                redirectPage = "Datapetani.html";
            }
        }
    } else {
        loginMsg.textContent = "Peran login tidak valid.";
        console.warn("Invalid role specified in URL or unhandled role.");
        return; 
    }

    if (isValid) {
        setAuth(role, user);
        sessionStorage.removeItem('tempRole');
        alert(`Login berhasil sebagai ${role.charAt(0).toUpperCase() + role.slice(1)}!`);
        window.location.href = redirectPage;
    } else {
        loginMsg.textContent = "Username atau password salah.";
    }
}

function registerKios() {
    const username = document.getElementById('kiosUsername').value.trim();
    const password = document.getElementById('kiosPassword').value.trim();
    const confirmPassword = document.getElementById('confirmKiosPassword').value.trim();
    const registerMessage = document.getElementById('registerMessage');

    if (!username || !password || !confirmPassword) {
        registerMessage.textContent = 'Mohon lengkapi semua bidang.';
        registerMessage.style.color = 'red';
        return;
    }

    if (password !== confirmPassword) {
        registerMessage.textContent = 'Konfirmasi password tidak cocok.';
        registerMessage.style.color = 'red';
        return;
    }

    if (password.length < 6) { 
        registerMessage.textContent = 'Password minimal 6 karakter.';
        registerMessage.style.color = 'red';
        return;
    }

    let currentKiosAccounts = JSON.parse(localStorage.getItem('kiosAccounts')) || {};
    if (currentKiosAccounts[username]) {
        registerMessage.textContent = 'Username ini sudah terdaftar.';
        registerMessage.style.color = 'red';
        return;
    }

    currentKiosAccounts[username] = password;
    localStorage.setItem('kiosAccounts', JSON.stringify(currentKiosAccounts));
    registerMessage.textContent = 'Pendaftaran kios berhasil! Silakan login.';
    registerMessage.style.color = 'green';
    document.getElementById('registerKiosForm').reset();
    setTimeout(() => {
        window.location.href = 'login.html?role=kios'; 
    }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
    
    kiosAccounts = JSON.parse(localStorage.getItem('kiosAccounts')) || {};

    
    
    updateLogoutButtonVisibility();

    
    const logoutButtonIndex = document.getElementById("logoutButton");
    if (logoutButtonIndex) {
        logoutButtonIndex.addEventListener("click", () => {
            logout();
        });
    }

    
    const currentPage = window.location.pathname.split('/').pop();
    
    checkAccess([]); 

    

    
    if (currentPage === 'login.html') {
        displayLoginUI();
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                validateLogin();
            });
        }
    }

    
    if (currentPage === 'register-kios.html') {
        const registerKiosForm = document.getElementById('registerKiosForm');
        if (registerKiosForm) {
            registerKiosForm.addEventListener('submit', (e) => {
                e.preventDefault();
                registerKios();
            });
        }
    }

    
    if (currentPage === 'register.html') {
        initMap(); 
        
        const autocompleteInput = document.getElementById('autocomplete');
        if (autocompleteInput) {
            autocompleteInput.addEventListener('input', searchVillage);
            const searchVillageButton = document.querySelector('button[onclick="searchVillage()"]');
            if (searchVillageButton) {
                searchVillageButton.addEventListener('click', () => {
                    clearTimeout(searchVillageTimeout);
                    searchVillage(); 
                });
            }
        }
        
        
        const villageInputOnLoad = document.getElementById('village');
        const districtInputOnLoad = document.getElementById('district');
        if (villageInputOnLoad) {
            villageInputOnLoad.value = '';
            villageInputOnLoad.removeAttribute('readonly'); 
        }
        if (districtInputOnLoad) {
            districtInputOnLoad.value = '';
            districtInputOnLoad.removeAttribute('readonly'); 
        }

        const farmerRegistrationForm = document.getElementById('farmerRegistrationForm');
        if (farmerRegistrationForm) {
            farmerRegistrationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                submitForm();
            });
        }
        const calculateFertilizerButton = document.querySelector('button[onclick="calculateFertilizer()"]');
        if (calculateFertilizerButton) {
            calculateFertilizerButton.addEventListener('click', calculateFertilizer);
        }
    }

    
    if (currentPage === 'Datapetani.html') {
        displayFarmers();
    }

    
    if (currentPage === 'pengambilan.html') {
        const searchKtpButton = document.getElementById('searchKtp'); 
        const submitPengambilanButton = document.getElementById('submitPengambilan'); 
        if (searchKtpButton) {
            searchKtpButton.addEventListener('click', searchAndDisplayJatah);
        }
        if (submitPengambilanButton) {
            submitPengambilanButton.addEventListener('click', (e) => {
                e.preventDefault(); 
                submitPengambilan();
            });
        }
        setupImagePreview(); 
    }
    
    
    if (currentPage === 'riwayat.html') {
        displayRiwayatPengambilan();
    }

    
    if (currentPage === 'beranda.html') {
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.carousel-img'); 
        const totalSlides = slides.length;
        let currentIndex = 0;

        const setTransform = () => { if(track) track.style.transform = `translateX(${-currentIndex * 100}%)`; };
        const nextSlide = () => { currentIndex = (currentIndex + 1) % totalSlides; setTransform(); };
        const prevSlide = () => { currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; setTransform(); };
        const startAutoPlay = () => { 
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 3000); 
        };
        const stopAutoPlay = () => { clearInterval(autoPlayInterval); };

        if (track && totalSlides > 0) {
            startAutoPlay();
            track.addEventListener('touchstart', stopAutoPlay);
            track.addEventListener('touchend', startAutoPlay);
        } else if (track && totalSlides === 0) {
             console.warn("Carousel track ditemukan, tapi tidak ada gambar. Carousel tidak akan berfungsi.");
        }

        
        fetch('berita.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const container = document.getElementById('berita-container');
                if (container) {
                    container.innerHTML = '';
                    data.forEach(item => {
                        const article = document.createElement('article');
                        article.classList.add('berita-item');
                        article.innerHTML = `
                            <h3>${item.judul}</h3>
                            <p>${item.ringkasan}</p>
                            <a href="${item.link}" target="_blank">Baca Selengkapnya</a>
                        `;
                        container.appendChild(article);
                    });
                }
            })
            .catch(error => {
                console.error('Gagal memuat berita:', error);
                const container = document.getElementById('berita-container');
                if (container) container.innerHTML = `<p style="color:red;">Gagal memuat berita. ${error.message}</p>`;
            });

        
        const testimoniList = document.getElementById('testimoni-list');
        const formTestimoni = document.getElementById('form-testimoni');

        function tampilkanTestimoni() {
            if (!testimoniList) return;
            testimoniList.innerHTML = '';
            const testimoniArray = JSON.parse(localStorage.getItem('testimoni')) || [];
            if (testimoniArray.length === 0) {
                testimoniList.innerHTML = `<p style="text-align:center; color:#336600; font-style:normal;">Belum ada testimoni, jadi yang pertama yuk!</p>`;
                return;
            }
            testimoniArray.forEach(t => {
                const div = document.createElement('div');
                div.classList.add('testimoni-item');
                div.innerHTML = `<p>"${t.pesan}"</p><footer>– ${t.nama}</footer>`;
                testimoniList.appendChild(div);
            });
        }

        if (testimoniList) {
            tampilkanTestimoni();
        }

        if (formTestimoni) {
            formTestimoni.addEventListener('submit', e => {
                e.preventDefault();
                const nama = formTestimoni.nama.value.trim();
                const pesan = formTestimoni.pesan.value.trim();
                if (nama && pesan) {
                    const testimoniArray = JSON.parse(localStorage.getItem('testimoni')) || [];
                    testimoniArray.push({ nama, pesan, tanggal: new Date().toLocaleString() });
                    localStorage.setItem('testimoni', JSON.stringify(testimoniArray));
                    formTestimoni.reset();
                    tampilkanTestimoni();
                    alert('Terima kasih atas testimoninya!');
                } else {
                    alert('Nama dan pesan testimoni tidak boleh kosong.');
                }
            });
        }
    }
}); 