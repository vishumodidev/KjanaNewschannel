/**
 * BrandLogo — Official JANA TV / DIGI NEWS NETWORK Logo
 *
 * Displays the stylized Diamond "K" and "JANA TV" emblem
 * with configurable height and display variant.
 */
export function BrandLogo({ size = 'md', showText = true, className = '' }) {
  const sizeMap = {
    sm: 'h-8',
    md: 'h-11 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  }

  const imgHeight = sizeMap[size] || sizeMap.md

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Emblem */}
      <div className="relative bg-white rounded-md p-1 border border-gray-100 shadow-2xs overflow-hidden flex-shrink-0 flex items-center justify-center">
        <img
          src="/logo.jpg"
          alt="JANA TV - DIGI NEWS NETWORK"
          className={`${imgHeight} w-auto object-contain`}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-red-700 tracking-tight leading-none kannada">
              ದಿಗಿ ನ್ಯೂಸ್ ನೆಟ್‌ವರ್ಕ್
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] font-semibold text-gray-700 tracking-wide kannada">
              ಸತ್ಯ | ಸಮಗ್ರ | ಜನರ ಧ್ವನಿ
            </span>
            <span className="text-[10px] text-gray-400">|</span>
            <span className="text-[10px] font-bold text-gray-800 tracking-wider">
              JANA TV • DIGI NEWS NETWORK
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default BrandLogo

