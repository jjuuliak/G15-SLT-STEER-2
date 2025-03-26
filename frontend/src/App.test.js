import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LogIn from './pages/LogIn';

// Create a mock Redux store
const mockStore = configureStore([]);

test('renders login page when user is not authenticated', () => {
  const store = mockStore({
    auth: { isAuthenticated: false }, // Simulate logged-out state
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/login"]}>
        <LogIn />
      </MemoryRouter>
    </Provider>
  );

  screen.debug();

  expect(screen.getByText(/loginNow/i)).toBeInTheDocument(); // Adjust based on Login page content
});
