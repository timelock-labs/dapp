function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
    // return <div className={`rounded-xl bg-white border border-gray-200 flex flex-col min-h-[600px] p-6 py-2 ${className || ''}`}>  {children}</div>
    return <div>{children}</div>
}

export default SectionCard;