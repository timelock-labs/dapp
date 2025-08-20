'use client';
import { ethers } from "ethers";

export default function AddressWarp({ address, className }: { address: string|undefined, className?: string }) {
    return (
        <div className={`${className}`}>{ethers.utils.getAddress(address || '')}</div>
    )
}