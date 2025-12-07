import { describe, it, expect } from 'vitest';
import * as db from './db';

describe('Address Creation', () => {
  it('should create an address and return ID', async () => {
    const testAddress = {
      userId: 1,
      recipientName: 'Test User',
      street: 'Test Street',
      number: '123',
      complement: '',
      neighborhood: 'Test Neighborhood',
      city: 'Test City',
      state: 'SP',
      zipCode: '01310-100',
      isDefault: false,
    };

    try {
      const result = await db.createAddress(testAddress);
      console.log('Result:', result);
      expect(result).toHaveProperty('id');
      expect(typeof result.id).toBe('number');
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  });
});
