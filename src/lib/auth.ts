import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export interface UserRole {
  id: string;
  role_name: string;
  description: string;
  permissions: Record<string, boolean>;
}

export interface UserWithRole extends User {
  role?: string;
  permissions?: Record<string, boolean>;
}

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, userData: any) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
            role: userData.role || 'user'
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        await this.createUserProfile(data.user, userData);
        
        // Assign role
        await this.assignUserRole(data.user.id, userData.role || 'user');
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  }

  // Sign in with Google
  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { data: null, error };
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  }

  // Create user profile based on role
  static async createUserProfile(user: User, userData: any) {
    try {
      // Create basic user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          full_name: userData.full_name || user.user_metadata?.full_name || user.user_metadata?.name || '',
          phone: userData.phone || user.user_metadata?.phone || '',
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't throw error, just log it
      }

      // Create role-specific profiles
      if (userData.role === 'seller') {
        const { error: sellerError } = await supabase
          .from('seller_profiles')
          .upsert({
            user_id: user.id,
            business_name: userData.business_name || '',
            business_type: userData.business_type || 'artisan',
            business_description: userData.business_description || '',
            verification_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (sellerError) {
          console.error('Seller profile creation error:', sellerError);
        }
      }

      if (userData.role === 'gov_admin') {
        const { error: adminError } = await supabase
          .from('government_officials')
          .upsert({
            user_id: user.id,
            employee_id: userData.employee_id || '',
            department: userData.department || 'Tourism',
            designation: userData.designation || 'Officer',
            office_location: userData.office_location || '',
            verification_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (adminError) {
          console.error('Admin profile creation error:', adminError);
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Profile creation error:', error);
      return { error };
    }
  }

  // Assign role to user
  static async assignUserRole(userId: string, roleName: string) {
    try {
      // Get role
      const { data: role, error: roleError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role_name', roleName)
        .single();

      if (roleError || !role) {
        console.error('Role not found:', roleName);
        return { error: roleError };
      }

      // Assign role to user
      const { error: assignError } = await supabase
        .from('user_role_assignments')
        .upsert({
          user_id: userId,
          role_id: role.id,
          is_active: true,
          assigned_at: new Date().toISOString()
        });

      if (assignError) {
        console.error('Role assignment error:', assignError);
        return { error: assignError };
      }

      return { error: null };
    } catch (error) {
      console.error('Role assignment error:', error);
      return { error };
    }
  }

  // Get user role
  static async getUserRole(userId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('user_role_assignments')
        .select(`
          user_roles (
            role_name
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('assigned_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.log('No role found for user, defaulting to user role');
        return 'user';
      }

      return (data as any).user_roles?.role_name || 'user';
    } catch (error) {
      console.error('Get user role error:', error);
      return 'user';
    }
  }

  // Get current user with role
  static async getCurrentUserWithRole(): Promise<UserWithRole | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const role = await this.getUserRole(user.id);
      return {
        ...user,
        role
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Get default permissions for role
  static getDefaultPermissions(roleName: string): Record<string, boolean> {
    switch (roleName) {
      case 'gov_admin':
        return {
          view_analytics: true,
          manage_users: true,
          verify_sellers: true,
          manage_destinations: true,
          view_reports: true
        };
      case 'seller':
        return {
          manage_products: true,
          view_orders: true,
          manage_homestays: true,
          view_analytics: true
        };
      case 'user':
      default:
        return {
          book_services: true,
          write_reviews: true,
          view_destinations: true
        };
    }
  }
}