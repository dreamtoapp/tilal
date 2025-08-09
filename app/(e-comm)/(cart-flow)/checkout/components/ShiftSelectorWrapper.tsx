"use client";
import { ShiftSelector } from "./ShiftSelector";

interface ShiftSelectorWrapperProps {
    selectedShiftId: string;
    onShiftSelect: (id: string) => void;
}

export default function ShiftSelectorWrapper({ selectedShiftId, onShiftSelect }: ShiftSelectorWrapperProps) {
    return (
        <ShiftSelector
            selectedShiftId={selectedShiftId}
            onShiftSelect={onShiftSelect}
        />
    );
} 