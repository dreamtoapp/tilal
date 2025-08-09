'use client';

import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
    user?: {
        name?: string | null;
        image?: string | null;
    } | null;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showRing?: boolean;
    ringColor?: string;
}

const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-9 w-9',
};

export const UserAvatar = React.memo(function UserAvatar({
    user,
    size = 'md',
    className,
    showRing = false,
    ringColor = 'ring-feature-users/50',
}: UserAvatarProps) {
    const name = user?.name;
    const image = user?.image;

    // Get initials from name
    const getInitials = (name: string | null | undefined) => {
        if (!name || name.length === 0) return 'U';
        return name[0].toUpperCase();
    };

    return (
        <Avatar
            className={cn(
                sizeClasses[size],
                showRing && `ring-2 ring-offset-1 ${ringColor} ring-offset-background`,
                className
            )}
        >
            <AvatarImage
                src={image || undefined}
                alt={name || "User"}
                className="object-cover"
            />
            <AvatarFallback className="bg-feature-users/10 text-feature-users font-bold text-sm">
                {getInitials(name)}
            </AvatarFallback>
        </Avatar>
    );
});

export default UserAvatar; 