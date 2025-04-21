import Request from '@api/request';
import { CredentialRoute } from '@collections/enums';
import Credential from '@models/credential-model';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CredentialContextProps {
    credentials: Credential[];
    getCredentials: (domain: string) => Credential[];
    setCredentials: React.Dispatch<React.SetStateAction<Credential[]>>;
    addCredential: (credential: Credential) => Promise<void>;
}

const CredentialContext = createContext<CredentialContextProps | undefined>(undefined);

export const CredentialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [credentials, setCredentials] = useState<Credential[]>([]);

    const getCredentials = (domain: string) => {
        const specificCredentials = credentials.filter((credential) => credential.domain === domain);
        if (specificCredentials.length > 0) {
            return specificCredentials;
        } else {
            const genericCredentials = credentials.filter((credential) => credential.isGeneric());
            return genericCredentials;
        }
    }

    const addCredential = async (credential: Credential) => {
        await Request.send(CredentialRoute.ADD, credential);
        setCredentials((prev) => [...prev, credential]);
    };

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
        <CredentialContext.Provider value={{ credentials, getCredentials, setCredentials, addCredential }}>
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