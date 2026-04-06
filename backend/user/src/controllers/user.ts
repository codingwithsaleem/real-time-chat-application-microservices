

export const loginUser = async (req: any, res: any) => {
    try {
        const { email } = req.body;
        // Add your login logic here
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
    }
    catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};