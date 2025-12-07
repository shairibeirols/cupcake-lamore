import { describe, it, expect } from 'vitest';
import * as db from './db';

describe('Checkout Flow', () => {
  it('should create address and order', async () => {
    // Step 1: Create address
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

    console.log('Creating address...');
    const addressResult = await db.createAddress(testAddress);
    console.log('Address created:', addressResult);
    
    expect(addressResult).toHaveProperty('id');
    expect(typeof addressResult.id).toBe('number');
    expect(addressResult.id).toBeGreaterThan(0);

    // Step 2: Create order with the address
    const testOrder = {
      userId: 1,
      addressId: addressResult.id,
      paymentMethod: 'credit_card' as const,
      notes: 'Test order',
      subtotal: 4000,
      shippingFee: 1500,
      total: 5500,
      status: 'pending' as const,
    };

    console.log('Creating order with addressId:', addressResult.id);
    try {
      const orderResult = await db.createOrder(testOrder);
      console.log('Order created:', orderResult);
      
      expect(orderResult).toHaveProperty('id');
      expect(typeof orderResult.id).toBe('number');
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  });
});
