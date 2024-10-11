const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Error getting location:", error);
            showError(error);
            // Fallback location in case of geolocation error
            const fallbackLatitude = 37.7749;  // Example: San Francisco
            const fallbackLongitude = -122.4194;
            socket.emit("send-location", { latitude: fallbackLatitude, longitude: fallbackLongitude });
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
} else {
    alert("Geolocation is not supported by this browser.");
}

// Initialize map
const map = L.map("map").setView([0, 0], 16); // Initial world view
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Adarsh",
}).addTo(map);

const markers = {};  // Dictionary to store markers by socket.id

// Handle receiving location from server
socket.on("recieve-location", (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        // If the marker already exists, update its position
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // If it's a new user, create a new marker and add it to the map
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }

    map.setView([latitude, longitude]); // Optionally, center the map on the latest position
});

// Handle receiving existing users' locations when a new user connects
socket.on("existing-locations", (users) => {
    // Iterate over all existing users and add their markers to the map
    for (const id in users) {
        const { latitude, longitude } = users[id];
        if (!markers[id]) {
            markers[id] = L.marker([latitude, longitude]).addTo(map);
        }
    }
});

// Handle user disconnection and remove their marker from the map
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];  // Remove the marker from the dictionary
    }
});

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        default:
            alert("An unknown error occurred.");
            break;
    }
}
