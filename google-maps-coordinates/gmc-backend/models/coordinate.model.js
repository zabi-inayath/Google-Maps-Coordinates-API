const db = require('../config/db');

class Coordinate {
    static async create({ mapUrl, latitude, longitude }) {
        const [result] = await db.execute(
            'INSERT INTO coordinates (map_url, latitude, longitude) VALUES (?, ?, ?)',
            [mapUrl, latitude, longitude]
        );
        return result.insertId;
    }

    static async findByUrl(mapUrl) {
        const [rows] = await db.execute(
            'SELECT * FROM coordinates WHERE map_url = ?',
            [mapUrl]
        );
        return rows[0];
    }
}

module.exports = Coordinate;