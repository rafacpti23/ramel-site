
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

interface LiveChatPreviewProps {
  chatButtonText: string;
  liveChatEnabled: boolean;
}

const LiveChatPreview = ({ chatButtonText, liveChatEnabled }: LiveChatPreviewProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the preview after a short delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!liveChatEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-48 border border-dashed border-muted-foreground/50 rounded-md bg-secondary/30 p-4">
        <MessageCircle className="text-muted-foreground h-12 w-12 mb-2 opacity-30" />
        <p className="text-muted-foreground text-center">
          Chat ao vivo está desativado.<br />Ative-o para visualizar o botão.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-48 border border-muted-foreground/20 rounded-md bg-secondary/30 overflow-hidden">
      <div className="absolute bottom-0 right-0 m-4">
        <div 
          className={`
            transition-all duration-500 transform
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
          `}
        >
          <button
            className="relative group flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-all"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">{chatButtonText || "Estamos aqui!"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChatPreview;
