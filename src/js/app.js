import Messenger from './Tickets';

const chat = new Messenger(document);

chat.addListenerClick(chat.addUser);
chat.sendMessage();
chat.onMsg();
chat.onClose();
