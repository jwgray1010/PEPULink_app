import React from 'react';
import { View, Text } from 'react-native';
import MarketScreen from '../src/screens/MarketScreen';
import MerchantDashboard from '../src/components/Merchant/MerchantDashboard';
import MerchantQRGenerator from '../src/components/Merchant/MerchantQRGenerator';

// Test component to verify all Market components import correctly
export default function MarketTest() {
  return (
    <View>
      <Text>Market components test - all imports successful!</Text>
    </View>
  );
}
