import Request from '@api/request';
import { CredentialRoute } from '@collections/enums';
import Credential from '@models/credential-model';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CredentialContextProps {
    credentials: Credential[];
    getCredentials: (domain: string) => Credential[];
    getDefaultCredentials: () => Credential[];
}

const CredentialContext = createContext<CredentialContextProps | undefined>(undefined);

export const CredentialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [credentials, setCredentials] = useState<Credential[]>([]);

    const getCredentials = (domain: string) => {
        return credentials.filter((credential) => credential.domain === domain);
    }

    const getDefaultCredentials = () => {
        return credentials.filter((credential) => credential.isGeneric());
    }

    useEffect(() => {
        const fetchCredentials = async () => {
            const response = await Request.send(CredentialRoute.GET) as Credential[];
            const credentials = response.map((c) => {
                const credential = Credential.create(c);
                return credential;
            });
            setCredentials(credentials);
        };
        fetchCredentials()
    }, []);

    return (
        <CredentialContext.Provider value={{ credentials, getCredentials, getDefaultCredentials }}>
            {children}
        </CredentialContext.Provider>
    );
};

export const useCredentialContext = (): CredentialContextProps => {
    const context = useContext(CredentialContext);
    if (!context) {
        throw new Error('useCredentialContext must be used within a CredentialProvider');
    }
    return context;
};