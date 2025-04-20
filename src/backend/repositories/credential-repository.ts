import Credential from '@models/credential-model';
import AbstractRepository from '@repositories/abstract-repository';

class CredentialRepository extends AbstractRepository<Credential> {
    private static readonly REPOSITORY_FILE = 'credentials.json';

    constructor() {
        super(CredentialRepository.REPOSITORY_FILE);
    }

    public getCredentials(): Credential[] {
        return this.readData();
    }

    public addCredentials(credentials: Credential[]): void {
        this.appendData(credentials);
    }

    public removeCredential(id: string): void {
        this.removeData(id);
    }
}

export default new CredentialRepository();
