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
}

export default CredentialModal;
