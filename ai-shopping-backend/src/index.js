"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 🔁 Health check route
app.get('/', (_req, res) => {
    res.send('✅ API is running!');
});
// ✅ (Optional) Test search route for now
app.get('/search', (req, res) => {
    const query = req.query.q || '';
    res.json({
        message: 'Mock search results',
        query,
        results: [
            { name: 'iPhone 13', price: 58999, site: 'Amazon' },
            { name: 'iPhone 13', price: 59999, site: 'Flipkart' },
        ]
    });
});
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
});
