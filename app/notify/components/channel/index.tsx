import CannelCard from "./components/CannelCard";
import AddCannelModal from "./components/AddCannelModal";
import { useState } from "react";

export default function Channel() {
    const [isAddCannelModalOpen, setIsAddCannelModalOpen] = useState(false);

    return (
        <div>
            <div className='text-2xl font-bold mb-6'>频道通知</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                <CannelCard onClick={() => setIsAddCannelModalOpen(true)} />
            </div>
            <AddCannelModal isOpen={isAddCannelModalOpen} onClose={() => setIsAddCannelModalOpen(false)} onSuccess={() => setIsAddCannelModalOpen(false)} />
        </div>
    );
}