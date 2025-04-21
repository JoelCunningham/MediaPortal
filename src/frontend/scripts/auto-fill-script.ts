import AbstractScript from "@scripts/abstract-script";
import { WebviewTag } from "electron";

class AutoFillScript extends AbstractScript {

    public async execute(webview: WebviewTag, username: string, password: string): Promise<void> {
        return this.run(webview, {
            '__USERNAME__': username,
            '__PASSWORD__': password,
        });
    }

    protected script = function () {
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
            element.style.border = '2px solid green';
            element.style.color = '#000';
            element.style.backgroundColor = '#e6ffe6';
        }

        const usernameField = document.querySelector('input[type="email"], input[name*="email"], input[name*="username"]') as HTMLElement;
        const passwordField = document.querySelector('input[type="password"]') as HTMLElement;
        const submitButton = document.querySelector('button[type="submit"], input[type="submit"]') as HTMLElement;

        if (usernameField as HTMLInputElement) {
            setNativeValue(usernameField, '__USERNAME__');
            style(usernameField);
            usernameField.focus();
        }
        if (passwordField) {
            setNativeValue(passwordField, '__PASSWORD__');
            style(passwordField);
            passwordField.focus();
        }

        if (submitButton && (usernameField || passwordField)) {
            submitButton.focus();
        }
    };
}

export default new AutoFillScript();