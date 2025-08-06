import { toast } from 'react-toastify';

export const orderService = {
  // Get all orders
  async getAll() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "orderNumber" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "total" } },
          { field: { Name: "shippingAddress_name" } },
          { field: { Name: "shippingAddress_street" } },
          { field: { Name: "shippingAddress_city" } },
          { field: { Name: "shippingAddress_state" } },
          { field: { Name: "shippingAddress_zipCode" } },
          { field: { Name: "shippingAddress_country" } },
          { field: { Name: "trackingNumber" } }
        ],
        orderBy: [
          {
            fieldName: "date",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('order', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Get order items for each order
      const ordersWithItems = await Promise.all(response.data.map(async (order) => {
        const itemsParams = {
          fields: [
            { field: { Name: "Name" } },
            { field: { Name: "quantity" } },
            { field: { Name: "price" } },
            { field: { Name: "image" } }
          ],
          where: [
            {
              FieldName: "order_id",
              Operator: "EqualTo",
              Values: [order.Id]
            }
          ]
        };

        const itemsResponse = await apperClient.fetchRecords('order_item', itemsParams);
        
        return {
          Id: order.Id,
          orderNumber: order.orderNumber || `ORD-${order.Id}`,
          date: order.date || new Date().toISOString(),
          status: order.status || 'processing',
          total: parseFloat(order.total) || 0,
          trackingNumber: order.trackingNumber || null,
          shippingAddress: {
            name: order.shippingAddress_name || 'Customer',
            street: order.shippingAddress_street || '',
            city: order.shippingAddress_city || '',
            state: order.shippingAddress_state || '',
            zipCode: order.shippingAddress_zipCode || '',
            country: order.shippingAddress_country || 'USA'
          },
          items: itemsResponse.success ? itemsResponse.data.map(item => ({
            Id: item.Id,
            name: item.Name || 'Product',
            quantity: parseInt(item.quantity) || 1,
            price: parseFloat(item.price) || 0,
            image: item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'
          })) : []
        };
      }));

      return ordersWithItems;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching orders:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  // Get order by ID
  async getById(id) {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new Error('Invalid order ID');
      }

      await new Promise(resolve => setTimeout(resolve, 200));
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "orderNumber" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "total" } },
          { field: { Name: "shippingAddress_name" } },
          { field: { Name: "shippingAddress_street" } },
          { field: { Name: "shippingAddress_city" } },
          { field: { Name: "shippingAddress_state" } },
          { field: { Name: "shippingAddress_zipCode" } },
          { field: { Name: "shippingAddress_country" } },
          { field: { Name: "trackingNumber" } }
        ]
      };

      const response = await apperClient.getRecordById('order', numericId, params);
      
      if (!response.success) {
        throw new Error(response.message || 'Order not found');
      }

      const order = response.data;
      return {
        Id: order.Id,
        orderNumber: order.orderNumber || `ORD-${order.Id}`,
        date: order.date || new Date().toISOString(),
        status: order.status || 'processing',
        total: parseFloat(order.total) || 0,
        trackingNumber: order.trackingNumber || null,
        shippingAddress: {
          name: order.shippingAddress_name || 'Customer',
          street: order.shippingAddress_street || '',
          city: order.shippingAddress_city || '',
          state: order.shippingAddress_state || '',
          zipCode: order.shippingAddress_zipCode || '',
          country: order.shippingAddress_country || 'USA'
        }
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching order:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  // Update order status
  async updateStatus(id, newStatus) {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new Error('Invalid order ID');
      }

      const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(newStatus)) {
        throw new Error('Invalid status');
      }

      await new Promise(resolve => setTimeout(resolve, 250));
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Id: numericId,
            status: newStatus
          }
        ]
      };

      const response = await apperClient.updateRecord('order', params);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update order status');
      }

      const updatedOrder = response.results?.[0]?.data;
      if (updatedOrder) {
        toast.success(`Order ${updatedOrder.orderNumber || numericId} status updated to ${newStatus}`);
        return {
          Id: updatedOrder.Id,
          orderNumber: updatedOrder.orderNumber || `ORD-${updatedOrder.Id}`,
          status: updatedOrder.status
        };
      }

      throw new Error('Update response invalid');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating order status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  // Cancel order
  async cancel(id) {
    return this.updateStatus(id, 'cancelled');
  }
};

export default orderService;