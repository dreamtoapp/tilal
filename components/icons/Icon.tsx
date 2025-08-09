import React from 'react';
import { cva } from 'class-variance-authority';

import {
    AlertCircle, Zap, Check, Minus, ChevronLeft, ChevronRight, MoreHorizontal, X, PanelLeft, Circle, Info,
    UploadCloud, ZoomIn, Trash2, ImageOff, Map, MapPinOff, Plus, Loader2, AlertTriangle, Home, Search,
    HelpCircle, RefreshCw, ArrowLeft, User, Mail, FileText, Calendar, CheckCircle2, Package, Calculator,
    DollarSign, Receipt, Users, TrendingUp, Award, PlayCircle, Clock, Truck, Phone, Navigation, UserCheck,
    Send, Copy, Rocket, Timer, Car, List, PhoneCall, LayoutGrid, LayoutDashboard, Store, ClipboardList,
    XCircle, Activity, Tags, Warehouse, Headset, Sun, Moon, SortAsc, SortDesc, Heart, Edit, ChevronUp,
    ChevronDown, Menu, LocateFixed, Tag, Share2, Flame, Star, Server, Download, Bug, Bell, Globe, History, MessageSquare, MessageCircle, Wrench,
    ShoppingCart, ShoppingBag, CreditCard, LogOut, BookOpen, Settings, Grid3X3, Shield, BarChart3, Megaphone, Database, MousePointerBan,
    Building2, MapPin, Cog, Palette, RotateCcw, Undo, File, Expand
} from 'lucide-react';

// Local iconVariants definition (copied from lib/utils)
const iconVariants = cva('inline-block shrink-0', {
    variants: {
        variant: {
            default: 'text-foreground',
            primary: 'text-primary',
            secondary: 'text-secondary',
            destructive: 'text-destructive',
            muted: 'text-muted-foreground',
            accent: 'text-accent-foreground',
            success: 'text-success',
            warning: 'text-warning',
            info: 'text-info',
        },
        size: {
            xs: 'h-4 w-4',
            sm: 'h-5 w-5',
            xsm: 'h-4 w-4',
            md: 'h-6 w-6',
            lg: 'h-8 w-8',
            xl: 'h-10 w-10',
        },
        animation: {
            none: '',
            spin: 'animate-spin',
            pulse: 'animate-pulse',
            bounce: 'animate-bounce',
            ping: 'animate-ping',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
        animation: 'none',
    },
});

const iconMap = {
    AlertCircle, Zap, Check, Minus, ChevronLeft, ChevronRight, MoreHorizontal, X, PanelLeft, Circle, Info,
    UploadCloud, ZoomIn, Trash2, ImageOff, Map, MapPinOff, Plus, Loader2, AlertTriangle, Home, Search,
    HelpCircle, RefreshCw, ArrowLeft, User, Mail, FileText, Calendar, CheckCircle2, Package, Calculator,
    DollarSign, Receipt, Users, TrendingUp, Award, PlayCircle, Clock, Truck, Phone, Navigation, UserCheck,
    Send, Copy, Rocket, Timer, Car, List, PhoneCall, LayoutGrid, LayoutDashboard, Store, ClipboardList,
    XCircle, Activity, Tags, Warehouse, Headset, Sun, Moon, SortAsc, SortDesc, Heart, Edit, ChevronUp,
    ChevronDown, LocateFixed, Tag, Menu, Star, Share2, Flame, Server, Download, Bug, Bell, Globe, History, MessageSquare, MessageCircle, Wrench,
    ShoppingCart, ShoppingBag, CreditCard, LogOut, Grid3X3, Settings, BookOpen, Shield, BarChart3, Megaphone, Database, MousePointerBan,
    Building2, MapPin, Cog, Palette, RotateCcw, Undo, File, Expand
};

// Types for size and variant based on iconVariants
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconVariant =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'muted'
    | 'accent'
    | 'success'
    | 'warning'
    | 'info';

interface IconProps {
    name: string;
    size?: IconSize;
    variant?: IconVariant;
    animation?: 'none' | 'spin' | 'pulse' | 'bounce' | 'ping';
    [key: string]: any;
}

export function Icon({ name, size = 'md', variant = 'default', animation = 'none', ...props }: IconProps) {
    // Map legacy names to new lucide names
    const nameMap: Record<string, string> = {
        Whatsapp: 'MessageCircle',
        Tools: 'Wrench',
        Grid3x3: 'Grid3X3', // Map Grid3x3 to the correct Lucide name
        CheckCircle: 'CheckCircle2', // Map CheckCircle to CheckCircle2
    };
    const mappedName = nameMap[name] || name;
    const IconComponent = iconMap[mappedName as keyof typeof iconMap] as React.ComponentType<any> | undefined;
    if (!IconComponent) return null;
    return <IconComponent className={iconVariants({ size, variant, animation })} {...props} />;
} 