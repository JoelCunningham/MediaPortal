import AbstractModel from "@models/abstract-model";

class CredentialModal extends AbstractModel {
    public domain: string;
    public username: string;
    public password: string;

    constructor(domain: string, username: string, password: string) {
        super();
        this.domain = domain;
        this.username = username;
        this.password = password;
    }

    public static create = (credential: CredentialModal): CredentialModal => {
        return new CredentialModal(credential.domain, credential.username, credential.password);
    }

    public isGeneric(): boolean {
        return !this.domain;
    }
}

export default CredentialModal;
