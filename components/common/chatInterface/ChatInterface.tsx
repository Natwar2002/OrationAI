"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bot,
  User as UserIcon,
  ArrowUp
} from "lucide-react";
import { useCreateMessage } from "@/lib/hooks/useMessages";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  conversationId: string
  timestamp: Date;
}

interface ChatInterfaceProps {
  className?: string;
  conversationId: string;
}

export default function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your counselor. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
      conversationId: '123'
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the tRPC mutation hook with proper destructuring
  const createMessageMutation = useCreateMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input || input.trim().length === 0) return;

    // Store the input before clearing it
    const messageText = input.trim();
    setInput("");

    // Add user message to local state immediately for better UX
    const tempMessageId = `temp-${Date.now()}`;
    const userMessage: Message = {
      id: tempMessageId,
      content: messageText,
      role: "user",
      timestamp: new Date(),
      conversationId: '123'
    };

    setMessages((prev) => [...prev, userMessage]);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      // Send message to server using tRPC mutation with correct parameters
      const result = await createMessageMutation.mutateAsync({
        conversationId: '123',
        content: messageText,
        senderId: "current-user-id", // Replace with actual user ID from your auth system
        type: "text"
      });

      // Replace temporary message with server-generated message
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessageId 
          ? { 
              id: result.id, 
              conversationId: '123',
              content: result.content, 
              role: "user", // Since this is the user's message
              timestamp: new Date(result.createdAt)
            }
          : msg
      ));

      // Simulate assistant response after a delay
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I understand how you feel. Could you tell me more about what's been on your mind lately?",
          role: "assistant",
          conversationId: '123',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }, 1000);

    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove the temporary message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessageId));
      // Restore the input if sending failed
      setInput(messageText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // Check if input is empty or contains only whitespace
  const isInputEmpty = !input || input.trim().length === 0;

  return (
    <div ref={containerRef} className={`flex flex-col h-full ${className}`}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className={`max-w-[70%] rounded-lg px-4 py-2 ${message.role === "user" 
              ? "bg-primary text-primary-foreground ml-auto" 
              : "bg-muted"}`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            {message.role === "user" && (
              <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  <UserIcon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="min-h-[44px] max-h-[120px] resize-none py-3 overflow-hidden"
            rows={1}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            disabled={createMessageMutation.isPending}
          />
          <Button 
            onClick={handleSend} 
            size="icon" 
            className="h-11 w-11 shrink-0"
            disabled={isInputEmpty || createMessageMutation.isPending}
          >
            {createMessageMutation.isPending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Counselor is designed to provide supportive listening and resources.
        </p>
      </div>
    </div>
  );
}