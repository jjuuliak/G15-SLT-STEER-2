export const handleLogin = async (username, password) => {
    if (!username || !password) {
        throw new Error('Please enter username and password');
    }

    try {
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: username, password: password }),
        });

        if (response.ok) {
            const data = await response.json();
            const { access_token, user_data } = data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user_data', user_data);
            return { success: true };
        } else {
            throw new Error('Invalid login credentials');
        }
    } catch (error) {
        throw new Error('An error occurred during login');
    }
};