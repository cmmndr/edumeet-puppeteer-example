const { WaitTask } = require("puppeteer");
const puppeteer = require("puppeteer");

// Konfigurationsparameter
const NUM_PARTICIPANTS = 1;  // Anzahl der simulierten Teilnehmer
const CONFERENCE_URL = 'https://meet-dev.conf.dfn.de/constantin';
const TEST_DURATION = 10 * 60 * 1000;  // Testdauer in Millisekunden (10 Minuten)
const RAMP_UP_INTERVAL = 5000;  // Zeit zwischen dem Start jedes Teilnehmers (5 Sekunden)

const participantSession = async (videoFileNumber) => {
    vfn = videoFileNumber + '.mjpeg'
    try {
        const browser = await puppeteer.launch({headless: false,                
                args: [
                    '--use-fake-ui-for-media-stream', // Erlaubt automatische Kamerazugriffe
                    //'--use-gl=desktop',
                    //'--use-gl=angle', '--use-angle=gl-egl',  
                    '--enable-gpu', // benutzt die richtige Hardwarebeschleuniggung
                    '--use-fake-device-for-media-stream',  // Simuliert Kamera/Mikrofon
                    `--use-file-for-fake-video-capture=${vfn}`, // Verwende unterschiedliche Kamera, Kosmetik...               
                    '--disable-web-security',
                    '--enable-features=VaapiVideoEncoder,VaapiVideoDecoder',
                    '--ignore-gpu-blocklist',  // Kann für manche WebRTC-Apps nötig sein
                    '--disable-features=UseChromeOSDirectVideoDecoder',
                    /*'--disable-accelerated-video-decode',  // 
                    '--disable-accelerated-video-encode',  // 
                    '--disable-webrtc-hw-decoding',         // 
                    '--disable-webrtc-hw-encoding',         // */
                    `--window-size=1280,720`  // Kleinere Fenster, um Ressourcen zu sparen
                ]
        })
        const page = await browser.newPage(); 
        await page.goto(CONFERENCE_URL)
        await page.locator('button.css-1uuijbe').click();
        await page.locator('button.css-1nynoeo').click();
        console.log(`Teilnehmer Nummer ${videoFileNumber} ist beigetreten.`)
    } catch (error) {
        console.log(error)
    }
};


// Mainfunktion zum Ausfuehren der Tests

async function runLoadTests() {
    const browsers = [];

    for (let index = 1; index < NUM_PARTICIPANTS+1; index++) {
        const browser = participantSession(index);
        browsers.push(browser);
        console.log(`Teilnehmer ${index} wird gestartet...`);

        await new Promise(r => setTimeout(r, RAMP_UP_INTERVAL));
        
        
    }
    await Promise.all(browsers);
}

runLoadTests().catch(console.error);
