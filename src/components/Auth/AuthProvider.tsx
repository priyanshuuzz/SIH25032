import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { AuthService, UserWithRole } from '../../lib/auth';

interface AuthContextType {
  user: UserWithRole | null;
  session: Session | null;
  userRole: string;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const userWithRole = await AuthService.getCurrentUserWithRole();
      setUser(userWithRole);
      setUserRole(userWithRole?.role || 'user');
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      setUserRole('user');
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      
      if (session?.user) {
        // For OAuth users, create profile if it doesn't exist
        if (event === 'SIGNED_IN' && session.user.app_metadata?.provider) {
          await AuthService.createUserProfile(session.user, {
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
            phone: session.user.user_metadata?.phone || '',
            role: 'user'
          });
          await AuthService.assignUserRole(session.user.id, 'user');
        }
        
        await refreshUser();
      } else {
        setUser(null);
        setUserRole('user');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setSession(null);
      setUserRole('user');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}