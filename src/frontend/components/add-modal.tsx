import Request from '@api/request';
import { CloseButton, FileInput, RadioInput, SubmitButton, TextInput } from '@components/inputs';
import { useShortcutContext } from '@contexts/shortcut';
import Shortcut from '@models/shortcut-model';
import { IconRoute, ShortcutType } from '@objects/enums';
import React, { useEffect } from 'react';

const AddModal = ({ isOpen, onClose }: AddModalProps) => {
    const [newShortcut, setNewShortcut] = React.useState(Shortcut.createBlank());
    const [previousLocation, setPreviousLocation] = React.useState<string>('');
    const { addShortcut } = useShortcutContext();

    const handleClose = () => {
        setNewShortcut(Shortcut.createBlank());
        setPreviousLocation('');
        onClose();
    };

    const handleFindExecutable = () => {
        window.Electron.ipcRenderer.invoke('open-file-dialog').then((filePath: string) => {
            setNewShortcut(newShortcut.update({ location: filePath }));
        }).catch((error: Error) => {
            console.error('Error opening file dialog:', error);
        });
    }

    const handleAddShortcut = () => {
        addShortcut(newShortcut);
        handleClose();
    };

    useEffect(() => {
        const currentLocation = newShortcut.location;
        setNewShortcut(newShortcut.update({ location: previousLocation }));
        setPreviousLocation(currentLocation);
    }, [newShortcut.type]);

    useEffect(() => {
        let isCancelled = false;
        const fetchIcon = async () => {
            newShortcut.guessName();
            setNewShortcut(newShortcut.createInstance());
            if (newShortcut.location) {
                const icon = await Request.send(IconRoute.GET, newShortcut.location, newShortcut.type);
                if (!isCancelled) {
                    setNewShortcut(newShortcut.update({ icon }));
                }
            }
        };
        fetchIcon();
        return () => { isCancelled = true; };
    }, [newShortcut.location]);

    return (
        <div className={`${isOpen ? 'visible' : 'invisible'} flex fixed top-0 w-full h-full justify-center items-center`}>
            <div className='bg-foreground text-white p-6 rounded-lg w-100 '>
                <div className='flex justify-between items-center mb-4 text-3xl'>
                    <div className='flex gap-4 items-center'>
                        <h2 className='font-bold'>Add Shortcut</h2>
                        {newShortcut.icon && <img src={newShortcut.icon} className='w-8 h-8' />}
                    </div>
                    <CloseButton onClick={handleClose} />
                </div>
                <form className='flex flex-col gap-4'>

                    <div className='flex gap-6'>
                        <RadioInput checked={newShortcut.type == ShortcutType.APP} onCheck={() => setNewShortcut(newShortcut.update({ type: ShortcutType.APP }))} label='Desktop shortcut' />
                        <RadioInput checked={newShortcut.type == ShortcutType.WEB} onCheck={() => setNewShortcut(newShortcut.update({ type: ShortcutType.WEB }))} label='Web shortcut' />
                    </div>

                    {newShortcut.type == ShortcutType.APP
                        ? <FileInput value={newShortcut.location} onChange={(e) => setNewShortcut(newShortcut.update({ location: e.target.value }))} onClick={handleFindExecutable} placeholder='Executable' />
                        : <TextInput value={newShortcut.location} onChange={(e) => setNewShortcut(newShortcut.update({ location: e.target.value }))} placeholder='URL' />
                    }

                    <TextInput value={newShortcut.name} onChange={(e) => setNewShortcut(newShortcut.update({ name: e.target.value }))} placeholder='Nickname' />

                    <SubmitButton onClick={handleAddShortcut} />
                </form>
            </div>
        </div>
    );
}

export default AddModal;

interface AddModalProps {
    isOpen: boolean;
    onClose: () => void;
}