import { APP_CONFIG } from '../config';

/**
 * API Service for secure communication with backend services
 * Handles authentication, rate limiting, and error handling
 */
class ApiService {
  constructor() {
    this.baseURL = APP_CONFIG.apiUrl;
    this.apiKey = APP_CONFIG.apiKey;
    this.timeout = 10000; // 10 seconds
    this.retryAttempts = 3;
    
    // Initialize request interceptors
    this.setupInterceptors();
  }

  /**
   * Setup request/response interceptors
   */
  setupInterceptors() {
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': `${APP_CONFIG.name}/${APP_CONFIG.version}`,
      ...(this.apiKey && { 'X-API-Key': this.apiKey }),
    };
  }

  /**
   * Make authenticated API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      // Add authentication token if available
      const token = await this.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const response = await this.fetchWithRetry(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Fetch with retry logic
   */
  async fetchWithRetry(url, config, attempt = 1) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (attempt < this.retryAttempts && this.isRetryableError(error)) {
        await this.delay(1000 * attempt); // Exponential backoff
        return this.fetchWithRetry(url, config, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  }

  /**
   * Handle API errors
   */
  handleError(error) {
    console.error('API Error:', error);
    
    if (error.name === 'AbortError') {
      return new Error('Request timeout. Please try again.');
    }
    
    if (!navigator.onLine) {
      return new Error('No internet connection. Please check your network.');
    }
    
    return error;
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(error) {
    return error.name === 'TypeError' || // Network error
           error.message.includes('fetch'); // Fetch-related error
  }

  /**
   * Get authentication token from storage
   */
  async getAuthToken() {
    try {
      const { getSecureValue } = await import('../utils/storage');
      return await getSecureValue('auth_token');
    } catch (error) {
      console.warn('Failed to get auth token:', error);
      return null;
    }
  }

  /**
   * Delay helper for retry logic
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // API Methods
  
  /**
   * Wallet and transaction APIs
   */
  async getWalletBalance(address) {
    return this.request(`/wallet/${address}/balance`);
  }

  async createTransaction(transactionData) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async getTransactionHistory(address, limit = 50) {
    return this.request(`/transactions/${address}?limit=${limit}`);
  }

  /**
   * AI and Analytics APIs
   */
  async getAIInsights(data) {
    return this.request('/ai/insights', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSpendingAnalysis(userId, period = '30d') {
    return this.request(`/analytics/spending/${userId}?period=${period}`);
  }

  async submitAIQuery(query, context = {}) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ query, context }),
    });
  }

  /**
   * Merchant APIs
   */
  async registerMerchant(merchantData) {
    return this.request('/merchants/register', {
      method: 'POST',
      body: JSON.stringify(merchantData),
    });
  }

  async generateMerchantQR(merchantId, amount, description) {
    return this.request('/merchants/qr', {
      method: 'POST',
      body: JSON.stringify({ merchantId, amount, description }),
    });
  }

  /**
   * Card management APIs
   */
  async addCard(cardData) {
    return this.request('/cards', {
      method: 'POST',
      body: JSON.stringify(cardData),
    });
  }

  async getCards(userId) {
    return this.request(`/cards/${userId}`);
  }

  async freezeCard(cardId) {
    return this.request(`/cards/${cardId}/freeze`, {
      method: 'POST',
    });
  }

  /**
   * User preferences and settings
   */
  async updateUserPreferences(userId, preferences) {
    return this.request(`/users/${userId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  async getUserProfile(userId) {
    return this.request(`/users/${userId}/profile`);
  }
}

// Export singleton instance
export default new ApiService();
