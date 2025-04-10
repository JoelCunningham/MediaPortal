import Icon from '@components/icon';
import React from 'react';

type changeEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;

const RadioInput = ({ checked, onChange, label }: { checked: boolean; onChange: changeEvent; label: string }) => (
    <label className='text-lg clickable'>
        <input
            type='radio'
            checked={checked}
            onChange={onChange}
            className={`radio-input clickable focusable`}
        />
        {label}
    </label>
);

const TextInput = ({ value, onChange, placeholder, className }: { value: string; onChange: changeEvent; placeholder: string; className?: string }) => (
    <input
        type='text'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`text-input focusable ${className}`}
    />
);

const FileInput = ({ value, onChange, placeholder, onClick }: { value: string; onChange: changeEvent; placeholder: string; onClick: () => void }) => (
    <div className='flex relative items-center'>
        <TextInput
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className='!pr-10'
        />
        <button className='file-input focusable clickable' onClick={onClick} type='button' >
            <Icon icon='folder' size={20} />
        </button>
    </div>
);

const AddButton = ({ onClick }: { onClick: () => void }) => (
    <button
        type='button'
        onClick={onClick}
        className='add-button focusable clickable transitioning'
    >
        Add App
    </button>
);

const SubmitButton = ({ onClick }: { onClick: () => void }) => (

    <button
        type='button'
        onClick={onClick}
        className='submit-button focusable clickable transitioning'
    >
        Add
    </button>
);

const CloseButton = ({ onClick }: { onClick: () => void }) => (
    <button
        type='button'
        onClick={onClick}
        className='close-button focusable clickable transitioning'
    >
        <Icon icon='close' size={26} />
    </button>
);

export {
    AddButton,
    CloseButton,
    FileInput,
    RadioInput,
    SubmitButton,
    TextInput
};

