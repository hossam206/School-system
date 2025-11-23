export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
          {/* Spinning ring */}
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-[#EE1B24] rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
