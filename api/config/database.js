const mongoose = require('mongoose');

(async () => {
    
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
})();