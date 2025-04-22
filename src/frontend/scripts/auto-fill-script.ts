import Credential from "@models/credential-model";
import AbstractScript from "@scripts/abstract-script";
import { WebviewTag } from "electron";

class AutoFillScript extends AbstractScript {

    public async execute(webview: WebviewTag, credentials: Credential[]): Promise<void> {
        const credentialsString = this.objectToString(credentials);
        const dropdownArrowString = `url("data:image/svg+xml,%3Csvg fill=\\'black\\' height=\\'30\\' viewBox=\\'0 0 24 24\\' width=\\'30\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M7 10l5 5 5-5z\\'/%3E%3C/svg%3E")`;
        return this.run(webview, {
            '__CREDENTIALS__': credentialsString,
            '__DROPDOWN_ARROW__': dropdownArrowString,
        });
    }

    protected script = function () {
        const credentials: Credential[] = JSON.parse("__CREDENTIALS__");
        const dropdownArrow: string = '__DROPDOWN_ARROW__';

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
            element.style.backgroundColor = '#e6ffe6';
        }

        function fillFields(username: string, password: string) {
            if (usernameField) {
                setNativeValue(usernameField, username);
                style(usernameField);
                usernameField.focus();
            }
            if (passwordField) {
                setNativeValue(passwordField, password);
                style(passwordField);
                passwordField.focus();
            }
        }

        function createDropdown(credentials: Credential[]) {
            const anchor = usernameField || passwordField;
            if (!anchor) return;

            const existingDropdown = document.getElementById('credentials-dropdown');
            if (existingDropdown) {
                existingDropdown.remove();
            }

            const dropdown = document.createElement('select');
            dropdown.id = 'credentials-dropdown';
            dropdown.style.position = 'absolute';
            dropdown.style.margin = '2px 0';
            dropdown.style.fontSize = '16px';
            dropdown.style.backgroundColor = '#ffffff';
            dropdown.style.border = '1px solid #ffffff';
            dropdown.style.borderRadius = '0px 6px 6px 0px';
            dropdown.style.zIndex = '99999';
            dropdown.style.maxWidth = '30px';
            dropdown.style.color = 'transparent';
            dropdown.style.cursor = 'pointer';
            dropdown.style.appearance = 'none';
            dropdown.style.backgroundRepeat = 'no-repeat';
            dropdown.style.backgroundPosition = 'center';
            dropdown.style.outline = 'none';
            dropdown.style.transition = 'box-shadow 0.1s, border-color 0.1s';

            credentials.forEach((credential, index) => {
                const option = document.createElement('option');
                option.value = index.toString();
                option.textContent = `   ${credential.username}   `;
                option.style.appearance = 'none';
                option.style.padding = '16px';
                option.style.color = '#000000';
                dropdown.appendChild(option);
            });

            dropdown.addEventListener('change', (e: any) => {
                const index = parseInt(e.target.value, 10);
                const selected = credentials[index];
                fillFields(selected.username, selected.password);
            });

            dropdown.addEventListener('focus', () => {
                dropdown.style.boxShadow = '0 0 0 3px #3b82f6';
                dropdown.style.borderColor = '#3b82f6';
            });

            dropdown.addEventListener('blur', () => {
                dropdown.style.boxShadow = 'none';
                dropdown.style.borderColor = 'transparent';
            });

            const parent = anchor.offsetParent as HTMLElement || document.body;
            parent.appendChild(dropdown);

            const anchorRight = anchor.offsetLeft + anchor.offsetWidth;
            dropdown.style.backgroundImage = dropdownArrow;
            dropdown.style.top = `${anchor.offsetTop}px`;
            dropdown.style.left = `${anchorRight - dropdown.offsetWidth}px`;
            dropdown.style.height = `${anchor.offsetHeight - 4}px`;
            dropdown.tabIndex = anchor.tabIndex;
        }

        if (credentials.length > 0) {
            fillFields(credentials[0].username, credentials[0].password);
            createDropdown(credentials);
        }
    };
}

export default new AutoFillScript();