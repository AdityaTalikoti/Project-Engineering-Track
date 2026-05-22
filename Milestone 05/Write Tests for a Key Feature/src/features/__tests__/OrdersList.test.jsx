import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import OrdersList from '../OrdersList';
import * as ordersApi from '../../api/orders';

// Mock the orders API module as required by Move 6
jest.mock('../../api/orders');

describe('OrdersList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('happy path', () => {
    // Protects against list rendering failures or failing to bind and show order names
    test("when the API returns an array of orders, each order's name is visible in the rendered list", async () => {
      const mockOrders = [
        { id: 1, name: 'Order Alpha', date: '2026-05-20', status: 'Delivered' },
        { id: 2, name: 'Order Beta', date: '2026-05-21', status: 'Processing' },
      ];
      ordersApi.fetchOrders.mockResolvedValueOnce(mockOrders);

      render(<OrdersList />);

      await waitFor(() => {
        expect(screen.getByText('Order Alpha')).toBeInTheDocument();
        expect(screen.getByText('Order Beta')).toBeInTheDocument();
      });
    });
  });

  describe('failure cases', () => {
    // Protects against silently swallowing error states and leaving the list in permanent loading
    test('when the API rejects, the error message component text is visible in the rendered output', async () => {
      ordersApi.fetchOrders.mockRejectedValueOnce(new Error('Failed to load orders'));

      render(<OrdersList />);

      await waitFor(() => {
        expect(screen.getByText('Something went wrong loading your orders.')).toBeInTheDocument();
      });
    });
  });

  describe('edge cases', () => {
    // Protects against rendering random markup or crashing when no orders exist for the user
    test('when the API returns an empty array [], the empty state message is visible and no order items are rendered', async () => {
      ordersApi.fetchOrders.mockResolvedValueOnce([]);

      render(<OrdersList />);

      await waitFor(() => {
        expect(screen.getByText('No orders yet')).toBeInTheDocument();
      });
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });
});
