import Credential from "@models/credential-model";
import AbstractScript from "@scripts/abstract-script";
import { WebviewTag } from "electron";

class AutoFillScript extends AbstractScript {
    public async execute(webview: WebviewTag, credentials: Credential[], isSpecific: boolean, icon: string = ''): Promise<void> {
        return this.run(webview, {
            '__ICON__': this.objectToString(icon),
            '__IS_SPECIFIC__': this.objectToString(isSpecific),
            '__CREDENTIALS__': this.objectToString(credentials),
        });
    }

    protected script = function () {
        const icon: string = JSON.parse("__ICON__");
        const isSpecific: boolean = JSON.parse("__IS_SPECIFIC__");
        const credentials: Credential[] = JSON.parse("__CREDENTIALS__");

        const usernameField = document.querySelector<HTMLInputElement>('input[type="email"], input[name*="email"], input[name*="username"]');
        const passwordField = document.querySelector<HTMLInputElement>('input[type="password"]');

        const input = usernameField || passwordField;
        if (!input || credentials.length === 0) return;

        const setNativeValue = (element: HTMLInputElement, value: string) => {
            const lastValue = element.value;
            element.value = value;
            const event = new Event('input', { bubbles: true });
            (event as any).simulated = true;
            const tracker = (element as any)._valueTracker;
            tracker?.setValue(lastValue);
            element.dispatchEvent(event);
        };

        const styleElement = (el: HTMLElement) => {
            el.style.color = '#000000';
            el.style.backgroundColor = '#8ebd8e';
        };

        const fillFields = (username: string, password: string) => {
            if (usernameField) {
                setNativeValue(usernameField, username);
                styleElement(usernameField);
            }
            if (passwordField) {
                setNativeValue(passwordField, password);
                styleElement(passwordField);
            }
        };

        const createDropdown = (credentials: Credential[], anchor: HTMLInputElement) => {
            document.getElementById('credentials-dropdown')?.remove();

            const dropdown = document.createElement('div');
            dropdown.id = 'credentials-dropdown';
            Object.assign(dropdown.style, {
                position: 'absolute',
                zIndex: '2147483647',
                backgroundColor: '#fff',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '4px 0',
                fontSize: '14px',
                minWidth: `${anchor.offsetWidth}px`
            });

            const items: HTMLDivElement[] = credentials.map((credential) => {
                const item = document.createElement('div');
                Object.assign(item.style, {
                    padding: '8px 12px',
                    cursor: 'pointer',
                    color: '#000',
                    display: 'flex',
                    flexDirection: 'column',
                    outline: 'none',
                    border: '2px solid #fff',
                    borderRadius: '6px',
                    margin: '0 4px'
                });

                item.tabIndex = 0;
                item.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${isSpecific
                        ? `<img style="width: 24px; height: 24px; border-radius: 50%;" src="${icon}" />`
                        : `<div style="font-size: 24px;">🔑</div>`
                    }
                        <div>
                            <div style="font-weight: 500;">${credential.username}</div>
                            <div style="font-size: 12px; color: #666;">${isSpecific ? 'Saved credential' : 'Default email'}</div>
                        </div>
                    </div>
                `;

                item.addEventListener('focus', () => item.style.border = '2px solid #555');
                item.addEventListener('blur', () => item.style.border = '2px solid #fff');
                item.addEventListener('mouseover', () => item.style.backgroundColor = '#f0f0f0');
                item.addEventListener('mouseout', () => item.style.backgroundColor = 'transparent');
                item.addEventListener('click', () => {
                    fillFields(credential.username, credential.password);
                    dropdown.remove();
                });
                item.addEventListener('keydown', (e) => {
                    dropdown.dispatchEvent(new KeyboardEvent(e.type, e));
                });

                return item;
            });

            items.forEach(item => dropdown.appendChild(item));
            anchor.offsetParent?.appendChild(dropdown);

            dropdown.style.top = `${anchor.offsetTop + anchor.offsetHeight + 4}px`;
            dropdown.style.left = `${anchor.offsetLeft}px`;

            let focusedIndex = 0;
            const focusItem = (index: number) => {
                items[index]?.focus();
                focusedIndex = index;
            };

            dropdown.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    focusItem(Math.min(focusedIndex + 1, items.length - 1));
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    focusItem(Math.max(focusedIndex - 1, 0));
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    items[focusedIndex]?.click();
                } else if (e.key === 'Escape') {
                    dropdown.remove();
                }
            });

            const removeIfUnfocused = () => {
                setTimeout(() => {
                    if (!dropdown.contains(document.activeElement)) {
                        dropdown.remove();
                    }
                }, 150);
            };

            dropdown.addEventListener('focusout', removeIfUnfocused);
            anchor.addEventListener('blur', removeIfUnfocused);
        };

        input.addEventListener('focus', () => createDropdown(credentials, input));
    };
}

export default new AutoFillScript();