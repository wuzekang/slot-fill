import React from 'react';
export declare type UpdateCallback = (children: React.ReactNode[]) => void;
export interface SlotProps {
    children?: (children: React.ReactNode[]) => ReturnType<React.FC>;
}
export interface Slot {
    (props: SlotProps): ReturnType<React.FC>;
    Fill: React.ComponentType;
}
export declare const SlotFillProvider: React.FC;
export declare function createSlot(): Slot;
