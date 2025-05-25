import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { StytchProvider, useStytch } from '@stytch/react';
import { StytchUIClient } from '@stytch/vanilla-js';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const stytchClient = new StytchUIClient(import.meta.env.VITE_STYTCH_PUBLIC_TOKEN);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhoneAuthForm = ({ onClose }: { onClose: () => void }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [methodId, setMethodId] = useState('');
  const stytch = useStytch();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await stytch.otps.sms.send(phoneNumber, {
        expiration_minutes: 10,
      });

      if (response.method_id) {
        setMethodId(response.method_id);
        setIsVerifying(true);
        toast.success('Verification code sent!');
      } else {
        throw new Error('No method_id received');
      }
    } catch (error) {
      toast.error('Failed to send verification code');
      console.error('Error sending code:', error);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!methodId) {
      toast.error('Invalid verification session');
      return;
    }

    try {
      const response = await stytch.otps.authenticate(methodId, code, { session_duration_minutes: 60 });

      // Sign in to Supabase with the Stytch token
      const { error: supabaseError } = await supabase.auth.signInWithIdToken({
        provider: 'stytch',
        token: response.session_token,
      });

      if (supabaseError) throw supabaseError;

      toast.success('Successfully signed in!');
      onClose();
    } catch (error) {
      toast.error('Failed to verify code');
      console.error('Error verifying code:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
          <Phone size={24} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Sign In</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isVerifying ? 'Enter the code sent to your phone' : 'Enter your phone number to get started'}
        </p>
      </div>

      {!isVerifying ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 555-5555"
              className="input w-full"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Send Code
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="input w-full"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Verify Code
          </button>
          <button
            type="button"
            onClick={() => setIsVerifying(false)}
            className="btn btn-outline w-full"
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
};

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
        <StytchProvider stytch={stytchClient}>
          <PhoneAuthForm onClose={onClose} />
        </StytchProvider>
      </div>
    </div>
  );
};