// src/components/Auth.tsx
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';

const AuthContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background: #1a1d23;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const UserName = styled.span`
  color: #fff;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
`;

const AuthButton = styled.button<{ $signOut?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.$signOut ? `
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
    }
  ` : `
    background: #FFFFFF;
    color: black;
    
    &:hover {
      background: #F2F2F2;
    }
  `}

  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    width: 18px;
    height: 18px;
  }
`;

const GuestBadge = styled.span`
  color: #888;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const GoogleIcon = () => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 48 48"
    style={{ marginRight: '8px' }}
  >
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
    <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
  </svg>
);

export const Auth: React.FC = () => {
  const { user, signIn, signOut } = useAuth();

  return (
    <AuthContainer>
      {user ? (
        <>
          <UserName>
            {user.photoURL && <img src={user.photoURL} alt={user.displayName || ''} />}
            {user.displayName}
          </UserName>
          <AuthButton $signOut onClick={signOut}>
            Sign Out
          </AuthButton>
        </>
      ) : (
        <>
          <GuestBadge>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Guest
          </GuestBadge>
          <AuthButton onClick={signIn}>
            <GoogleIcon />
            Sign in with Google
          </AuthButton>
        </>
      )}
    </AuthContainer>
  );
};