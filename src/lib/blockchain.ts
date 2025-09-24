// Blockchain Verification System for Jharkhand Tourism
import { supabase } from './supabase';

export interface BlockchainRecord {
  id: string;
  type: 'guide' | 'product' | 'booking' | 'artisan';
  data: any;
  hash: string;
  previousHash: string;
  timestamp: number;
  verified: boolean;
}

export interface GuideVerification {
  guideId: string;
  name: string;
  location: string;
  certifications: string[];
  govtId: string;
  status: 'verified' | 'pending' | 'rejected';
  qrCode: string;
}

export interface ProductAuthenticity {
  productId: string;
  artisanName: string;
  productName: string;
  location: string;
  craftType: string;
  authenticityCertificate: string;
  qrCode: string;
}

export interface BookingRecord {
  bookingId: string;
  touristId: string;
  serviceType: 'guide' | 'homestay' | 'experience';
  serviceId: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  timestamp: number;
  hash: string;
}

class BlockchainService {
  private static instance: BlockchainService;
  private chain: BlockchainRecord[] = [];

  private constructor() {
    this.initializeChain();
  }

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  private initializeChain() {
    // Genesis block
    const genesisBlock: BlockchainRecord = {
      id: 'genesis',
      type: 'guide',
      data: { message: 'Jharkhand Tourism Blockchain Genesis Block' },
      hash: this.calculateHash('genesis', {}, '', Date.now()),
      previousHash: '0',
      timestamp: Date.now(),
      verified: true
    };
    this.chain.push(genesisBlock);
  }

  private calculateHash(id: string, data: any, previousHash: string, timestamp: number): string {
    const content = JSON.stringify({ id, data, previousHash, timestamp });
    // Simple hash function (in production, use SHA-256)
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Guide Verification Methods
  async registerGuide(guideData: GuideVerification): Promise<string> {
    try {
      const qrCode = `GUIDE_${guideData.guideId}_${Date.now()}`;
      const blockData = {
        ...guideData,
        qrCode,
        registeredAt: Date.now()
      };

      const previousBlock = this.chain[this.chain.length - 1];
      const newBlock: BlockchainRecord = {
        id: `guide_${guideData.guideId}`,
        type: 'guide',
        data: blockData,
        hash: this.calculateHash(`guide_${guideData.guideId}`, blockData, previousBlock.hash, Date.now()),
        previousHash: previousBlock.hash,
        timestamp: Date.now(),
        verified: true
      };

      this.chain.push(newBlock);

      // Save to database
      await supabase.from('blockchain_records').insert({
        record_id: newBlock.id,
        record_type: newBlock.type,
        record_data: newBlock.data,
        hash: newBlock.hash,
        previous_hash: newBlock.previousHash,
        timestamp: new Date(newBlock.timestamp).toISOString(),
        verified: newBlock.verified
      });

      return qrCode;
    } catch (error) {
      console.error('Error registering guide:', error);
      throw error;
    }
  }

  async verifyGuide(qrCode: string): Promise<GuideVerification | null> {
    try {
      const { data, error } = await supabase
        .from('blockchain_records')
        .select('*')
        .eq('record_type', 'guide')
        .contains('record_data', { qrCode });

      if (error || !data || data.length === 0) {
        return null;
      }

      const record = data[0];
      return {
        ...record.record_data,
        verified: record.verified
      };
    } catch (error) {
      console.error('Error verifying guide:', error);
      return null;
    }
  }

  // Product Authenticity Methods
  async registerProduct(productData: ProductAuthenticity): Promise<string> {
    try {
      const qrCode = `PRODUCT_${productData.productId}_${Date.now()}`;
      const blockData = {
        ...productData,
        qrCode,
        registeredAt: Date.now()
      };

      const previousBlock = this.chain[this.chain.length - 1];
      const newBlock: BlockchainRecord = {
        id: `product_${productData.productId}`,
        type: 'product',
        data: blockData,
        hash: this.calculateHash(`product_${productData.productId}`, blockData, previousBlock.hash, Date.now()),
        previousHash: previousBlock.hash,
        timestamp: Date.now(),
        verified: true
      };

      this.chain.push(newBlock);

      // Save to database
      await supabase.from('blockchain_records').insert({
        record_id: newBlock.id,
        record_type: newBlock.type,
        record_data: newBlock.data,
        hash: newBlock.hash,
        previous_hash: newBlock.previousHash,
        timestamp: new Date(newBlock.timestamp).toISOString(),
        verified: newBlock.verified
      });

      return qrCode;
    } catch (error) {
      console.error('Error registering product:', error);
      throw error;
    }
  }

  async verifyProduct(qrCode: string): Promise<ProductAuthenticity | null> {
    try {
      const { data, error } = await supabase
        .from('blockchain_records')
        .select('*')
        .eq('record_type', 'product')
        .contains('record_data', { qrCode });

      if (error || !data || data.length === 0) {
        return null;
      }

      const record = data[0];
      return {
        ...record.record_data,
        verified: record.verified
      };
    } catch (error) {
      console.error('Error verifying product:', error);
      return null;
    }
  }

  // Booking Record Methods
  async recordBooking(bookingData: Omit<BookingRecord, 'hash'>): Promise<string> {
    try {
      const previousBlock = this.chain[this.chain.length - 1];
      const hash = this.calculateHash(`booking_${bookingData.bookingId}`, bookingData, previousBlock.hash, Date.now());
      
      const completeBookingData = {
        ...bookingData,
        hash
      };

      const newBlock: BlockchainRecord = {
        id: `booking_${bookingData.bookingId}`,
        type: 'booking',
        data: completeBookingData,
        hash,
        previousHash: previousBlock.hash,
        timestamp: Date.now(),
        verified: true
      };

      this.chain.push(newBlock);

      // Save to database
      await supabase.from('blockchain_records').insert({
        record_id: newBlock.id,
        record_type: newBlock.type,
        record_data: newBlock.data,
        hash: newBlock.hash,
        previous_hash: newBlock.previousHash,
        timestamp: new Date(newBlock.timestamp).toISOString(),
        verified: newBlock.verified
      });

      return hash;
    } catch (error) {
      console.error('Error recording booking:', error);
      throw error;
    }
  }

  async verifyBooking(bookingId: string): Promise<BookingRecord | null> {
    try {
      const { data, error } = await supabase
        .from('blockchain_records')
        .select('*')
        .eq('record_type', 'booking')
        .eq('record_id', `booking_${bookingId}`);

      if (error || !data || data.length === 0) {
        return null;
      }

      const record = data[0];
      return record.record_data;
    } catch (error) {
      console.error('Error verifying booking:', error);
      return null;
    }
  }

  // Chain Validation
  validateChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      const recalculatedHash = this.calculateHash(
        currentBlock.id,
        currentBlock.data,
        currentBlock.previousHash,
        currentBlock.timestamp
      );

      if (currentBlock.hash !== recalculatedHash) {
        return false;
      }
    }
    return true;
  }

  // Analytics for Government Dashboard
  async getBlockchainAnalytics() {
    try {
      const { data, error } = await supabase
        .from('blockchain_records')
        .select('record_type, verified, timestamp');

      if (error) throw error;

      const analytics = {
        totalRecords: data.length,
        verifiedGuides: data.filter(r => r.record_type === 'guide' && r.verified).length,
        authenticProducts: data.filter(r => r.record_type === 'product' && r.verified).length,
        totalBookings: data.filter(r => r.record_type === 'booking').length,
        recordsByType: {
          guides: data.filter(r => r.record_type === 'guide').length,
          products: data.filter(r => r.record_type === 'product').length,
          bookings: data.filter(r => r.record_type === 'booking').length,
          artisans: data.filter(r => r.record_type === 'artisan').length
        },
        chainIntegrity: this.validateChain()
      };

      return analytics;
    } catch (error) {
      console.error('Error getting blockchain analytics:', error);
      throw error;
    }
  }
}

export const blockchainService = BlockchainService.getInstance();