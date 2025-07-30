const axios = require('axios');
const Coordinate = require('../models/coordinate.model');

async function extractCoordinatesFromUrl(mapUrl) {
    try {
        // Follow redirects to get the final URL
        const response = await axios.get(mapUrl, {
            maxRedirects: 5,
            validateStatus: null
        });

        const finalUrl = response.request.res.responseUrl || mapUrl;

        // Extract coordinates from the URL
        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = finalUrl.match(regex);

        if (!match) {
            throw new Error('Coordinates not found in URL');
        }

        return {
            latitude: parseFloat(match[1]),
            longitude: parseFloat(match[2])
        };
    } catch (error) {
        throw new Error(`Failed to extract coordinates: ${error.message}`);
    }
}

exports.getCoordinates = async (req, res) => {
    try {
        const { mapUrl } = req.body;

        if (!mapUrl) {
            return res.status(400).json({ error: 'Map URL is required' });
        }

        // Check if we already have this URL in database
        const existing = await Coordinate.findByUrl(mapUrl);
        if (existing) {
            return res.json({
                latitude: existing.latitude,
                longitude: existing.longitude,
                fromCache: true
            });
        }

        // Extract coordinates
        const { latitude, longitude } = await extractCoordinatesFromUrl(mapUrl);

        // Store in database
        await Coordinate.create({ mapUrl, latitude, longitude });

        res.json({ latitude, longitude, fromCache: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};