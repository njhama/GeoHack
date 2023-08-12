const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

// Serve static files (if needed)
app.use(require('koa-static')(__dirname + '/public'));

// Set up Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (data) => {
    console.log('Received message:', data);
    io.emit('message', data); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = process.env.PORT || 3003;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const puppeteer = require('puppeteer')
//chromium instance
const url = "https://www.geoguessr.com/signin";
let lastLat = 0;
let lastLong = 0;
async function start() {
    await puppeteer
        .launch({
            headless: false,
            ignoreDefaultArgs: ["--disable-extensions", "--enable-automation",],
            defaultViewport: null
        })
        .then(async (browser) => {
            const page = await browser.newPage();

            await page.setViewport({
                width: 1000,
                height: 1000
            });

            page.on("response", async (response) => {
                if (response.url().includes("GeoPhotoService")) {
                    const location = await response.text();
                    let intlong = location.indexOf("[[null,null");
                    const longlat = location.substring(intlong + 12, intlong + 44);
                    let lat = longlat.substring(0, longlat.indexOf(",") - 1);
                    let long = longlat.substring(longlat.indexOf(",") + 1, longlat.length - 1);

                    if (Math.round(lat) !== lastLat && Math.round(long) !== lastLong) {
                        lastLat = Math.round(lat);
                        lastLong = Math.round(long);
                        let newDate = new Date().toLocaleTimeString();
                        io.emit("coords", `${long},${lat}`);
                        console.log(`[${newDate}] Latitude: ${lat} Longitude: ${long}`);
                    }
                }
            });

            await page.goto(url, {
                waitUntil: "load",
                timeout: 0
            });
        });
}
start()