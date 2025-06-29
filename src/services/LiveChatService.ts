
/**
 * Service responsible for managing live chat functionality
 */
export class LiveChatService {
  /**
   * Validates if a string contains potential script injection
   */
  static isScriptSafe(code: string): boolean {
    if (!code) return true;
    
    // Check for common script injection patterns
    const dangerousPatterns = [
      /<script[^>]*src=/i,  // External script loading
      /document\.cookie/i,  // Cookie manipulation
      /localStorage\./i,    // LocalStorage access
      /sessionStorage\./i,  // SessionStorage access
      /eval\(/i,            // eval() function
      /fetch\(['"]https?:\/\/(?!embed\.tawk\.to)/i, // fetch to unauthorized domains
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(code));
  }
  
  /**
   * Updates the live chat script dynamically
   */
  static updateLiveChat(liveChatEnabled: boolean, chatButtonText: string, liveChatCode: string): void {
    // Remove any existing Tawk.to script
    const existingScript = document.getElementById('tawk-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Remove any existing chat widget
    const existingWidget = document.querySelector('.tawk-chat-widget-container');
    if (existingWidget) {
      existingWidget.remove();
    }

    // If chat is disabled, simply return - don't add any script
    if (!liveChatEnabled) return;
    
    // Basic security check for custom code
    if (liveChatCode && !this.isScriptSafe(liveChatCode)) {
      console.error("Potentially unsafe script detected in live chat code");
      return;
    }

    try {
      // Create a new script element
      const tawkScript = document.createElement('script');
      tawkScript.id = 'tawk-script';
      tawkScript.type = 'text/javascript';
      
      // If custom code is provided, use it
      if (liveChatCode && liveChatCode.trim()) {
        tawkScript.innerHTML = liveChatCode;
      } else {
        // Otherwise, use the default Tawk.to configuration
        tawkScript.innerHTML = `
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          
          Tawk_API.onLoad = function(){
            console.log('Tawk chat loaded');
            // Força o posicionamento do widget no lado esquerdo
            var chatWidget = document.querySelector('.tawk-chat-widget-container');
            if (chatWidget) {
              chatWidget.style.left = '20px';
              chatWidget.style.right = 'auto';
            }
            
            // Também força o posicionamento do minimized widget
            var minimizedWidget = document.querySelector('.tawk-minimized-widget');
            if (minimizedWidget) {
              minimizedWidget.style.left = '20px';
              minimizedWidget.style.right = 'auto';
            }
          };
          
          Tawk_API.customStyle = {
            zIndex: 1000,
            visibility: {
              desktop: {
                position: 'bl',
                xOffset: 20,
                yOffset: 20
              },
              mobile: {
                position: 'bl',
                xOffset: 20,
                yOffset: 20
              }
            }
          };
          
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/67fd89792656e4190ca976b2/1ior6215a';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `;
      }
      
      // Add the script to the document body
      document.body.appendChild(tawkScript);
      
      // Adicionar estilos CSS para forçar posicionamento à esquerda
      const style = document.createElement('style');
      style.textContent = `
        .tawk-chat-widget-container,
        .tawk-minimized-widget {
          left: 20px !important;
          right: auto !important;
        }
      `;
      document.head.appendChild(style);
      
    } catch (error) {
      console.error("Erro ao adicionar script do chat:", error);
    }
  }
}
