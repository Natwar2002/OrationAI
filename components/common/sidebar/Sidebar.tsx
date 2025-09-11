"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Plus, 
  ChevronLeft,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  date: string;
}

interface SidebarProps {
  conversations: Conversation[];
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
}

export default function Sidebar({
  conversations,
  onNewChat,
  onSelectConversation
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className={cn(
          "flex items-center gap-2 overflow-hidden transition-all",
          isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
        )}>
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Counselor</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-2">
        <Button
          onClick={onNewChat}
          className={cn(
            "w-full justify-start gap-2",
            isCollapsed && "px-2"
          )}
        >
          <Plus className="h-4 w-4" />
          <span className={cn("transition-all", isCollapsed && "hidden")}>
            New Chat
          </span>
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {isCollapsed ? (
            // Collapsed view - single chat icon that expands sidebar on click
            <div className="flex justify-center py-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setIsCollapsed(false)}
                title="Show conversations"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            // Expanded view - full conversation list
            conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                className="w-full justify-start gap-2 h-12 font-normal"
                onClick={() => onSelectConversation(conversation.id)}
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="truncate text-sm">{conversation.title}</span>
                  <span className="text-xs text-muted-foreground">{conversation.date}</span>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}