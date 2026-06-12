import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { Card } from '../components/Card';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Use the VITE_GOOGLE_CLIENT_ID from environment variables
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      toast.error('Google login failed. No credential received.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.adminGoogleLogin(credentialResponse.credential);
      if (response.success && response.token && response.user) {
        login(response.token, response.user);
        toast.success('Admin login successful!');
        navigate('/admin');
      } else {
        toast.error(response.message || 'Admin login failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Admin login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <KeyRound size={32} className="text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">🔐 Admin Console</h1>
            <p className="text-grey-light">SK Buildings Administration</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6">
            <p className="text-grey-light text-center">
              Please sign in with your authorized admin Google account to access the dashboard.
            </p>
            
            {isLoading ? (
              <div className="text-primary font-bold">Verifying Google Login...</div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error('Google Login Failed');
                }}
                useOneTap
                theme="filled_black"
                shape="pill"
                size="large"
              />
            )}
          </div>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
};
