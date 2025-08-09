'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface RefreshContextType {
    isRefreshing: boolean;
    triggerRefresh: () => void;
    setRefreshing: (refreshing: boolean) => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export function RefreshProvider({ children }: { children: ReactNode }) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const triggerRefresh = () => {
        setIsRefreshing(true);
    };

    return (
        <RefreshContext.Provider value={{ isRefreshing, triggerRefresh, setRefreshing: setIsRefreshing }}>
            {children}
        </RefreshContext.Provider>
    );
}

export function useRefresh() {
    const context = useContext(RefreshContext);
    if (context === undefined) {
        throw new Error('useRefresh must be used within a RefreshProvider');
    }
    return context;
} 