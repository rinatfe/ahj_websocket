import { time } from './time';

export default class Messenger {
  constructor(obj) {
    this.obj = obj;
    this.xhr = new XMLHttpRequest();
    this.ws = new WebSocket('ws:websocket-server-heroku.herokuapp.com/');
    this.button = obj.querySelector('.continueButton');
    this.nickNameInput = obj.querySelector('.description-input');
    this.chatWindow = obj.querySelector('.field-container');
    this.modal = obj.querySelector('.modal');
    this.listUsers = obj.querySelector('.list-users');
    this.inputField = obj.querySelector('.entry');
    this.messages = obj.querySelector('.messages');
    this.currentName = null;

    this.addListenerClick = this.addListenerClick.bind(this);
    this.addListenerLoad = this.addListenerLoad.bind(this);
    this.addUser = this.addUser.bind(this);
    this.renderUsers = this.renderUsers.bind(this);
    this.onMsg = this.onMsg.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  addListenerClick(fn) {
    this.obj.addEventListener('click', fn);
  }

  addListenerLoad(fn, el) {
    this.xhr.addEventListener('load', function da() {
      fn(el);
      this.removeEventListener('load', da);
    });
  }

  removeListenerLoad(fn, el) {
    this.xhr.removeEventListener('load', () => fn(el));
  }

  addUser(e) {
    if (e.target.classList.contains('continueButton')) {
      this.xhr.open('GET', `https://websocket-server-heroku.herokuapp.com/?method=findUser&name=${this.nickNameInput.value}`);
      this.xhr.send();
      this.currentName = this.nickNameInput.value;
      this.addListenerLoad(this.renderUsers);
    }
  }

  renderUsers() {
    if (this.xhr.status >= 200 && this.xhr.status < 300) {
      const result = JSON.parse(this.xhr.responseText);
      console.log(result);
      if (result) {
        this.chatWindow.style.display = 'flex';
        for (const i of result) {
          if (i.name === this.currentName) {
            this.listUsers.insertAdjacentHTML('afterbegin',
              `<div class="user">
                <div class="avatar"></div>
                <div class="nickname">You</div>
              </div>`);
          } else {
            this.listUsers.insertAdjacentHTML('afterbegin',
              `<div class="user">
            <div class="avatar"></div>
            <div class="nickname">${i.name}</div>
          </div>`);
          }
        }
        this.modal.style.display = 'none';
      } else {
        alert('Такой пользователь уже авторизирован');
      }
    }
  }

  sendMessage() {
    this.inputField.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.ws.send(JSON.stringify(
        { // eslint-disable-line
          name: this.currentName,// eslint-disable-line
          time: time(),// eslint-disable-line
          message: this.inputField.value// eslint-disable-line
        }));// eslint-disable-line
        this.inputField.value = '';
      }
    });
  }

  onMsg() {
    this.ws.onmessage = (e) => {
      this.renderMessages(e.data);
    };
  }

  renderMessages(data) {
    const result = JSON.parse(data);
    console.log(result);
    this.messages.innerHTML = '';
    for (const i of result) {
      if (i.name === this.currentName) {
        this.messages.insertAdjacentHTML('beforeend',
          `<div class="message true">
          <div class="attributes">
            <span class="nicknameChat">You</span>
            <span class="time">${i.time}</span>
          </div>
          <span class="record">${i.message}</span>
        </div>`);
      } else {
        this.messages.insertAdjacentHTML('beforeend',
          `<div class="message">
          <div class="attributes">
            <span class="nicknameChat">${i.name}</span>
            <span class="time">${i.time}</span>
          </div>
          <span class="record">${i.message}</span>
        </div>`);
      }
    }
  }

  onClose() {
    window.addEventListener('beforeunload', () => {
      this.ws.close(1000);
      navigator.sendBeacon('https://websocket-server-heroku.herokuapp.com/?method=deleteUser', JSON.stringify(this.currentName));
    });
  }
}
