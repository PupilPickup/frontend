// src/components/Loading/Loading.tsx

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      {/* Only this div spins and fades */}
      <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 
                      border-l-transparent border-r-transparent 
                      rounded-full animate-spin-slow fade-in">
      </div>
    </div>
  );
}
