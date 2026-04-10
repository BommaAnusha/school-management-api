import {getDB} from "./connectDB.js";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};


export const addSchool = async (req, res) => {
  try {
    const db = getDB();
    console.log(req.body);
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || latitude == null || longitude == null) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: "Latitude & Longitude must be numbers" });
    }

    const [existing] = await db.execute("SELECT id FROM schools WHERE name = ? AND address = ?",[name, address]);

    if (existing.length > 0) {
        return res.status(409).json({
        error: "School already exists"
    });
}

    const sql = `
      INSERT INTO schools (name, address, latitude, longitude)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [name, address, latitude, longitude]);
    console.log(result.insertId)
    res.status(200).json({
      message: "School added successfully",
      schoolId: result.insertId
    });

  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
};

export const getSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const db = getDB();
    const [schools] = await db.execute("SELECT * FROM schools");

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "User location required", schools });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const sortedSchools = schools.map(school => {
      const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
      return { ...school, distance };
    });

    sortedSchools.sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};