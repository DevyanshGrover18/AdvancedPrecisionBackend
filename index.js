import express from 'express';
import cors from 'cors';
import './config/env.js';
import './config/mongo.js'
import productRoutes from './routes/product.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())



app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is working fine'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log('Server started at port:', PORT);
});
