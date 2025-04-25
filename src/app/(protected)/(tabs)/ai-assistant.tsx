import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import {
  Box,
  Button,
  Input,
  InputField,
  Text,
  VStack,
  HStack,
} from '@/components/ui';
import { Bot, Send } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ApiResponse {
  output: string;
}

export default function AIAssistantScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://nospendchallenge.app.n8n.cloud/webhook/fb2a81cd-42c9-40a1-83af-c0a327b0edb5',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatInput: userMessage.text }),
        },
      );

      const data = (await response.json()) as ApiResponse;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.output || 'Sorry, I could not process your request.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error processing your request.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <Box
      className={`my-1 max-w-[80%] rounded-lg p-3 ${
        item.isUser
          ? 'self-end bg-blue-500'
          : 'self-start bg-gray-200 dark:bg-gray-700'
      }`}>
      <Text
        className={item.isUser ? 'text-white' : 'text-black dark:text-white'}>
        {item.text}
      </Text>
      <Text
        className={`text-xs ${item.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'} mt-1 text-right`}>
        {item.timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </Box>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <VStack style={{ flex: 1 }}>
          <Box className="flex-row items-center bg-white p-4 dark:bg-black">
            <Bot size={24} color={isDark ? 'white' : 'black'} />
            <Text className="ml-2 text-xl font-bold text-black dark:text-white">
              {t('ai_assistant.title')}
            </Text>
          </Box>

          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16 }}
            inverted={false}
            style={{
              flex: 1,
              backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
            }}
          />

          <HStack className="border-t border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-black">
            <Input
              className="mr-2 flex-1"
              variant="outline"
              size="md"
              isDisabled={isLoading}>
              <InputField
                className="bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
                value={inputMessage}
                onChangeText={setInputMessage}
                placeholder={t('ai_assistant.message_placeholder')}
              />
            </Input>
            <Button
              onPress={sendMessage}
              isDisabled={isLoading || !inputMessage.trim()}
              className={isLoading ? 'opacity-50' : ''}>
              <Send size={20} color="white" />
            </Button>
          </HStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
