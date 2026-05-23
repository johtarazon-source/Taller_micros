class Modal {
    constructor() {
        this.overlay = null;
        this.content = null;
        this.callback = null;
    }

    create(tipo, titulo, mensaje, botones = []) {
        // Remove existing modal if present
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';

        // Create content container
        this.content = document.createElement('div');
        this.content.className = `modal-content modal-${tipo}`;

        // Create icon
        const iconEl = document.createElement('div');
        iconEl.className = 'modal-icon';
        const iconMap = {
            error: '❌',
            success: '✅',
            info: 'ℹ️',
            warning: '⚠️'
        };
        iconEl.textContent = iconMap[tipo] || '•';
        this.content.appendChild(iconEl);

        // Create title
        const titleEl = document.createElement('h2');
        titleEl.className = 'modal-title';
        titleEl.textContent = titulo;
        this.content.appendChild(titleEl);

        // Create message
        const messageEl = document.createElement('p');
        messageEl.className = 'modal-message';
        messageEl.textContent = mensaje;
        this.content.appendChild(messageEl);

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'modal-buttons';

        // Add buttons
        if (botones.length === 0) {
            const btn = document.createElement('button');
            btn.className = 'modal-button modal-button-primary';
            btn.textContent = 'Aceptar';
            btn.onclick = () => this.close();
            buttonContainer.appendChild(btn);
        } else {
            botones.forEach(btnConfig => {
                const btn = document.createElement('button');
                btn.className = `modal-button modal-button-${btnConfig.tipo || 'secondary'}`;
                btn.textContent = btnConfig.texto;
                btn.onclick = () => {
                    if (btnConfig.callback) {
                        btnConfig.callback();
                    }
                    this.close();
                };
                buttonContainer.appendChild(btn);
            });
        }

        this.content.appendChild(buttonContainer);
        this.overlay.appendChild(this.content);
        document.body.appendChild(this.overlay);

        // Close on overlay click
        this.overlay.onclick = (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        };
    }

    error(titulo, mensaje, callback = null) {
        this.create('error', titulo, mensaje, [
            { texto: 'Cerrar', tipo: 'primary', callback }
        ]);
    }

    success(titulo, mensaje, callback = null) {
        this.create('success', titulo, mensaje, [
            { texto: 'Aceptar', tipo: 'primary', callback }
        ]);
    }

    info(titulo, mensaje, callback = null) {
        this.create('info', titulo, mensaje, [
            { texto: 'Entendido', tipo: 'primary', callback }
        ]);
    }

    warning(titulo, mensaje, callback = null) {
        this.create('warning', titulo, mensaje, [
            { texto: 'Aceptar', tipo: 'primary', callback }
        ]);
    }

    confirm(titulo, mensaje, onConfirm, onCancel = null) {
        this.create('info', titulo, mensaje, [
            { texto: 'Cancelar', tipo: 'secondary', callback: onCancel },
            { texto: 'Confirmar', tipo: 'primary', callback: onConfirm }
        ]);
    }

    prompt(titulo, mensaje, placeholder, onSubmit) {
        const tempCallback = this.callback;
        this.callback = null;

        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';

        this.content = document.createElement('div');
        this.content.className = 'modal-content modal-info';

        const iconEl = document.createElement('div');
        iconEl.className = 'modal-icon';
        iconEl.textContent = 'ℹ️';
        this.content.appendChild(iconEl);

        const titleEl = document.createElement('h2');
        titleEl.className = 'modal-title';
        titleEl.textContent = titulo;
        this.content.appendChild(titleEl);

        const messageEl = document.createElement('p');
        messageEl.className = 'modal-message';
        messageEl.textContent = mensaje;
        this.content.appendChild(messageEl);

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'modal-input';
        input.placeholder = placeholder;
        this.content.appendChild(input);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'modal-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'modal-button modal-button-secondary';
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.onclick = () => this.close();
        buttonContainer.appendChild(cancelBtn);

        const submitBtn = document.createElement('button');
        submitBtn.className = 'modal-button modal-button-primary';
        submitBtn.textContent = 'Enviar';
        submitBtn.onclick = () => {
            const value = input.value.trim();
            if (value && onSubmit) {
                onSubmit(value);
            }
            this.close();
        };
        buttonContainer.appendChild(submitBtn);

        this.content.appendChild(buttonContainer);
        this.overlay.appendChild(this.content);
        document.body.appendChild(this.overlay);

        input.focus();
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        };

        this.overlay.onclick = (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        };
    }

    close() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.classList.add('fade-out');
            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
                this.overlay = null;
                this.content = null;
            }, 200);
        }
    }
}

// Create global modal instance
const modal = new Modal();

// Replace native dialogs with modal equivalents
window.alert = (mensaje) => {
    modal.info('LeeSmart', mensaje);
};

window.confirm = (mensaje) => {
    return new Promise((resolve) => {
        modal.confirm('LeeSmart', mensaje,
            () => resolve(true),
            () => resolve(false)
        );
    });
};

window.prompt = (mensaje, defaultValue = '') => {
    return new Promise((resolve) => {
        modal.prompt('LeeSmart', mensaje, defaultValue, (value) => {
            resolve(value);
        });
    });
};
