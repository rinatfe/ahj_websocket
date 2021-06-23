import { time } from './time';

export default class Tickets {
  constructor(obj) {
    this.obj = obj;
    this.xhr = new XMLHttpRequest();
    this.modal = this.obj.querySelector('.modal');
    this.description = this.obj.querySelector('.description-input');
    this.fulldescription = this.obj.querySelector('.full-description-input');
    this.field = this.obj.querySelector('.field');
    this.content = this.obj.querySelector('.content');
    this.descriptionTicket = this.obj.querySelector('.description-ticket');
    this.edit = this.obj.querySelector('.edit');
    this.modalRemove = this.obj.querySelector('.modal-remove');
    this.count = this.obj.querySelectorAll('.field-container');
    this.save = null;
    this.editing = null;

    this.addListenerClick = this.addListenerClick.bind(this);
    this.addListenerLoad = this.addListenerLoad.bind(this);
    this.addTicket = this.addTicket.bind(this);
    this.cancel = this.cancel.bind(this);
    this.removeListenerLoad = this.removeListenerLoad.bind(this);
    this.create = this.create.bind(this);
    this.ticketDrop = this.ticketDrop.bind(this);
    this.renderDrop = this.renderDrop.bind(this);
    this.render = this.render.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.renderDrop = this.renderDrop.bind(this);
    this.remove = this.remove.bind(this);
    this.okRemove = this.okRemove.bind(this);
    this.editTicket = this.editTicket.bind(this);
    this.createTarget = this.createTarget.bind(this);
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

  onLoad() {
    this.obj.addEventListener('DOMContentLoaded', () => {
      this.xhr.open('GET', 'http://localhost:7070/?method=allTickets');
      this.xhr.send();
      this.addListenerLoad(this.render);
    });
  }

  render() {
    if (this.xhr.status >= 200 && this.xhr.status < 300) {
      try {
        const data = JSON.parse(this.xhr.responseText);
        if (data.length > 0) {
          for (const i of data) {
            let check;
            if (i.status) {
              check = 'checked';
            } else {
              check = '';
            }

            this.field.insertAdjacentHTML('afterbegin',
              `<div class="ticket-container" data-id="${i.id}">
                            <input type="checkbox" class="check" ${check}></input>
                            <div class="content-container">
                                <span class="content" data-id="${i.id}">${i.name}</span>
                                <span class="description-ticket"></span>
                            </div>    
                            <div class='date'>${i.created}</div>
                            <div class="edit"></div>
                            <div class="remove"></div>
                        </div>`);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  addTicket(e) {
    if (e.target.classList.contains('add-ticket')) {
      this.modal.style.display = 'flex';
    }
  }

  cancel(e) {
    if (e.target.classList.contains('cancelButton')) {
      this.modal.style.display = 'none';
      this.description.value = '';
      this.fulldescription.value = '';
      this.modal.querySelector('.header-modal').innerText = 'Добавить тикет';
      this.editing = null;
    } else if (e.target.classList.contains('cancelBtn')) {
      this.modalRemove.style.display = 'none';
    }
  }

  create(e) {
    if (e.target.classList.contains('okButton')) {
      if (this.editing) {
        const arr = Array.from(this.editing.children);
        arr.find((x) => x.classList.contains('content-container')).firstElementChild.innerText = this.description.value;
        arr.find((x) => x.classList.contains('content-container')).lastElementChild.innerText = this.fulldescription.value;
        this.modal.style.display = 'none';
        this.description.value = '';
        this.fulldescription.value = '';
        this.modal.querySelector('.header-modal').innerText = 'Добавить тикет';
        this.editing = null;
      } else {
        this.xhr.open('POST', 'http://localhost:7070/?method=createTicket');
        this.xhr.send(JSON.stringify({
            id: null, // eslint-disable-line
            name: this.description.value, // eslint-disable-line
            description: this.fulldescription.value, // eslint-disable-line
            status: false, // eslint-disable-line
            created: time(),// eslint-disable-line
        }));
        this.addListenerLoad(this.createTarget, e);
      }
    }
  }

  createTarget(el) { // eslint-disable-line
    if (this.xhr.status >= 200 && this.xhr.status < 300) {
      try {
        const idArr = JSON.parse(this.xhr.responseText);
        this.field.insertAdjacentHTML('afterbegin',
          `<div class="ticket-container" data-id="${idArr.id}">
                    <input type="checkbox" class="check"></input>
                    <div class="content-container">
                        <span class="content" data-id="${idArr.id}">${this.description.value}</span>
                        <span class="description-ticket">${this.fulldescription.value}</span>
                    </div>    
                    <div class='date'>${time()}</div>
                    <div class="edit"></div>
                    <div class="remove"></div>
                </div>`);
      } catch (e) {
        console.error(e);
      }

      this.modal.style.display = 'none';
      this.description.value = '';
      this.fulldescription.value = '';
      this.modal.querySelector('.header-modal').innerText = 'Добавить тикет';
    }
  }

  ticketDrop(e) {
    if (e.target.classList.contains('content')) {
      if (e.target.nextElementSibling.style.display == 'block') { // eslint-disable-line
        e.target.nextElementSibling.style.display = 'none';
        e.target.nextElementSibling.innerText = '';
      } else {
        this.xhr.open('GET', `http://localhost:7070/?method=ticketById&id=${e.target.dataset.id}`);
        this.xhr.send();
        this.addListenerLoad(this.renderDrop, e);
        e.target.nextElementSibling.style.display = 'block';
      }
    }
  }

  renderDrop(el) {
    if (this.xhr.status >= 200 && this.xhr.status < 300) {
      try {
        const data = JSON.parse(this.xhr.responseText);
        el.target.nextElementSibling.innerText = data.description;// eslint-disable-line
      } catch (e) {
        console.error(e);
      }
      this.removeListenerLoad(this.renderDrop, el);
    }
  }

  editTicket(e) {
    if (e.target.classList.contains('edit')) {
      this.editing = e.target.parentElement;
      const arr = Array.from(e.target.parentElement.children);
      this.modal.style.display = 'flex';
      this.modal.querySelector('.header-modal').innerText = 'Редактировать тикет';
      this.description.value = (arr.find((x) => x.classList.contains('content-container'))).firstElementChild.innerText;
      this.fulldescription.value = (arr.find((x) => x.classList.contains('content-container'))).lastElementChild.innerText;
    }
  }

  remove(e) {
    if (e.target.classList.contains('remove')) {
      this.modalRemove.style.display = 'flex';
      this.save = e.target.parentElement;
    }
  }

  okRemove(e) {
    if (e.target.classList.contains('okBtn')) {
      this.save.remove();
      this.save = null;
      this.modalRemove.style.display = 'none';
    }
  }
}
