import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, []); // Empty dependency array to run only once on mount

  return <>{children}</>;
};

export default AuthInitializer;
