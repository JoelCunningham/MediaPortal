import AbstractScript from "@scripts/abstract-script";
import { WebviewTag } from "electron";

class DetectCredentialsScript extends AbstractScript {

    public async execute(webview: WebviewTag): Promise<any> {
        return await this.run(webview);
    }

    protected script = function () {
        const hasUsername = document.querySelector('input[type="email"], input[name*="email"], input[name*="username"]');
        const hasPassword = document.querySelector('input[type="password"]');
        return !!(hasUsername || hasPassword);
    };
}

export default new DetectCredentialsScript();