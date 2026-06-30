const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// 1. Load the real JSON database file exported by your teammate
const jsonFilePath = path.join(__dirname, 'groceries.goods.json');
let rawData = [];

try {
    const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
    rawData = JSON.parse(fileContent);
    console.log(`🚀 Real Database File Loaded! Total items: ${rawData.length}`);
} catch (error) {
    console.error("❌ Failed to read groceries.goods.json:", error);
}

// 2. Map and normalize data fields to fit perfectly with React Frontend expectations
const foodList = rawData.map((item, index) => {
    // Safely extract the MongoDB unique hex string from the nested $oid object
    let extractedId = String(index);
    if (item._id && item._id.$oid) {
        extractedId = String(item._id.$oid);
    }

    // FIXED: Safely extract price from MongoDB $numberDouble object structure if it exists
    let extractedPrice = 0;
    if (item.price !== undefined && item.price !== null) {
        if (typeof item.price === 'object' && item.price.$numberDouble !== undefined) {
            extractedPrice = Number(item.price.$numberDouble);
        } else {
            extractedPrice = Number(item.price);
        }
    }

    return {
        _id: extractedId, // Normalized unique key string for React virtual DOM
        name: item.name || "Unnamed Product",
        price: extractedPrice, // Guaranteed to be a pure Javascript number now!
        description: item.description || "Fresh premium product directly from source.",
        category: item.category || "General",
        image: item.imgUrl || "https://dummyimage.com/600x700/dee2e6/6c757d.jpg",
        market: index % 2 === 0 ? "Market 1" : "Market 2"
    };
});

// 3. REST API Endpoint: Fetch all standard products
app.get('/api/foods', (req, res) => {
    res.status(200).json(foodList);
});

// 4. REST API Endpoint: Fetch specific product parameters by unique _id string
app.get('/api/foods/:id', (req, res) => {
    const foodId = req.params.id;
    const foodItem = foodList.find(item => item._id === foodId);

    if (foodItem) {
        res.status(200).json(foodItem);
    } else {
        res.status(404).json({ message: "Requested product catalog item not found." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server fully synchronized with database data at http://localhost:${PORT}`);
});