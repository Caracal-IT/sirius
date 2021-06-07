export class MenuComponent extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = `
            <div class='toggle' onclick="this.parentNode.classList.toggle('minimize')">
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div class="menu-item"><span class="material-icons">home</span><div>Home</div></div>
            <div class="menu-item"><span class="material-icons">account_circle</span><div>Account</div></div>
        `;
    }

    disconnectedCallback() {

    }
}

customElements.define('demo-menu', MenuComponent);