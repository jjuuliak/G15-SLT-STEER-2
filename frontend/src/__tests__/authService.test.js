import { handleLogin, registerUser } from '../services/authService';



global.fetch = jest.fn();

describe('Authentication Service', () => {
  // Reset fetch mock before each test
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('handleLogin', () => {
    // Successful login
    it('should successfully login with valid credentials', async () => {
      const mockData = {
        status: 'success',
        access_token: 'mock_token',
        user_data: { user_id: 'Test User' }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData)
      });

      const result = await handleLogin('test@example.com', 'password123');
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
      });
      expect(result).toEqual(mockData);
    });

    // Failed login - invalid credentials - wrong password
    it('should throw an error with incorrect password or email', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ detail: 'Incorrect login' })
      });

      await expect(handleLogin('wrong@example.com', 'wrongpassword'))
        .rejects
        .toThrow('Invalid login credentials');
    });

    // Failed login - invalid credentials - email of wrong type (Should probably add input validation to login page and delete this)
    it('should throw an error when email is of wrong type', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 422,
            json: () => Promise.resolve({ detail: 'Schema validation failed' })
          });
      
      await expect(handleLogin('thisisnotanemail', '1234'))
        .rejects
        .toThrow('An error occurred during login');
    });

    
  });

  describe('registerUser', () => {
    // Successful registration
    it('should successfully register a new user', async () => {
      const mockFormData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      };

      const mockResponse = {
        status: 'success',
        access_token: 'mock_token',
        user_data: { user_id: '123' }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await registerUser(mockFormData);
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123'
        })
      });
      expect(result).toEqual(mockResponse);
    });

    // Failed registration - existing user
    it('should handle registration of existing user', async () => {
      const mockFormData = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123'
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ detail: 'Account exists' })
      });

      await expect(registerUser(mockFormData))
        .rejects
        .toThrow('Registration failed. Please try again.');
    });

  });

});