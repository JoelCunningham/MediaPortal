import { CloseButton, FileInput, RadioInput, SubmitButton, TextInput } from '@components/inputs';
import App from '@objects/app';
import { getIcon, guessName } from '@services/app-service';
import React, { useEffect } from 'react';

const AddAppModal = ({ isOpen, onClose }: AddAppModalInterface) => {
    const [newApp, setNewApp] = React.useState(new App());
    const [previousLocation, setPreviousLocation] = React.useState<string>('');
    const [iconSrc, setIconSrc] = React.useState<string>('');

    const handleClose = () => {
        setNewApp(new App());
        setPreviousLocation('');
        setIconSrc('');
        onClose();
    };

    const handleFindExecutable = () => {
        window.Electron.ipcRenderer.invoke('open-file-dialog').then((filePath: string) => {
            setNewApp({ ...newApp, location: filePath });
        }).catch((error: Error) => {
            console.error('Error opening file dialog:', error);
        });
    }

    const handleAddApp = () => {
        window.Electron.ipcRenderer.invoke('add-app', newApp).then((app: App) => {
            handleClose();
        }).catch((error: Error) => {
            console.error('Error adding app:', error);
        });
    };

    useEffect(() => {
        const currentLocation = newApp.location;
        setNewApp({ ...newApp, location: previousLocation });
        setIconSrc('');
        setPreviousLocation(currentLocation);
    }, [newApp.isWeb]);

    useEffect(() => {
        let isCancelled = false;
        setNewApp({ ...newApp, name: guessName(newApp.location, newApp.isWeb) });
        if (newApp.location) {
            getIcon(newApp.location, newApp.isWeb).then((icon: string) => {
                if (!isCancelled) {
                    setIconSrc(icon);
                } 
            }).catch((error: Error) => {
                if (!isCancelled) {
                    console.error('Error getting icon:', error);
                }
            });
        }
        return () => {
            isCancelled = true;
        };
    }, [newApp.location]);

    return (
        <div className={`${isOpen ? 'visible' : 'invisible'} flex fixed top-0 w-full h-full justify-center items-center`}>
            <div className="bg-foreground text-white p-6 rounded-lg w-100 ">
                <div className="flex justify-between items-center mb-4 text-3xl">
                    <div className='flex gap-4 items-center'>
                        <h2 className="font-bold">Add App</h2>
                        {iconSrc && <img src={iconSrc} className='w-8 h-8' />}
                    </div>
                    <CloseButton onClick={handleClose} />
                </div>
                <form className="flex flex-col gap-4">

                    <div className="flex gap-6">
                        <RadioInput checked={!newApp.isWeb} onChange={(e) => setNewApp({ ...newApp, isWeb: !e.target.checked })} label="Desktop app" />
                        <RadioInput checked={newApp.isWeb} onChange={(e) => setNewApp({ ...newApp, isWeb: e.target.checked })} label="Web app" />
                    </div>

                    {newApp.isWeb ?
                        <TextInput value={newApp.location} onChange={(e) => setNewApp({ ...newApp, location: e.target.value })} placeholder="URL" /> :
                        <FileInput value={newApp.location} onChange={(e) => setNewApp({ ...newApp, location: e.target.value })} onClick={handleFindExecutable} placeholder="Executable" />
                    }

                    <TextInput value={newApp.name} onChange={(e) => setNewApp({ ...newApp, name: e.target.value })} placeholder="Nickname" />

                    <SubmitButton onClick={handleAddApp} />
                </form>
            </div>
        </div>
    );
}

export default AddAppModal;

interface AddAppModalInterface {
    isOpen: boolean;
    onClose: () => void;
}