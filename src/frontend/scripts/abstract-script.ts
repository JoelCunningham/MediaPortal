import { WebviewTag } from "electron";

abstract class AbstractScript {

    public abstract execute(webview: WebviewTag, ...args: any[]): Promise<any>;

    protected abstract script(): void;

    protected async run(webview: WebviewTag, replacements?: Record<string, string>): Promise<void> {
        return await webview.executeJavaScript(this.toString(replacements));
    }
    
    protected toString(replacements?: Record<string, string>): string {
        let scriptString = this.script.toString();
        if (replacements) {
            for (const [key, value] of Object.entries(replacements)) {
                const pattern = new RegExp(key, 'g');
                scriptString = scriptString.replace(pattern, value);
            }
        }    
        return `(${scriptString})()`;
    }
    
}

export default AbstractScript;