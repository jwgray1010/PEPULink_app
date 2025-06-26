import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanGestureHandler,
  State,
  Dimensions,
  Platform,
} from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PerformanceMonitor = ({ isVisible, onToggle }) => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    cpu: 0,
    renderTime: 0,
    jsLoad: 0
  });
  
  const [history, setHistory] = useState({
    fps: new Array(30).fill(60),
    memory: new Array(30).fill(0),
    cpu: new Array(30).fill(0)
  });
  
  const position = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(isVisible ? 1 : 0)).current;
  const lastFrameTime = useRef(performance.now());
  const frameCount = useRef(0);
  const intervalRef = useRef(null);

  // Performance monitoring
  useEffect(() => {
    if (isVisible) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
    
    return () => stopMonitoring();
  }, [isVisible]);

  const startMonitoring = () => {
    intervalRef.current = setInterval(() => {
      updateMetrics();
    }, 1000);
    
    // Start FPS monitoring
    measureFPS();
  };

  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const measureFPS = () => {
    const now = performance.now();
    frameCount.current++;
    
    if (now - lastFrameTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (now - lastFrameTime.current));
      
      setMetrics(prev => ({ ...prev, fps }));
      setHistory(prev => ({
        ...prev,
        fps: [...prev.fps.slice(1), fps]
      }));
      
      frameCount.current = 0;
      lastFrameTime.current = now;
    }
    
    if (isVisible) {
      requestAnimationFrame(measureFPS);
    }
  };

  const updateMetrics = () => {
    // Simulate memory and CPU metrics (in real app, use native modules)
    const memory = Math.random() * 100;
    const cpu = Math.random() * 100;
    const renderTime = Math.random() * 16; // Frame render time in ms
    const jsLoad = Math.random() * 100;

    setMetrics(prev => ({
      ...prev,
      memory,
      cpu,
      renderTime,
      jsLoad
    }));

    setHistory(prev => ({
      ...prev,
      memory: [...prev.memory.slice(1), memory],
      cpu: [...prev.cpu.slice(1), cpu]
    }));
  };

  // Animate visibility
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: position.x, translationY: position.y } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // Snap to edges
      const { translationX, translationY } = event.nativeEvent;
      const snapX = translationX > screenWidth / 2 ? screenWidth - 200 : 50;
      const snapY = Math.max(100, Math.min(screenHeight - 300, translationY + 100));

      Animated.spring(position, {
        toValue: { x: snapX - 50, y: snapY - 100 },
        useNativeDriver: false,
      }).start();
    }
  };

  const getStatusColor = (value, type) => {
    switch (type) {
      case 'fps':
        return value >= 50 ? '#00C851' : value >= 30 ? '#FF8800' : '#FF4444';
      case 'memory':
      case 'cpu':
        return value <= 50 ? '#00C851' : value <= 80 ? '#FF8800' : '#FF4444';
      default:
        return '#00C851';
    }
  };

  if (!isVisible) return null;

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={[
          styles.monitor,
          {
            opacity,
            transform: position.getTranslateTransform(),
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Performance</Text>
          <Text style={styles.closeButton} onPress={onToggle}>
            ×
          </Text>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metric}>
            <Text style={[styles.metricValue, { color: getStatusColor(metrics.fps, 'fps') }]}>
              {Math.round(metrics.fps)}
            </Text>
            <Text style={styles.metricLabel}>FPS</Text>
          </View>
          
          <View style={styles.metric}>
            <Text style={[styles.metricValue, { color: getStatusColor(metrics.memory, 'memory') }]}>
              {Math.round(metrics.memory)}%
            </Text>
            <Text style={styles.metricLabel}>MEM</Text>
          </View>
          
          <View style={styles.metric}>
            <Text style={[styles.metricValue, { color: getStatusColor(metrics.cpu, 'cpu') }]}>
              {Math.round(metrics.cpu)}%
            </Text>
            <Text style={styles.metricLabel}>CPU</Text>
          </View>
          
          <View style={styles.metric}>
            <Text style={[styles.metricValue, { color: getStatusColor(metrics.renderTime, 'render') }]}>
              {Math.round(metrics.renderTime)}ms
            </Text>
            <Text style={styles.metricLabel}>RENDER</Text>
          </View>
        </View>

        {/* Mini Charts */}
        <View style={styles.chartsContainer}>
          <View style={styles.miniChart}>
            <Text style={styles.chartLabel}>FPS</Text>
            <LineChart
              style={styles.chart}
              data={history.fps}
              curve={shape.curveNatural}
              svg={{ stroke: getStatusColor(metrics.fps, 'fps'), strokeWidth: 2 }}
              contentInset={{ top: 5, bottom: 5 }}
            />
          </View>
          
          <View style={styles.miniChart}>
            <Text style={styles.chartLabel}>Memory</Text>
            <LineChart
              style={styles.chart}
              data={history.memory}
              curve={shape.curveNatural}
              svg={{ stroke: getStatusColor(metrics.memory, 'memory'), strokeWidth: 2 }}
              contentInset={{ top: 5, bottom: 5 }}
            />
          </View>
        </View>

        {/* Performance Status */}
        <View style={styles.statusBar}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: getOverallStatus() }
          ]} />
          <Text style={styles.statusText}>
            {getPerformanceLabel()}
          </Text>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );

  function getOverallStatus() {
    const avgFps = metrics.fps;
    const avgMem = metrics.memory;
    const avgCpu = metrics.cpu;
    
    if (avgFps >= 50 && avgMem <= 50 && avgCpu <= 50) return '#00C851';
    if (avgFps >= 30 && avgMem <= 80 && avgCpu <= 80) return '#FF8800';
    return '#FF4444';
  }

  function getPerformanceLabel() {
    const status = getOverallStatus();
    if (status === '#00C851') return 'Excellent';
    if (status === '#FF8800') return 'Good';
    return 'Poor';
  }
};

const styles = StyleSheet.create({
  monitor: {
    position: 'absolute',
    top: 100,
    left: 50,
    width: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 9999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricLabel: {
    color: '#CCCCCC',
    fontSize: 10,
    marginTop: 2,
  },
  chartsContainer: {
    marginBottom: 12,
  },
  miniChart: {
    marginBottom: 8,
  },
  chartLabel: {
    color: '#CCCCCC',
    fontSize: 10,
    marginBottom: 4,
  },
  chart: {
    height: 30,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});

export default PerformanceMonitor;
