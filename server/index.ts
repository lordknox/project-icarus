import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { setupRoutes} from './routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// app.use(cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:5173',
//     credentials: true,
// }));
app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    // 'https://project-icarus-q5au.onrender.com',
    'https://project-icarus-five.vercel.app',
  ],
  credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://project-icarus-five.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  return res.sendStatus(200);
});

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'icarus-secret-key-change-in-production',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 *24 * 7,
        },
    })
);
//health check endpoint
app.get('/health',(req,res)=> {
    res.json({
        status: 'OK',
        timestamp : new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// root endpoint
app.get('/',(req,res)=> {
    res.json({
        message: 'Icarus API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            sites: '/api/renewable-sites',
            windResources: '/api/wind-resources',
            solarResources: '/api/solar-resources',
            gridInfrastucture: '/api/grid-infrastructure',
            demandCenters: '/api/demand-centers',
            aiSuggestions: '/api/ai-suggestions',
            dashboard: '/api/dashboard',
        }
    });
});
// setup routes
setupRoutes(app);
//error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack})
    });
});
//404 handler
app.use((req,res)=> {
    res.status(404).json({ error: 'Not Found'});
});
//start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║   🌞 Icarus API Server                          ║
║                                                ║
║   Status: Running                              ║
║   Port: ${PORT}                                   ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║   URL: http://localhost:${PORT}                   ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
});

export default app;