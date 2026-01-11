// Script to generate QR codes for existing conferences
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const dataPath = path.join(__dirname, '../data/conferences.json');

async function generateQRCode(conferenceId) {
    try {
        const url = `http://localhost:3000/conference/${conferenceId}`;
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: {
                dark: '#0F5C4A',
                light: '#F7F7F5',
            },
        });
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        return '';
    }
}

async function updateConferences() {
    try {
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const conferences = JSON.parse(fileContent);

        for (const conference of conferences) {
            if (!conference.qrCode || conference.qrCode === '') {
                console.log(`Generating QR code for: ${conference.title}`);
                conference.qrCode = await generateQRCode(conference.id);
            }
        }

        fs.writeFileSync(dataPath, JSON.stringify(conferences, null, 2), 'utf-8');
        console.log('✓ QR codes generated successfully!');
    } catch (error) {
        console.error('Error updating conferences:', error);
    }
}

updateConferences();
