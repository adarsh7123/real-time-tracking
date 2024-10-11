


## Real-Time Tracking Application

A real-time tracking application that allows multiple devices to share their location using **Socket.io** and **Leaflet.js**. The application tracks users' locations and displays them on a map in real-time.

## Features

- Real-time tracking of locations for multiple devices (Mobile & Laptop).
- Dynamic updating of markers when a new device connects or moves.
- Broadcasts the location of all devices to other connected clients.
- Allows users to disconnect and removes their marker from the map.
- Customizable fallback location if geolocation is unavailable.

## Tech Stack

- **Frontend**: 
  - **HTML/CSS/JavaScript**
  - **Leaflet.js**: For displaying and updating maps in real-time.
  - **Socket.io (Client-side)**: For real-time communication between server and clients.
  
- **Backend**:
  - **Node.js**: For the server-side implementation.
  - **Express.js**: Web server to serve static files and handle HTTP requests.
  - **Socket.io (Server-side)**: For real-time communication.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) (Node package manager)

## Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the application
```bash
npm start
```

The application will be hosted at `http://localhost:3000`. You can open this URL on your laptop and mobile browser to test real-time tracking.

### 4. Test on multiple devices
- Open the application in your laptop and mobile browser.
- You will see your location on the map. Any movement of the devices will be broadcasted in real-time across all devices.

## How it works

1. **Client-side**:
    - The app uses `navigator.geolocation.watchPosition` to retrieve the user's current location.
    - When a user’s location changes, it emits the new location data via `socket.emit("send-location", {latitude, longitude})`.
    - When a new user connects, their location is broadcasted to all connected clients via `io.emit("recieve-location", {id, latitude, longitude})`.
  
2. **Server-side**:
    - The server listens to `send-location` events from clients and stores the user's location using `socket.id`.
    - It broadcasts the location to all other connected clients using `io.emit("recieve-location", ...)`.
    - If a user disconnects, their location is removed from the map by emitting the `user-disconnected` event.

## Screenshots

![Desktop Screenshot](/desktop%20ss%201.png)
![Desktop Screenshot](/desktop%20ss%202.png)
![Mobile Screenshot](/mobile_ss_1.jpg)
![Mobile Screenshot](/mobile_ss_2.jpg)

## Known Issues

- If the mobile device doesn't prompt for location permission, ensure location services are enabled on the device.
- Ensure the page is served over HTTPS for mobile devices to request geolocation access.

## Troubleshooting

### "User denied the request for Geolocation" Error
- Make sure location services are enabled on the mobile device.
- Ensure that the browser has permission to access the location (check browser settings).

### "Location information is unavailable" Error
- This can occur if the browser is unable to retrieve the device's location. Check if the device has a working GPS or try a fallback location.

### "Socket.io not working" Error
- Verify that both the client and server are correctly set up and connected to the same network. Refresh the page and check the console for any errors.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Leaflet.js](https://leafletjs.com/)
- [Socket.io](https://socket.io/)


