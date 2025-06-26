import ApiService from './ApiService';
import { LIQUIDITY_POOLS, TokenUtils } from '../config/tokens';

/**
 * Liquidity Pool Service for PEPU/WPEPU trading and analytics
 */
class LiquidityPoolService {
  constructor() {
    this.poolAddress = '0x3a614c79a17b18819ba6b97e330b61ba8fe34435';
    this.poolInfo = LIQUIDITY_POOLS.PEPU_POOL;
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds
  }

  /**
   * Get real-time pool statistics
   */
  async getPoolStats() {
    const cacheKey = 'pool_stats';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const stats = await ApiService.request(`/pools/${this.poolAddress}/stats`);
      this.setCache(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Failed to fetch pool stats:', error);
      return this.getMockPoolStats();
    }
  }

  /**
   * Get pool reserves and calculate token prices
   */
  async getPoolReserves() {
    const cacheKey = 'pool_reserves';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const reserves = await ApiService.request(`/pools/${this.poolAddress}/reserves`);
      this.setCache(cacheKey, reserves);
      return reserves;
    } catch (error) {
      console.error('Failed to fetch pool reserves:', error);
      return this.getMockReserves();
    }
  }

  /**
   * Calculate token swap quote
   */
  async getSwapQuote(tokenIn, tokenOut, amountIn) {
    try {
      const quote = await ApiService.request('/pools/quote', {
        method: 'POST',
        body: JSON.stringify({
          poolAddress: this.poolAddress,
          tokenIn,
          tokenOut,
          amountIn: amountIn.toString(),
        }),
      });

      return {
        amountOut: quote.amountOut,
        priceImpact: quote.priceImpact,
        fee: quote.fee,
        minimumAmountOut: quote.minimumAmountOut,
        route: quote.route || [tokenIn, tokenOut],
      };
    } catch (error) {
      console.error('Failed to get swap quote:', error);
      return this.calculateMockQuote(tokenIn, tokenOut, amountIn);
    }
  }

  /**
   * Execute token swap
   */
  async executeSwap(swapParams) {
    try {
      const result = await ApiService.request('/pools/swap', {
        method: 'POST',
        body: JSON.stringify({
          poolAddress: this.poolAddress,
          ...swapParams,
        }),
      });

      return {
        success: true,
        transactionHash: result.txHash,
        amountOut: result.amountOut,
        gasUsed: result.gasUsed,
      };
    } catch (error) {
      console.error('Swap execution failed:', error);
      throw new Error(`Swap failed: ${error.message}`);
    }
  }

  /**
   * Add liquidity to the pool
   */
  async addLiquidity(token0Amount, token1Amount, minToken0, minToken1) {
    try {
      const result = await ApiService.request('/pools/add-liquidity', {
        method: 'POST',
        body: JSON.stringify({
          poolAddress: this.poolAddress,
          token0Amount: token0Amount.toString(),
          token1Amount: token1Amount.toString(),
          minToken0: minToken0.toString(),
          minToken1: minToken1.toString(),
        }),
      });

      return {
        success: true,
        transactionHash: result.txHash,
        lpTokens: result.lpTokens,
        token0Used: result.token0Used,
        token1Used: result.token1Used,
      };
    } catch (error) {
      console.error('Add liquidity failed:', error);
      throw new Error(`Add liquidity failed: ${error.message}`);
    }
  }

  /**
   * Remove liquidity from the pool
   */
  async removeLiquidity(lpTokenAmount, minToken0, minToken1) {
    try {
      const result = await ApiService.request('/pools/remove-liquidity', {
        method: 'POST',
        body: JSON.stringify({
          poolAddress: this.poolAddress,
          lpTokenAmount: lpTokenAmount.toString(),
          minToken0: minToken0.toString(),
          minToken1: minToken1.toString(),
        }),
      });

      return {
        success: true,
        transactionHash: result.txHash,
        token0Received: result.token0Received,
        token1Received: result.token1Received,
      };
    } catch (error) {
      console.error('Remove liquidity failed:', error);
      throw new Error(`Remove liquidity failed: ${error.message}`);
    }
  }

  /**
   * Get user's liquidity position
   */
  async getUserPosition(userAddress) {
    const cacheKey = `user_position_${userAddress}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const position = await ApiService.request(`/pools/${this.poolAddress}/position/${userAddress}`);
      this.setCache(cacheKey, position, 10000); // Cache for 10 seconds
      return position;
    } catch (error) {
      console.error('Failed to fetch user position:', error);
      return {
        lpTokenBalance: '0',
        token0Share: '0',
        token1Share: '0',
        valueUSD: 0,
        percentage: 0,
      };
    }
  }

  /**
   * Get historical pool data for charts
   */
  async getPoolHistory(timeframe = '24h') {
    try {
      const history = await ApiService.request(`/pools/${this.poolAddress}/history?timeframe=${timeframe}`);
      return history;
    } catch (error) {
      console.error('Failed to fetch pool history:', error);
      return this.getMockHistory(timeframe);
    }
  }

  /**
   * Calculate APR/APY for liquidity providers
   */
  async calculateAPR() {
    try {
      const stats = await this.getPoolStats();
      const volume24h = stats.volume24h || 0;
      const tvl = stats.tvl || 1;
      const feeRate = this.poolInfo.fee || 0.003;

      // Simple APR calculation: (24h fees / TVL) * 365
      const fees24h = volume24h * feeRate;
      const apr = (fees24h / tvl) * 365 * 100;

      return {
        apr: Math.max(0, apr),
        apy: Math.max(0, Math.pow(1 + apr / 365 / 100, 365) - 1) * 100,
        volume24h,
        fees24h,
        tvl,
      };
    } catch (error) {
      console.error('Failed to calculate APR:', error);
      return { apr: 0, apy: 0, volume24h: 0, fees24h: 0, tvl: 0 };
    }
  }

  // Cache management
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data, timeout = this.cacheTimeout) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      timeout,
    });
  }

  // Mock data for development/fallback
  getMockPoolStats() {
    return {
      tvl: 1250000,
      volume24h: 145000,
      fees24h: 435,
      priceChange24h: 2.3,
      token0Price: 0.0234,
      token1Price: 0.0251,
      apy: 12.5,
    };
  }

  getMockReserves() {
    return {
      reserve0: '50000000000000000000000000', // 50M PEPU
      reserve1: '48500000000000000000000000', // 48.5M WPEPU
      blockTimestampLast: Math.floor(Date.now() / 1000),
    };
  }

  calculateMockQuote(tokenIn, tokenOut, amountIn) {
    // Simple mock calculation with 0.3% fee
    const fee = 0.003;
    const amountOut = amountIn * (1 - fee) * 0.97; // Mock exchange rate
    
    return {
      amountOut: amountOut.toString(),
      priceImpact: 0.1, // 0.1%
      fee: (amountIn * fee).toString(),
      minimumAmountOut: (amountOut * 0.98).toString(), // 2% slippage
      route: [tokenIn, tokenOut],
    };
  }

  getMockHistory(timeframe) {
    const points = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
    const history = [];
    
    for (let i = 0; i < points; i++) {
      history.push({
        timestamp: Date.now() - (i * (timeframe === '24h' ? 3600000 : 86400000)),
        tvl: 1200000 + Math.random() * 100000,
        volume: 10000 + Math.random() * 50000,
        price: 0.023 + Math.random() * 0.005,
      });
    }
    
    return history.reverse();
  }
}

export default new LiquidityPoolService();
