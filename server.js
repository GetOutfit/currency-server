const { app, initPromise } = require('./app');

const PORT = process.env.PORT || 32118;

// Wait for initialization before starting server
initPromise.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Failed to initialize server:', error);
    process.exit(1);
});