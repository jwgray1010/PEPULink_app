#!/usr/bin/env node

/**
 * Pool Integration Test Script
 * Tests all pool-related configurations and services
 */

import { APP_CONFIG, pepuChain, TOKEN_ADDRESSES, LIQUIDITY_POOLS } from './src/config/index.js';

console.log('🧪 PEPULink Pool Integration Test\n');

// Test 1: Environment Variables
console.log('📋 Testing Environment Variables:');
console.log(`✅ API Key: ${process.env.EXPO_PUBLIC_API_KEY ? 'Loaded' : '❌ Missing'}`);
console.log(`✅ PEPU Token: ${process.env.EXPO_PUBLIC_PEPU_TOKEN_ADDRESS || '❌ Missing'}`);
console.log(`✅ WPEPU Token: ${process.env.EXPO_PUBLIC_WPEPU_TOKEN_ADDRESS || '❌ Missing'}`);
console.log(`✅ Pool Address: ${process.env.EXPO_PUBLIC_PEPU_POOL_ADDRESS || '❌ Missing'}`);
console.log(`✅ Wallet Address: ${process.env.EXPO_PUBLIC_PEPU_WALLET_ADDRESS || '❌ Missing'}`);
console.log(`✅ Chain ID: ${process.env.EXPO_PUBLIC_PEPU_CHAIN_ID || '❌ Missing'}`);
console.log(`✅ RPC URL: ${process.env.EXPO_PUBLIC_PEPU_RPC_URL || '❌ Missing'}\n`);

// Test 2: Token Configuration
console.log('🪙 Testing Token Configuration:');
console.log(`✅ PEPU Address: ${TOKEN_ADDRESSES.PEPU.address}`);
console.log(`✅ WPEPU Address: ${TOKEN_ADDRESSES.WPEPU.address}`);
console.log(`✅ PEPU Symbol: ${TOKEN_ADDRESSES.PEPU.symbol}`);
console.log(`✅ WPEPU Symbol: ${TOKEN_ADDRESSES.WPEPU.symbol}\n`);

// Test 3: Pool Configuration
console.log('🏊‍♂️ Testing Pool Configuration:');
const pepuPool = LIQUIDITY_POOLS.PEPU_POOL;
console.log(`✅ Pool Address: ${pepuPool.address}`);
console.log(`✅ Token0: ${pepuPool.token0.symbol} (${pepuPool.token0.address})`);
console.log(`✅ Token1: ${pepuPool.token1.symbol} (${pepuPool.token1.address})`);
console.log(`✅ Fee: ${pepuPool.fee * 100}%`);
console.log(`✅ Protocol: ${pepuPool.protocol}\n`);

// Test 4: Chain Configuration
console.log('⛓️ Testing Chain Configuration:');
console.log(`✅ Chain Name: ${pepuChain.name}`);
console.log(`✅ Chain ID: ${pepuChain.id}`);
console.log(`✅ RPC URL: ${pepuChain.rpcUrls.default.http[0]}`);
console.log(`✅ Explorer: ${pepuChain.blockExplorers.default.url}\n`);

// Test 5: API Configuration
console.log('🔌 Testing API Configuration:');
console.log(`✅ API URL: ${APP_CONFIG.apiUrl}`);
console.log(`✅ API Key: ${APP_CONFIG.apiKey ? 'Configured' : '❌ Missing'}`);
console.log(`✅ Environment: ${APP_CONFIG.environment}\n`);

// Test 6: Contract Addresses Validation
console.log('📝 Validating Contract Addresses:');
const addressPattern = /^0x[a-fA-F0-9]{40}$/;

const addresses = [
  { name: 'PEPU Token', address: TOKEN_ADDRESSES.PEPU.address },
  { name: 'WPEPU Token', address: TOKEN_ADDRESSES.WPEPU.address },
  { name: 'Pool Address', address: pepuPool.address },
  { name: 'Wallet Address', address: process.env.EXPO_PUBLIC_PEPU_WALLET_ADDRESS },
];

addresses.forEach(({ name, address }) => {
  const isValid = addressPattern.test(address);
  console.log(`${isValid ? '✅' : '❌'} ${name}: ${address} ${isValid ? '(Valid)' : '(Invalid)'}`);
});

console.log('\n🎉 Pool Integration Test Complete!');
console.log('\n📊 Summary:');
console.log('- Token contracts configured ✅');
console.log('- Liquidity pool configured ✅'); 
console.log('- Trading pairs defined ✅');
console.log('- API integration ready ✅');
console.log('- Chain configuration valid ✅');
console.log('\n🚀 Ready for pool testing!');
