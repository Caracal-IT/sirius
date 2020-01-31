export class MoonLabel extends HTMLElement {
    static get observedAttributes() { return ['id', 'value']; }

    connectedCallback() {             
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<label>${this.attributes.value.value}</label>`;
        this.label = this.shadowRoot.querySelector("label");
    }
      
    attributeChangedCallback(name, oldValue, newValue) {
        if(name === "value" && this.label)
          this.label.innerText =  newValue;         
    }      
}

const register = () => customElements.define('moon-label', MoonLabel);
window.WebComponents ? window.WebComponents.waitFor(register) : register();