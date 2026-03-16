const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('BROWSER CONSOLE ERROR:', msg.text());
            }
        });

        page.on('pageerror', err => {
            console.log('BROWSER PAGE ERROR:', err.toString());
        });

        await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
        
        console.log('Evaluated page.');
        await browser.close();
    } catch (e) {
        console.error('Puppeteer Script Error:', e);
    }
})();
