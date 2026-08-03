import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthProvider } from './auth/authContext';
import { AppRouter } from './routes/Router';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
