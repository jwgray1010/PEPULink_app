import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Skeleton Loading Component
export const SkeletonLoader = ({ width: skeletonWidth = 100, height = 20, style = {} }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: skeletonWidth,
          height,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Card Skeleton
export const CardSkeleton = () => (
  <View style={styles.cardSkeleton}>
    <View style={styles.cardSkeletonHeader}>
      <SkeletonLoader width={80} height={16} />
      <SkeletonLoader width={60} height={16} />
    </View>
    <View style={styles.cardSkeletonBalance}>
      <SkeletonLoader width={120} height={14} />
      <SkeletonLoader width={140} height={32} />
    </View>
    <View style={styles.cardSkeletonFooter}>
      <SkeletonLoader width={160} height={16} />
      <SkeletonLoader width={80} height={14} />
    </View>
  </View>
);

// Transaction Skeleton
export const TransactionSkeleton = () => (
  <View style={styles.transactionSkeleton}>
    <View style={styles.transactionSkeletonIcon}>
      <SkeletonLoader width={40} height={40} style={{ borderRadius: 20 }} />
    </View>
    <View style={styles.transactionSkeletonContent}>
      <SkeletonLoader width={120} height={16} />
      <SkeletonLoader width={80} height={14} />
    </View>
    <View style={styles.transactionSkeletonAmount}>
      <SkeletonLoader width={80} height={18} />
      <SkeletonLoader width={60} height={12} />
    </View>
  </View>
);

// Chart Skeleton
export const ChartSkeleton = () => (
  <View style={styles.chartSkeleton}>
    <View style={styles.chartSkeletonHeader}>
      <SkeletonLoader width={100} height={18} />
      <SkeletonLoader width={60} height={14} />
    </View>
    <View style={styles.chartSkeletonGraph}>
      {[...Array(5)].map((_, index) => (
        <View key={index} style={styles.chartSkeletonBar}>
          <SkeletonLoader 
            width={40} 
            height={60 + Math.random() * 80} 
            style={{ borderRadius: 4 }} 
          />
        </View>
      ))}
    </View>
    <View style={styles.chartSkeletonLegend}>
      {[...Array(3)].map((_, index) => (
        <View key={index} style={styles.chartSkeletonLegendItem}>
          <SkeletonLoader width={12} height={12} style={{ borderRadius: 6 }} />
          <SkeletonLoader width={60} height={12} />
        </View>
      ))}
    </View>
  </View>
);

// List Skeleton
export const ListSkeleton = ({ itemCount = 5 }) => (
  <View style={styles.listSkeleton}>
    {[...Array(itemCount)].map((_, index) => (
      <TransactionSkeleton key={index} />
    ))}
  </View>
);

// Loading Spinner with Smooth Animation
export const LoadingSpinner = ({ size = 'large', color = '#007AFF' }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinnerSize = size === 'large' ? 40 : size === 'medium' ? 30 : 20;

  return (
    <View style={styles.spinnerContainer}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderColor: color,
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </View>
  );
};

// Full Screen Loading
export const FullScreenLoading = ({ message = 'Loading...' }) => (
  <View style={styles.fullScreenLoading}>
    <LoadingSpinner size="large" />
    <SkeletonLoader width={120} height={16} style={{ marginTop: 20 }} />
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  
  cardSkeleton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  cardSkeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  cardSkeletonBalance: {
    marginBottom: 20,
  },
  
  cardSkeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  transactionSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  
  transactionSkeletonIcon: {
    marginRight: 15,
  },
  
  transactionSkeletonContent: {
    flex: 1,
  },
  
  transactionSkeletonAmount: {
    alignItems: 'flex-end',
  },
  
  chartSkeleton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  chartSkeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  chartSkeletonGraph: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    marginBottom: 20,
  },
  
  chartSkeletonBar: {
    alignItems: 'center',
  },
  
  chartSkeletonLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  chartSkeletonLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  listSkeleton: {
    backgroundColor: '#fff',
  },
  
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  spinner: {
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRadius: 50,
  },
  
  fullScreenLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});

export default {
  SkeletonLoader,
  CardSkeleton,
  TransactionSkeleton,
  ChartSkeleton,
  ListSkeleton,
  LoadingSpinner,
  FullScreenLoading,
};
