// Order Service
// Note: httpClient should be available globally

class OrderService {
  // Create a new order
  async createOrder(orderData) {
    try {
      const order = await window.httpClient.post('/orders', {
        ...orderData,
        createdAt: new Date().toISOString(),
      });
      
      // Save to localStorage as backup
      this.saveOrderToLocalStorage(order);
      
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Save order to localStorage
  saveOrderToLocalStorage(order) {
    try {
      const orders = this.getOrdersFromLocalStorage();
      orders.push(order);
      localStorage.setItem('it-courses-orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving order to localStorage:', error);
    }
  }

  // Get orders from localStorage
  getOrdersFromLocalStorage() {
    try {
      const stored = localStorage.getItem('it-courses-orders');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading orders from localStorage:', error);
      return [];
    }
  }

  // Get all orders
  async getAllOrders() {
    try {
      const orders = await window.httpClient.get('/orders');
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Fallback to localStorage
      return this.getOrdersFromLocalStorage();
    }
  }
}

// Export singleton instance
const orderService = new OrderService();
window.orderService = orderService;

