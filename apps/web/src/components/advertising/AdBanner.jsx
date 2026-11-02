export function AdBanner({ type = 'real-estate' }) {
  if (type === 'business') {
    return (
      <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 shadow-xs">
        <span className="absolute top-2 right-2 text-[10px] text-gray-400 font-medium tracking-wider kannada bg-black/40 px-1.5 py-0.5 rounded">
          ಜಾಹೀರಾತು
        </span>

        <h4 className="text-base font-bold leading-tight kannada text-white mt-1">
          ನಿಮ್ಮ ವ್ಯವಹಾರಕ್ಕೆ ಸರಿಯಾದ ಜಾಹೀರಾತು ಪರಿಹಾರ
        </h4>
        <p className="text-xs text-indigo-200 mt-1 kannada">
          DIGI NEWS NETWORK ನಲ್ಲಿ ಜಾಹೀರಾತು ನೀಡಿ ಲಕ್ಷಾಂತರ ಓದುಗರನ್ನು ತಲುಪಿ
        </p>

        <a
          href="#contact-ads"
          className="mt-3.5 inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold text-xs px-3.5 py-2 rounded-md transition-colors shadow-2xs kannada"
        >
          <span>ಇಂದು ಸಂಪರ್ಕಿಸಿ</span>
          <span>→</span>
        </a>
      </div>
    )
  }

  // Real estate ad banner matching Mockup 1
  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs group">
      {/* Ad Label */}
      <div className="absolute top-2 right-2 z-10">
        <span className="text-[10px] text-gray-500 font-medium tracking-wide kannada bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-2xs">
          ಜಾಹೀರಾತು
        </span>
      </div>

      {/* Ad Image */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
          alt="Luxury Apartments Bangalore"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider">
            2 BHK | 3 BHK | Premium Apartments
          </p>
          <h4 className="text-base font-bold leading-tight kannada text-white mt-0.5">
            ನಿಮ್ಮ ಕನಸಿನ ಮನೆ ಈಗ ನಿಜವಾಗಲಿ
          </h4>
          <p className="text-xs text-gray-200 kannada">ಪ್ರೀಮಿಯಂ ಫ್ಲಾಟ್‌ಗಳು, ಬೆಂಗಳೂರು</p>

          <a
            href="#real-estate"
            className="mt-2 inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold text-xs px-3 py-1.5 rounded transition-colors shadow-2xs kannada"
          >
            <span>ಹೆಚ್ಚು ತಿಳಿದುಕೊಳ್ಳಿ</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}

