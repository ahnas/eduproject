import axios from 'axios';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleHello() {
    const message = this.createChatBotMessage('Hello! How can I assist you today?');
    this.updateChatbotState(message);
  }

  handleEmptySearch() {
    const message = this.createChatBotMessage('Please provide a query after "search".');
    this.updateChatbotState(message);
  }

  async handleSearch(query) {
    const apiKey = 'YOUR_GOOGLE_API_KEY';
    const cx = 'YOUR_CUSTOM_SEARCH_ENGINE_ID';
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;

    try {
      const response = await axios.get(url);
      const searchResults = response.data.items.map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      }));

      const message = this.createChatBotMessage(
        'Here are the search results:',
        {
          widget: 'searchResults',
          data: searchResults,
        }
      );
      this.updateChatbotState(message);
    } catch (error) {
      const message = this.createChatBotMessage('Sorry, there was an error fetching the search results.');
      this.updateChatbotState(message);
    }
  }

  handleUnknown() {
    const message = this.createChatBotMessage("I'm not sure I understand. Could you rephrase?");
    this.updateChatbotState(message);
  }

  updateChatbotState(message) {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

export default ActionProvider;
