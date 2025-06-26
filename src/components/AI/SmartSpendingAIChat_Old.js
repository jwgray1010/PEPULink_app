import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Vibration,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

// Advanced AI Response Engine
class AIEngine {
  constructor() {
    this.userProfile = {
      spendingPatterns: {},
      preferences: {},
      goals: {},
      behaviorHistory: []
    };
    this.contextMemory = [];
    this.learningData = new Map();
  }

  // Analyze user spending patterns with ML-like algorithms
  analyzeSpendingPatterns(transactions) {
    const patterns = {
      timeBasedTrends: this.detectTimeBasedTrends(transactions),
      categoryPreferences: this.analyzeCategoryPreferences(transactions),
      anomalies: this.detectSpendingAnomalies(transactions),
      seasonality: this.detectSeasonalPatterns(transactions),
      prediction: this.predictFutureSpending(transactions)
    };
    
    return patterns;
  }

  // Detect time-based spending trends
  detectTimeBasedTrends(transactions) {
    const weekdaySpending = {};
    const hourlySpending = {};
    
    transactions.forEach(tx => {
      const date = new Date(tx.date);
      const weekday = date.getDay();
      const hour = date.getHours();
      
      weekdaySpending[weekday] = (weekdaySpending[weekday] || 0) + tx.amount;
      hourlySpending[hour] = (hourlySpending[hour] || 0) + tx.amount;
    });

    return {
      weekdaySpending,
      hourlySpending,
      peakSpendingDay: Object.keys(weekdaySpending).reduce((a, b) => 
        weekdaySpending[a] > weekdaySpending[b] ? a : b
      ),
      peakSpendingHour: Object.keys(hourlySpending).reduce((a, b) => 
        hourlySpending[a] > hourlySpending[b] ? a : b
      )
    };
  }

  // Advanced category preference analysis
  analyzeCategoryPreferences(transactions) {
    const categoryTotals = {};
    const categoryFrequency = {};
    const categoryGrowth = {};

    transactions.forEach(tx => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      categoryFrequency[tx.category] = (categoryFrequency[tx.category] || 0) + 1;
    });

    const totalSpending = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    
    return Object.keys(categoryTotals).map(category => ({
      category,
      amount: categoryTotals[category],
      percentage: (categoryTotals[category] / totalSpending * 100).toFixed(1),
      frequency: categoryFrequency[category],
      avgTransaction: (categoryTotals[category] / categoryFrequency[category]).toFixed(2)
    })).sort((a, b) => b.amount - a.amount);
  }

  // Detect spending anomalies using statistical analysis
  detectSpendingAnomalies(transactions) {
    const amounts = transactions.map(tx => tx.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((acc, amount) => acc + Math.pow(amount - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    
    const anomalies = transactions.filter(tx => 
      Math.abs(tx.amount - mean) > 2 * stdDev
    );

    return {
      anomalousTransactions: anomalies,
      mean: mean.toFixed(2),
      standardDeviation: stdDev.toFixed(2),
      anomalyThreshold: (mean + 2 * stdDev).toFixed(2)
    };
  }

  // Predict future spending using trend analysis
  predictFutureSpending(transactions) {
    const sortedTx = transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    const recentTrend = this.calculateTrend(sortedTx.slice(-30)); // Last 30 transactions
    
    const currentMonthTotal = this.getCurrentMonthSpending(transactions);
    const projectedMonthTotal = currentMonthTotal * (30 / new Date().getDate());
    
    return {
      trendDirection: recentTrend > 0 ? 'increasing' : 'decreasing',
      trendMagnitude: Math.abs(recentTrend).toFixed(2),
      projectedMonthlySpending: projectedMonthTotal.toFixed(2),
      confidenceLevel: this.calculatePredictionConfidence(transactions)
    };
  }

  // Generate contextual AI responses
  generateContextualResponse(query, userData) {
    const analysis = this.analyzeSpendingPatterns(userData.transactions || []);
    const context = this.buildContext(query, analysis, userData);
    
    return this.craftIntelligentResponse(query, context, analysis);
  }

  // Build conversation context
  buildContext(query, analysis, userData) {
    return {
      userSpendingTotal: userData.monthlySpending || 0,
      topCategory: analysis.categoryPreferences[0]?.category || 'Unknown',
      spendingTrend: analysis.prediction.trendDirection,
      anomalies: analysis.anomalies.anomalousTransactions.length,
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay()
    };
  }

  // Craft intelligent, contextual responses
  craftIntelligentResponse(query, context, analysis) {
    const lowerQuery = query.toLowerCase();
    
    // Advanced pattern matching with context
    if (lowerQuery.includes('spending') && lowerQuery.includes('tip')) {
      return this.generatePersonalizedTips(context, analysis);
    }
    
    if (lowerQuery.includes('predict') || lowerQuery.includes('forecast')) {
      return this.generatePredictionInsight(analysis);
    }
    
    if (lowerQuery.includes('anomaly') || lowerQuery.includes('unusual')) {
      return this.generateAnomalyAnalysis(analysis);
    }
    
    if (lowerQuery.includes('optimize') || lowerQuery.includes('improve')) {
      return this.generateOptimizationAdvice(context, analysis);
    }

    return this.generateDefaultResponse(context);
  }

  // Generate personalized spending tips
  generatePersonalizedTips(context, analysis) {
    const tips = [];
    
    if (context.spendingTrend === 'increasing') {
      tips.push(`🚨 I notice your spending is trending upward. Your ${context.topCategory} spending could be optimized.`);
    }
    
    if (context.timeOfDay >= 22 || context.timeOfDay <= 6) {
      tips.push(`🌙 Late night spending alert! Consider implementing a "sleep on it" rule for purchases after 10 PM.`);
    }
    
    if (analysis.categoryPreferences.length > 0) {
      const topCat = analysis.categoryPreferences[0];
      tips.push(`💡 ${topCat.category} is your largest category at $${topCat.amount}. Try the 24-hour rule before purchases.`);
    }

    return tips.join('\n\n') || "Here are some personalized tips based on your spending patterns...";
  }

  // Helper methods
  calculateTrend(transactions) {
    if (transactions.length < 2) return 0;
    const recent = transactions.slice(-10).reduce((acc, tx) => acc + tx.amount, 0);
    const older = transactions.slice(-20, -10).reduce((acc, tx) => acc + tx.amount, 0);
    return recent - older;
  }

  getCurrentMonthSpending(transactions) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
      })
      .reduce((acc, tx) => acc + tx.amount, 0);
  }

  calculatePredictionConfidence(transactions) {
    const consistency = this.calculateSpendingConsistency(transactions);
    return Math.min(95, Math.max(60, consistency * 100));
  }

  calculateSpendingConsistency(transactions) {
    const amounts = transactions.map(tx => tx.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((acc, amount) => acc + Math.pow(amount - mean, 2), 0) / amounts.length;
    const coefficientOfVariation = Math.sqrt(variance) / mean;
    return Math.max(0, 1 - coefficientOfVariation);
  }
}

// Initialize AI Engine
const aiEngine = new AIEngine();

const AIMessage = ({ message, isUser, timestamp, onSpeak, showActions }) => (
  <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
    <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
      <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
        {message}
      </Text>
      <View style={styles.messageFooter}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        {!isUser && showActions && (
          <View style={styles.messageActions}>
            <TouchableOpacity onPress={onSpeak} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>🔊</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>👍</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  </View>
);

const TypingIndicator = ({ visible }) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const animateTyping = () => {
        const animation = Animated.sequence([
          Animated.timing(dot1, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.parallel([
            Animated.timing(dot1, { toValue: 0, duration: 400, useNativeDriver: true }),
            Animated.timing(dot2, { toValue: 0, duration: 400, useNativeDriver: true }),
            Animated.timing(dot3, { toValue: 0, duration: 400, useNativeDriver: true }),
          ])
        ]);
        
        Animated.loop(animation).start();
      };
      
      animateTyping();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <Text style={styles.typingText}>AI is thinking</Text>
        <View style={styles.typingDots}>
          <Animated.View style={[styles.typingDot, { opacity: dot1 }]} />
          <Animated.View style={[styles.typingDot, { opacity: dot2 }]} />
          <Animated.View style={[styles.typingDot, { opacity: dot3 }]} />
        </View>
      </View>
    </View>
  );
};

const SmartSuggestions = ({ suggestions, onSuggestionPress, userContext }) => {
  // Generate contextual suggestions based on time, spending patterns, etc.
  const getContextualSuggestions = () => {
    const hour = new Date().getHours();
    const contextual = [];
    
    if (hour >= 9 && hour <= 11) {
      contextual.push("☕ Morning spending check");
    } else if (hour >= 12 && hour <= 14) {
      contextual.push("🍽️ Lunch budget analysis");
    } else if (hour >= 18 && hour <= 20) {
      contextual.push("🌆 Evening spending review");
    }
    
    if (userContext?.hasHighSpending) {
      contextual.push("⚠️ Optimize high spending areas");
    }
    
    return [...contextual, ...suggestions];
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
      {getContextualSuggestions().map((suggestion, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.suggestionChip} 
          onPress={() => onSuggestionPress(suggestion)}
        >
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default function SmartSpendingAIChat({ visible, onClose, spendingData = {} }) {
  // Enhanced state management
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userContext, setUserContext] = useState({});
  const [conversationMode, setConversationMode] = useState('casual'); // casual, detailed, expert
  
  const scrollViewRef = useRef();
  const inputRef = useRef();

  // Mock transaction data for AI analysis
  const mockTransactions = [
    { id: 1, amount: 45.50, category: 'Dining', date: '2024-06-20', merchant: 'Starbucks' },
    { id: 2, amount: 120.00, category: 'Shopping', date: '2024-06-19', merchant: 'Amazon' },
    { id: 3, amount: 28.75, category: 'Transport', date: '2024-06-18', merchant: 'Uber' },
    { id: 4, amount: 85.30, category: 'Dining', date: '2024-06-17', merchant: 'Restaurant' },
    { id: 5, amount: 15.20, category: 'Coffee', date: '2024-06-16', merchant: 'Local Cafe' },
  ];

  const smartSuggestions = [
    "📊 Analyze my spending patterns",
    "🎯 Set smart budget goals",
    "💡 Get personalized saving tips",
    "� Predict next month's spending",
    "⚡ Quick expense breakdown",
    "🏆 Show my financial wins",
    "🚨 Identify spending alerts"
  ];

  // Initialize conversation with personalized greeting
  useEffect(() => {
    if (visible && messages.length === 0) {
      initializeConversation();
    }
  }, [visible]);

  const initializeConversation = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const analysis = aiEngine.analyzeSpendingPatterns(mockTransactions);
      const greeting = generatePersonalizedGreeting(analysis);
      
      setMessages([{
        id: Date.now(),
        message: greeting,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      
      setUserContext({
        totalSpending: spendingData.total || 1280,
        topCategory: analysis.categoryPreferences[0]?.category || 'Dining',
        hasHighSpending: (spendingData.total || 1280) > 1200,
        spendingTrend: analysis.prediction?.trendDirection || 'stable'
      });
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const generatePersonalizedGreeting = (analysis) => {
    const hour = new Date().getHours();
    let timeGreeting = "Hello";
    
    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 18) timeGreeting = "Good afternoon";
    else timeGreeting = "Good evening";

    const topCategory = analysis.categoryPreferences[0]?.category || 'spending';
    const insight = analysis.prediction?.trendDirection === 'increasing' 
      ? "I notice your spending has been trending upward lately." 
      : "Your spending patterns look quite stable.";

    return `${timeGreeting}! I'm your AI financial assistant. I've analyzed your recent transactions and ${insight}\n\n💡 Your top spending category is ${topCategory}. I have some personalized insights that could help you optimize your finances.\n\nWhat would you like to explore today?`;
  };

  const handleSendMessage = async (customMessage = null) => {
    const messageText = customMessage || inputText.trim();
    if (!messageText || isTyping) return;

    // Add haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMessage = {
      id: Date.now(),
      message: messageText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI processing with realistic delay
    const processingTime = Math.random() * 2500 + 1500; // 1.5-4 seconds
    
    setTimeout(async () => {
      const response = aiEngine.generateContextualResponse(messageText, {
        transactions: mockTransactions,
        monthlySpending: userContext.totalSpending,
        context: userContext
      });

      const aiMessage = {
        id: Date.now() + 1,
        message: response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Auto-speak AI responses if voice is enabled
      if (voiceEnabled) {
        speakMessage(response);
      }

      // Provide haptic feedback for AI response
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, processingTime);
  };

  const speakMessage = (text) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
      voice: 'com.apple.ttsbundle.Samantha-compact'
    });
  };

  const handleVoiceToggle = () => {
    setVoiceEnabled(!voiceEnabled);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!voiceEnabled) {
      speakMessage("Voice responses enabled");
    }
  };

  const clearConversation = () => {
    Alert.alert(
      "Clear Conversation",
      "Are you sure you want to clear the chat history?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: () => {
            setMessages([]);
            initializeConversation();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Enhanced Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <View style={styles.aiAvatar}>
                <Text style={styles.avatarText}>🤖</Text>
                {isTyping && <View style={styles.typingDot} />}
              </View>
              <View style={styles.headerText}>
                <Text style={styles.aiName}>SmartSpend AI</Text>
                <Text style={styles.aiStatus}>
                  {isAnalyzing ? 'Analyzing patterns...' : 
                   isTyping ? 'Generating insights...' : 'Ready to help'}
                </Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleVoiceToggle} style={styles.headerButton}>
                <Text style={[styles.headerButtonText, voiceEnabled && styles.activeButton]}>
                  {voiceEnabled ? '🔊' : '🔇'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={clearConversation} style={styles.headerButton}>
                <Text style={styles.headerButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages Container */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {/* Analysis Loading State */}
            {isAnalyzing && messages.length === 0 && (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisText}>🔍 Analyzing your spending patterns...</Text>
                <Text style={styles.analysisSubtext}>This may take a moment</Text>
              </View>
            )}

            {/* Messages */}
            {messages.map((msg, index) => (
              <AIMessage
                key={msg.id}
                message={msg.message}
                isUser={msg.isUser}
                timestamp={msg.timestamp}
                onSpeak={() => speakMessage(msg.message)}
                showActions={!msg.isUser && index === messages.length - 1}
              />
            ))}
            
            {/* Typing Indicator */}
            <TypingIndicator visible={isTyping} />
          </ScrollView>

          {/* Smart Suggestions */}
          {!isTyping && messages.length > 0 && (
            <SmartSuggestions 
              suggestions={smartSuggestions}
              onSuggestionPress={handleSendMessage}
              userContext={userContext}
            />
          )}

          {/* Enhanced Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                placeholder="Ask me about your spending..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => handleSendMessage()}
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
                onPress={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
              >
                <Text style={styles.sendButtonText}>
                  {isTyping ? '⏳' : '🚀'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Input Tools */}
            <View style={styles.inputTools}>
              <Text style={styles.characterCount}>{inputText.length}/500</Text>
              <Text style={styles.inputHint}>
                💡 Try: "analyze my spending" or "set budget goals"
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Modal>
  );
                  <Animated.View 
                    style={[
                      styles.typingIndicator,
                      {
                        opacity: typingAnimation
                      }
                    ]}
                  >
                    <Text style={styles.typingText}>● ● ●</Text>
                  </Animated.View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick Suggestions */}
          <ScrollView 
            horizontal 
            style={styles.suggestionsContainer}
            showsHorizontalScrollIndicator={false}
          >
            {quickSuggestions.map((suggestion, index) => (
              <QuickSuggestion
                key={index}
                suggestion={suggestion}
                onPress={handleSendMessage}
              />
            ))}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask me about your spending..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={() => handleSendMessage()}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendText}>➤</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  
  // Enhanced Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  aiAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 24,
  },
  typingDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
  },
  headerText: {
    flex: 1,
  },
  aiName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  aiStatus: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerButtonText: {
    fontSize: 16,
  },
  activeButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.3)',
  },
  
  // Analysis Loading Styles
  analysisContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  analysisText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  analysisSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  
  // Messages Styles
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  messageContainer: {
    marginBottom: 15,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#fff',
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiBubble: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#333',
  },
  aiText: {
    color: '#fff',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  messageActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 14,
  },
  
  // Typing Indicator Styles
  typingContainer: {
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  typingBubble: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ECDC4',
    marginHorizontal: 1,
  },
  
  // Smart Suggestions Styles
  suggestionsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  suggestionChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  suggestionText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  
  // Enhanced Input Styles
  inputSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  textInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 5,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  sendButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  inputTools: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  inputHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
  },
});
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  typingIndicator: {
    paddingVertical: 8,
  },
  typingText: {
    color: '#fff',
    fontSize: 16,
    letterSpacing: 2,
  },
  suggestionsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  suggestionItem: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  suggestionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
    color: '#333',
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendText: {
    fontSize: 20,
    color: '#667eea',
    fontWeight: 'bold',
  },
});
