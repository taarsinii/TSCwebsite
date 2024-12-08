const dbConfig = {
    user: 'SA',
    password: 'C0mp2001!',
    database: 'TSChotelDB',
    server: 'localhost',
    options: {
        encrypt: true, // Set to true if you're using Azure
        trustServerCertificate: true,
    },
};

module.exports = dbConfig;
