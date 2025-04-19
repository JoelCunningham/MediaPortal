import AddModal from '@components/add-modal';
import { AddButton } from '@components/inputs';
import ShortcutBox from '@components/shortcut-box';
import { useShortcutContext } from '@contexts/shortcut';
import React, { useState } from 'react';

const Home = () => {
    const { shortcuts } = useShortcutContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className='h-full'>

            <div className='h-full flex flex-col items-center justify-center text-white'>
                <div className='flex justify-center gap-4 '>
                    {shortcuts.map((shortcut) => (
                        <ShortcutBox key={shortcut.id} shortcut={shortcut} />
                    ))}
                </div>
                <div className='mt-4'>
                    <AddButton onClick={() => setIsModalOpen(true)} />
                </div>
            </div>

            <input type='email' id='email' placeholder='Email' className='w-1/2 h-10 p-2 rounded-lg bg-background text-white' />

            <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

export default Home;