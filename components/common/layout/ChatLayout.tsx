"use client";

import { useState } from 'react';
import Sidebar from '@/components/common/sidebar/Sidebar';
import ChatInterface from '@/components/common/chatInterface/ChatInterface';
import ThemeToggle from '@/components/common/theme/ThemeToggle';

export default function ChatLayout() {
  const [conversations, setConversations] = useState([
    { id: '1', title: 'Discussion about mental health', date: 'Today' },
    { id: '2', title: 'Coping with anxiety techniques', date: 'Yesterday' },
    { id: '3', title: 'Stress management session', date: 'Oct 12' },
  ]);

  const handleNewChat = () => {
    console.log('New chat created');
  };

  const handleSelectConversation = (id: string) => {
    console.log('Selected conversation:', id);
  };

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      <Sidebar
        conversations={conversations}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex justify-between items-center p-4 border-b shrink-0">
          <h1 className="text-xl font-semibold">Counselor Chat</h1>
          <ThemeToggle />
        </header>
        <ChatInterface className="flex-1 overflow-hidden" />
      </div>
    </div>
  );
}