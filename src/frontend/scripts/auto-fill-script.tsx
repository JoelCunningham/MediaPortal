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

        const usernameField = document.querySelector('input[type="email"], input[name*="email"], input[name*="username"]') as HTMLInputElement;
        const passwordField = document.querySelector('input[type="password"]') as HTMLInputElement;

        function setNativeValue(element: any, value: string) {
            const lastValue = element.value;
            element.value = value;
            const event = new Event('input', { bubbles: true });
            (event as any).simulated = true;
            const tracker = (element as any)._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            element.dispatchEvent(event);
        }

        function style(element: HTMLElement) {
            element.style.color = '#000000';
            element.style.backgroundColor = '#8ebd8e';
        }

        function fillFields(username: string, password: string) {
            if (usernameField) {
                setNativeValue(usernameField, username);
                style(usernameField);
            }
            if (passwordField) {
                setNativeValue(passwordField, password);
                style(passwordField);
            }
        }

        function createDropdown(credentials: Credential[], anchor: HTMLInputElement) {
            const existingDropdown = document.getElementById('credentials-dropdown');
            if (existingDropdown) {
                existingDropdown.remove();
            }

            const dropdown = document.createElement('div');
            dropdown.id = 'credentials-dropdown';
            dropdown.style.position = 'absolute';
            dropdown.style.border = '1px solid #ccc';
            dropdown.style.backgroundColor = '#fff';
            dropdown.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
            dropdown.style.borderRadius = '6px';
            dropdown.style.padding = '4px 0';
            dropdown.style.zIndex = '2147483647';
            dropdown.style.fontSize = '14px';
            dropdown.style.minWidth = `${anchor.offsetWidth}px`;

            const items: HTMLDivElement[] = [];

            credentials.forEach((credential) => {
                const item = document.createElement('div');
                item.tabIndex = 0;
                item.style.padding = '8px 12px';
                item.style.cursor = 'pointer';
                item.style.color = '#000';
                item.style.display = 'flex';
                item.style.flexDirection = 'column';
                item.style.outline = 'none';
                item.style.border = '2px solid #fff';
                item.style.borderRadius = '6px';
                item.style.margin = '0 4px';
                item.addEventListener('focus', () => {
                    item.style.border = '2px solid #555';
                });
                item.addEventListener('blur', () => {
                    item.style.border = '2px solid #fff';
                });

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

                item.addEventListener('mouseover', () => {
                    item.style.backgroundColor = '#f0f0f0';
                });

                item.addEventListener('mouseout', () => {
                    item.style.backgroundColor = 'transparent';
                });

                item.addEventListener('click', () => {
                    fillFields(credential.username, credential.password);
                    dropdown.remove();
                });

                dropdown.appendChild(item);
                items.push(item);

                items.forEach((item) => {
                    item.tabIndex = 0;

                    item.addEventListener('keydown', (e) => {
                        dropdown.dispatchEvent(new KeyboardEvent(e.type, e));
                    });
                });
            });

            let focusedIndex = 0;
            function focusItem(index: number) {
                if (items[index]) {
                    items[index].focus();
                    focusedIndex = index;
                }
            }

            dropdown.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (focusedIndex < items.length - 1) {
                        focusedIndex = (focusedIndex + 1);
                        focusItem(focusedIndex);
                    }
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (focusedIndex > 0) {
                        focusedIndex = (focusedIndex - 1);
                        focusItem(focusedIndex);
                    }
                } else if (e.key === 'Enter' && focusedIndex >= 0) {
                    e.preventDefault();
                    items[focusedIndex].click();
                } else if (e.key === 'Escape') {
                    dropdown.remove();
                }
            });

            const parent = anchor.offsetParent as HTMLElement || document.body;
            parent.appendChild(dropdown);

            dropdown.style.top = `${anchor.offsetTop + anchor.offsetHeight + 4}px`;
            dropdown.style.left = `${anchor.offsetLeft}px`;

            const onBlur = () => {
                setTimeout(() => {
                    if (!dropdown.contains(document.activeElement)) {
                        dropdown.remove();
                    }
                }, 150);
            };

            dropdown.addEventListener('focusout', (e) => {
                setTimeout(() => {
                    if (!dropdown.contains(document.activeElement)) {
                        dropdown.remove();
                    }
                }, 0);
            });

            anchor.addEventListener('blur', onBlur);
        }

        if (credentials.length > 0) {
            const input = usernameField || passwordField;
            if (!input) return;

            input.addEventListener('focus', () => {
                createDropdown(credentials, input);
            });
        }
    };
}

export default new AutoFillScript();