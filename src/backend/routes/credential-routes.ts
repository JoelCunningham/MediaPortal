import Route from "@api/route";
import Credential from "@models/credential-model";
import { CredentialRoute } from "@objects/enums";
import CredentialRepository from "@repositories/credential-repository";

new Route<CredentialRoute>(CredentialRoute.GET, async () => {
    return CredentialRepository.getCredentials();
});

new Route<CredentialRoute>(CredentialRoute.ADD, async (credential: Credential) => {
    return CredentialRepository.addCredentials([credential]);
});

new Route<CredentialRoute>(CredentialRoute.REMOVE, async (id: string) => {
    return CredentialRepository.removeCredential(id);
});
