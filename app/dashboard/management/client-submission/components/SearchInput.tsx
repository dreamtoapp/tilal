import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder }) => (
    <Input
        type='text'
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label='بحث'
    />
);

export default SearchInput; 