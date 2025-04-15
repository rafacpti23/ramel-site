/**
 * Service responsible for managing live chat functionality
 */
export class LiveChatService {
  /**
   * Updates the live chat script dynamically
   */
  static updateLiveChat(liveChatEnabled: boolean, chatButtonText: string, liveChatCode: string): void {
    // Remove any existing Tawk.to script
    const existingScript = document.getElementById('tawk-script');
    if (existingScript) {
      existingScript.remove();
    }

    // If chat is disabled, simply return - don't add any script
    if (!liveChatEnabled) return;

    // Create a new script element
    const tawkScript = document.createElement('script');
    tawkScript.id = 'tawk-script';
    tawkScript.type = 'text/javascript';
    
    // If custom code is provided, use it
    if (liveChatCode.trim()) {
      tawkScript.innerHTML = liveChatCode;
    } else {
      // Otherwise, use the default Tawk.to configuration
      tawkScript.innerHTML = `
        var Tawk_API=Tawk_API||{};
        Tawk_API.customStyle = {
          zIndex: 1000,
          visibility: {
            desktop: {
              bubble: true,
              text: "${chatButtonText}"
            },
            mobile: {
              bubble: true,
              text: "${chatButtonText}"
            }
          }
        };
        Tawk_LoadStart=new Date();
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
  }
}
