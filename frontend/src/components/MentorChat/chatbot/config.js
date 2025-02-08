import { createChatBotMessage } from 'react-chatbot-kit';
import SearchResultsWidget from './SearchResultsWidget';

const config = {
  botName: 'MentorBot',
  initialMessages: [createChatBotMessage('Hi! How can I help you?')],
  customComponents: {},
  widgets: [
    {
      widgetName: 'searchResults',
      widgetFunc: (props) => <SearchResultsWidget {...props} />,
      mapStateToProps: ['data'],
    },
  ],
};

export default config;
