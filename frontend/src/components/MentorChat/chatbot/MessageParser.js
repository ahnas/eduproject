class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      const lowerCaseMessage = message.toLowerCase();
  
      if (lowerCaseMessage.includes('hello')) {
        this.actionProvider.handleHello();
      } else if (lowerCaseMessage.includes('search')) {
        const query = message.replace('search', '').trim();
        if (query) {
          this.actionProvider.handleSearch(query);
        } else {
          this.actionProvider.handleEmptySearch();
        }
      } else {
        this.actionProvider.handleUnknown();
      }
    }
  }
  
  export default MessageParser;
  