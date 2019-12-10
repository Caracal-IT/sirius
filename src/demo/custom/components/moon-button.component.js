export class MoonButton extends HTMLElement {
    static get observedAttributes() { return ['name', 'id', 'value', 'next']; }

    connectedCallback() {             
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<button/>${this.attributes.value.value}</button>`;

        this.button = this.shadowRoot.querySelector("button");

        this.handler = this.clickHandler.bind(this);          
        this.button.addEventListener('click', this.handler);
      }
      
      attributeChangedCallback(name, oldValue, newValue) {
        if(name === "value" && this.button)
          this.button.innerText =  newValue;         
      }

      disconnectedCallback() {         
        this.button.removeEventListener('click', this.handler);
      }

      clickHandler() {
        const next = this.attributes.next.value;  
        this.context.wfService.setNextAction(next);         
      }
  }

  const register = () => customElements.define('moon-button', MoonButton);
  window.WebComponents ? window.WebComponents.waitFor(register) : register();