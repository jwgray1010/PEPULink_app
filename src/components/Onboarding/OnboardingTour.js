import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanGestureHandler,
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const OnboardingStep = ({ step, onNext, onPrev, onSkip, onFinish, isFirst, isLast }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for illustration
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Continuous rotation for certain steps
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    );

    pulse.start();
    if (step.illustration === '🤖' || step.illustration === '⚡') {
      rotate.start();
    }

    return () => {
      pulse.stop();
      rotate.stop();
    };
  }, [step]);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onNext();
  };

  const handlePrev = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPrev();
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onSkip();
  };

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onFinish();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View 
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.illustrationContainer}>
        <Animated.View
          style={{
            transform: [
              { scale: pulseAnim },
              { rotate: step.illustration === '🤖' || step.illustration === '⚡' ? rotation : '0deg' }
            ]
          }}
        >
          <Text style={styles.illustration}>{step.illustration}</Text>
        </Animated.View>
        
        {/* Floating particles for visual appeal */}
        {step.particles && (
          <View style={styles.particlesContainer}>
            {step.particles.map((particle, index) => (
              <FloatingParticle key={index} emoji={particle} delay={index * 200} />
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepDescription}>{step.description}</Text>
        
        {step.features && (
          <View style={styles.featuresContainer}>
            {step.features.map((feature, index) => (
              <Animated.View 
                key={index} 
                style={[
                  styles.featureItem,
                  {
                    transform: [{
                      translateX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, 0],
                      })
                    }]
                  }
                ]}
              >
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Interactive demo for certain steps */}
        {step.interactive && (
          <View style={styles.interactiveDemo}>
            {step.interactive}
          </View>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton, isFirst && styles.disabledButton]}
            onPress={handlePrev}
            disabled={isFirst}
            activeOpacity={0.8}
          >
            <Text style={[styles.navButtonText, isFirst && styles.disabledText]}>
              ← Previous
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={isLast ? handleFinish : handleNext}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#4ECDC4', '#44A08D']}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {isLast ? '🚀 Get Started' : 'Next →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {!isLast && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip Tour</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

// Floating particle component for visual appeal
const FloatingParticle = ({ emoji, delay = 0 }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(floatAnim, {
            toValue: -30,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 2500,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.Text
      style={[
        styles.particle,
        {
          opacity: opacityAnim,
          transform: [{ translateY: floatAnim }],
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
};
};

const ProgressIndicator = ({ currentStep, totalSteps }) => (
  <View style={styles.progressContainer}>
    {Array.from({ length: totalSteps }, (_, index) => (
      <View
        key={index}
        style={[
          styles.progressDot,
          index <= currentStep && styles.progressDotActive
        ]}
      />
    ))}
  </View>
);

export default function OnboardingTour({ visible, onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      title: 'Welcome to PEPULink',
      description: 'Your gateway to seamless Web3 payments and smart financial management.',
      illustration: '🚀',
      particles: ['⭐', '✨', '💫'],
      features: [
        { icon: '🔗', text: 'Connect Web3 wallets instantly' },
        { icon: '💳', text: 'Manage multiple cards' },
        { icon: '📱', text: 'Scan QR codes for payments' }
      ]
    },
    {
      title: 'Smart AI Assistant',
      description: 'Get personalized spending insights and financial recommendations powered by AI.',
      illustration: '🤖',
      particles: ['💡', '🧠', '⚡'],
      features: [
        { icon: '📊', text: 'Real-time spending analysis' },
        { icon: '💡', text: 'Smart saving suggestions' },
        { icon: '🎯', text: 'Budget optimization tips' }
      ]
    },
    {
      title: 'QR Code Payments',
      description: 'Make instant payments by scanning QR codes or generate your own for receiving money.',
      illustration: '📱',
      particles: ['📷', '💰', '⚡'],
      features: [
        { icon: '🔍', text: 'Scan to pay instantly' },
        { icon: '💰', text: 'Generate payment QR codes' },
        { icon: '🏪', text: 'Merchant payment support' }
      ]
    },
    {
      title: 'Professional Analytics',
      description: 'Track your spending with beautiful charts and comprehensive financial insights.',
      illustration: '📈',
      particles: ['📊', '💹', '📉'],
      features: [
        { icon: '📊', text: 'Interactive spending charts' },
        { icon: '📋', text: 'Category breakdowns' },
        { icon: '📅', text: 'Monthly comparisons' }
      ]
    },
    {
      title: 'Advanced Card Management',
      description: 'Manage multiple cards, set spending limits, and control your finances with ease.',
      illustration: '💳',
      particles: ['🔒', '⚡', '💎'],
      features: [
        { icon: '❄️', text: 'Freeze/unfreeze cards instantly' },
        { icon: '🎯', text: 'Set spending limits' },
        { icon: '🔔', text: 'Transaction notifications' }
      ]
    },
    {
      title: 'You\'re All Set!',
      description: 'Start exploring PEPULink and take control of your financial future today.',
      illustration: '🎉',
      particles: ['🎊', '🎈', '🌟', '✨', '💫'],
      features: [
        { icon: '✨', text: 'Secure and private' },
        { icon: '🚀', text: 'Lightning fast transactions' },
        { icon: '🌟', text: 'Premium user experience' }
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip && onSkip();
  };

  const handleFinish = () => {
    onComplete && onComplete();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <View style={styles.header}>
          <ProgressIndicator 
            currentStep={currentStep} 
            totalSteps={onboardingSteps.length} 
          />
        </View>

        <OnboardingStep
          step={onboardingSteps[currentStep]}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
          onFinish={handleFinish}
          isFirst={currentStep === 0}
          isLast={currentStep === onboardingSteps.length - 1}
        />
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  illustration: {
    fontSize: 120,
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 38,
  },
  stepDescription: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 30,
  },
  featuresContainer: {
    marginTop: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
  actionsContainer: {
    paddingBottom: 40,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  prevButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  nextButton: {
    overflow: 'hidden',
  },
  nextButtonGradient: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 25,
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledText: {
    color: 'rgba(255,255,255,0.5)',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  particle: {
    position: 'absolute',
    fontSize: 20,
    top: Math.random() * 200,
    left: Math.random() * 200,
  },
  interactiveDemo: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    alignItems: 'center',
  },
});
