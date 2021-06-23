import Tickets from './Tickets';

const ticket = new Tickets(document);

ticket.onLoad();
ticket.addListenerClick(ticket.addTicket);
ticket.addListenerClick(ticket.cancel);
ticket.addListenerClick(ticket.create);
ticket.addListenerClick(ticket.ticketDrop);
ticket.addListenerClick(ticket.editTicket);
ticket.addListenerClick(ticket.remove);
ticket.addListenerClick(ticket.okRemove);
