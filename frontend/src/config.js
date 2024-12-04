const config = {
    API_URL: process.env.NODE_ENV === 'production' 
        ? '' // Empty string means same origin
        : 'http://localhost:5431'
};

export default config;