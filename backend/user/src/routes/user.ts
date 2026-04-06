import express from 'express';


const userRoutes = express.Router();

// Define your user routes here
userRoutes.get('/', (req, res) => {
    res.send('User service is up and running!');
});

export default userRoutes;