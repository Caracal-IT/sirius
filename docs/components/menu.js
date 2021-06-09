export class MenuComponent extends HTMLElement {
    async connectedCallback() {
        this.clickEvents = [];
        let active = 'home';

        switch (window.location.hash.toLowerCase()) {
            case '#home': active = 'home'; break;
            case '#account': active = 'account'; break;
            default: window.location.hash = 'home'; break;
        }
        

        this.innerHTML = `
            <div class='toggle' onclick="this.parentNode.classList.toggle('minimize')">
                <span class="material-icons">menu</span>
            </div>
            <div id="home" class="menu-item ${active === 'home' ? 'menu_selected' : ''}"><span class="material-icons">home</span><div>Home</div></div>
            <div id="account" class="menu-item ${active === 'account' ? 'menu_selected' : ''}"><span class="material-icons">account_circle</span><div>Account</div></div>
        `;

        document.querySelectorAll('.menu-item')
                .forEach(i => {
                    const evt = this.onSelected.bind(this, i);
                    this.clickEvents.push({element: i, event: evt});
                    i.addEventListener('click', evt);
                });        
    }

    onSelected(e) {
        const selected = document.querySelector('.menu_selected');
        
        if(selected)
            selected.classList.remove('menu_selected');

        window.location.hash = e.id;
        e.classList.add('menu_selected');
    }

    disconnectedCallback() {
        this.clickEvents
            .forEach(i => i.element.removeEventListener('click', i.event));
    }
}

customElements.define('demo-menu', MenuComponent);