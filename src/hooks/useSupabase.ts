import { useState, useEffect } from 'react';
import { supabase, type Destination, type Guide, type Product, type Homestay, type CulturalExperience } from '../lib/supabase';

export function useDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .order('rating', { ascending: false });

        if (error) throw error;
        setDestinations(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, []);

  return { destinations, loading, error };
}

export function useGuides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGuides() {
      try {
        const { data, error } = await supabase
          .from('guides')
          .select('*')
          .order('rating', { ascending: false });

        if (error) throw error;
        setGuides(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchGuides();
  }, []);

  return { guides, loading, error };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('rating', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}

export function useHomestays() {
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHomestays() {
      try {
        const { data, error } = await supabase
          .from('homestays')
          .select('*')
          .order('rating', { ascending: false });

        if (error) throw error;
        setHomestays(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchHomestays();
  }, []);

  return { homestays, loading, error };
}

export function useCulturalExperiences() {
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const { data, error } = await supabase
          .from('cultural_experiences')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setExperiences(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchExperiences();
  }, []);

  return { experiences, loading, error };
}