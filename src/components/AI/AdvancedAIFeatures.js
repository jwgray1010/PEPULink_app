import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
  Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const FeatureCard = ({ feature, onPress, enabled, onToggle }) => (
  <TouchableOpacity 
    style={styles.featureCard}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <LinearGradient
      colors={feature.gradient}
      style={styles.cardGradient}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.featureIcon}>{feature.icon}</Text>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#4ECDC4' }}
          thumbColor={enabled ? '#fff' : '#f4f3f4'}
        />
      </View>
      
      <Text style={styles.featureTitle}>{feature.title}</Text>
      <Text style={styles.featureDescription}>{feature.description}</Text>
      
      <View style={styles.featuresList}>
        {feature.features.map((item, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.featureText}>{item}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={styles.exploreButton}>
        <Text style={styles.exploreButtonText}>Explore Feature</Text>
      </TouchableOpacity>
    </LinearGradient>
  </TouchableOpacity>
);

const DemoModal = ({ visible, feature, onClose }) => (
  <Modal
    visible={visible}
    animationType="slide"
    presentationStyle="pageSheet"
  >
    <LinearGradient
      colors={feature?.gradient || ['#667eea', '#764ba2']}
      style={styles.modalContainer}
    >
      <ScrollView style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalIcon}>{feature?.icon}</Text>
          <Text style={styles.modalTitle}>{feature?.title}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.modalDescription}>
          {feature?.detailedDescription}
        </Text>
        
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Interactive Demo</Text>
          <Text style={styles.demoText}>
            This is a demonstration of {feature?.title} capabilities. 
            In the full version, you would see real-time data and interactive controls.
          </Text>
          
          {feature?.demo && (
            <View style={styles.demoContent}>
              {feature.demo()}
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  </Modal>
);

export default function AdvancedAIFeatures({ visible, onClose }) {
  const [enabledFeatures, setEnabledFeatures] = useState({
    crypto: true,
    behavioral: true,
    investment: false,
    voice: false,
    security: true,
    personalization: true
  });
  
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showDemo, setShowDemo] = useState(false);

  const aiFeatures = [
    {
      id: 'crypto',
      title: 'Crypto Market Intelligence',
      icon: '📈',
      gradient: ['#667eea', '#764ba2'],
      description: 'Next-generation artificial intelligence for crypto finance',
      features: [
        'Real-time price predictions',
        'Social sentiment analysis',
        'DeFi yield optimization',
        'Gas fee predictions',
        'Market timing signals'
      ],
      detailedDescription: 'Our advanced machine learning algorithms analyze thousands of market indicators, social media sentiment, and on-chain data to provide you with accurate price predictions and optimal trading opportunities.',
      demo: () => (
        <View style={styles.cryptoDemo}>
          <Text style={styles.demoDataText}>PEPU: $0.245 (+12.5%)</Text>
          <Text style={styles.demoDataText}>Prediction: Bullish trend continuing</Text>
          <Text style={styles.demoDataText}>Confidence: 87%</Text>
        </View>
      )
    },
    {
      id: 'behavioral',
      title: 'Behavioral Finance AI',
      icon: '🧠',
      gradient: ['#ff6b6b', '#ee5a24'],
      description: 'Understand and optimize your spending psychology',
      features: [
        'Spending psychology analysis',
        'Impulse purchase prevention',
        'Emotional trigger detection',
        'Habit optimization',
        'Behavioral nudges'
      ],
      detailedDescription: 'Advanced behavioral analysis helps you understand your spending patterns, identify emotional triggers, and provides personalized interventions to improve your financial decision-making.',
      demo: () => (
        <View style={styles.behavioralDemo}>
          <Text style={styles.demoDataText}>Impulse Risk: Medium</Text>
          <Text style={styles.demoDataText}>Emotional State: Stressed</Text>
          <Text style={styles.demoDataText}>Recommendation: Wait 24h before purchase</Text>
        </View>
      )
    },
    {
      id: 'investment',
      title: 'Smart Investment Advisor',
      icon: '💼',
      gradient: ['#2dd4bf', '#06b6d4'],
      description: 'AI-powered portfolio optimization and risk management',
      features: [
        'Portfolio optimization',
        'Risk assessment',
        'Rebalancing alerts',
        'DeFi strategy planning',
        'Dollar-cost averaging'
      ],
      detailedDescription: 'Sophisticated portfolio analysis using modern portfolio theory combined with DeFi yield farming strategies to maximize returns while managing risk.',
      demo: () => (
        <View style={styles.investmentDemo}>
          <Text style={styles.demoDataText}>Portfolio Score: 8.2/10</Text>
          <Text style={styles.demoDataText}>Risk Level: Moderate</Text>
          <Text style={styles.demoDataText}>Suggested Rebalance: +5% DeFi</Text>
        </View>
      )
    },
    {
      id: 'voice',
      title: 'Voice AI Assistant',
      icon: '🎤',
      gradient: ['#a78bfa', '#8b5cf6'],
      description: 'Natural language control for hands-free finance',
      features: [
        'Natural language queries',
        'Voice-controlled transactions',
        'Hands-free analytics',
        'Multi-language support',
        'Conversational finance coach'
      ],
      detailedDescription: 'Advanced natural language processing enables you to interact with your finances using voice commands, ask complex questions, and receive intelligent responses.',
      demo: () => (
        <View style={styles.voiceDemo}>
          <TouchableOpacity 
            style={styles.voiceButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Speech.speak("How much did I spend on food this month?");
            }}
          >
            <Text style={styles.voiceButtonText}>🎤 Try Voice Query</Text>
          </TouchableOpacity>
        </View>
      )
    },
    {
      id: 'security',
      title: 'AI Security & Fraud Detection',
      icon: '🛡️',
      gradient: ['#f59e0b', '#d97706'],
      description: 'Advanced threat detection and transaction security',
      features: [
        'Real-time fraud scoring',
        'Anomaly detection',
        'Device fingerprinting',
        'Behavioral biometrics',
        'Smart contract safety'
      ],
      detailedDescription: 'Multi-layered AI security system that monitors transaction patterns, detects anomalies, and provides real-time fraud prevention using advanced machine learning models.',
      demo: () => (
        <View style={styles.securityDemo}>
          <Text style={styles.demoDataText}>Security Score: 95/100</Text>
          <Text style={styles.demoDataText}>Threat Level: Low</Text>
          <Text style={styles.demoDataText}>Last Scan: 2 minutes ago</Text>
        </View>
      )
    },
    {
      id: 'personalization',
      title: 'Hyper-Personalization',
      icon: '✨',
      gradient: ['#ec4899', '#be185d'],
      description: 'Adaptive interface that learns from your behavior',
      features: [
        'Adaptive UI/UX',
        'Personalized recommendations',
        'Dynamic pricing alerts',
        'Custom investment strategies',
        'Behavioral learning'
      ],
      detailedDescription: 'Advanced personalization engine that adapts the entire application experience based on your usage patterns, preferences, and financial goals.',
      demo: () => (
        <View style={styles.personalizationDemo}>
          <Text style={styles.demoDataText}>Learning Progress: 78%</Text>
          <Text style={styles.demoDataText}>Personalization Score: High</Text>
          <Text style={styles.demoDataText}>Custom Strategies: 12 active</Text>
        </View>
      )
    }
  ];

  const toggleFeature = (featureId) => {
    setEnabledFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const openDemo = (feature) => {
    setSelectedFeature(feature);
    setShowDemo(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const closeDemo = () => {
    setShowDemo(false);
    setSelectedFeature(null);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Advanced AI Features</Text>
          <Text style={styles.headerSubtitle}>
            Next-generation artificial intelligence for crypto finance
          </Text>
          
          <View style={styles.demoModeIndicator}>
            <Text style={styles.demoModeText}>📱 INTERACTIVE AI TUTORIAL & DEMO</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.instructionText}>
            Click the buttons below to explore each AI feature interactively
          </Text>

          <View style={styles.featuresGrid}>
            {aiFeatures.map((feature, index) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                enabled={enabledFeatures[feature.id]}
                onToggle={() => toggleFeature(feature.id)}
                onPress={() => openDemo(feature)}
              />
            ))}
          </View>

          <View style={styles.revolutionarySection}>
            <Text style={styles.revolutionaryTitle}>
              Why This Makes PEPULink Revolutionary
            </Text>
            <Text style={styles.revolutionaryText}>
              These AI features represent the cutting edge of financial technology, 
              providing unprecedented insights and automation to help you make better 
              financial decisions and maximize your returns in the crypto ecosystem.
            </Text>
          </View>
        </ScrollView>

        <DemoModal
          visible={showDemo}
          feature={selectedFeature}
          onClose={closeDemo}
        />
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  demoModeIndicator: {
    backgroundColor: 'rgba(76, 237, 196, 0.9)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  demoModeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  instructionText: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 30,
  },
  featuresGrid: {
    gap: 20,
  },
  featureCard: {
    marginBottom: 20,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIcon: {
    fontSize: 40,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
    lineHeight: 20,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    color: '#4ECDC4',
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  featureText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
  exploreButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  revolutionarySection: {
    backgroundColor: 'rgba(76, 237, 196, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginTop: 30,
    marginBottom: 40,
  },
  revolutionaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 15,
    textAlign: 'center',
  },
  revolutionaryText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
    position: 'relative',
  },
  modalIcon: {
    fontSize: 80,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: -40,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  demoSection: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  demoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  demoText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  demoContent: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  demoDataText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  cryptoDemo: {
    alignItems: 'center',
  },
  behavioralDemo: {
    alignItems: 'center',
  },
  investmentDemo: {
    alignItems: 'center',
  },
  voiceDemo: {
    alignItems: 'center',
  },
  voiceButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  voiceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securityDemo: {
    alignItems: 'center',
  },
  personalizationDemo: {
    alignItems: 'center',
  },
});
