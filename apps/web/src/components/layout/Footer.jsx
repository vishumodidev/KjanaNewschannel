import { Link } from 'react-router'
import { Send } from 'lucide-react'

export function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    alert('ಧನ್ಯವಾದಗಳು! ನೀವು ನಮ್ಮ ನ್ಯೂಸ್‌ಲೆಟರ್‌ಗೆ ಯಶಸ್ವಿಯಾಗಿ ಚಂದಾದಾರರಾಗಿದ್ದೀರಿ.')
  }

  return (
    <footer className="bg-[#0b1120] text-gray-300 mt-14 border-t-4 border-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Brand Info (2 columns wide on large screens) */}
          <div className="lg:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-11 w-9 rounded-md bg-white p-0.5 shadow overflow-hidden flex items-center justify-center flex-shrink-0">
                <img
                  src="/logo.jpg"
                  alt="JANA TV - JANA NEWS NETWORK"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-black text-red-500 tracking-tight leading-none kannada">
                  ಜನಾ ನ್ಯೂಸ್ ನೆಟ್‌ವರ್ಕ್
                </span>
                <p className="text-[11px] font-bold text-gray-400 tracking-widest mt-0.5">
                  JANA TV • JANA NEWS NETWORK
                </p>
              </div>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm kannada">
              ಪಾರದರ್ಶಕ ಸುದ್ದಿ ಪತ್ರಿಕೋದ್ಯಮದ ಪ್ರತೀಕ. ಸತ್ಯ, ನಿಷ್ಪಕ್ಷಪಾತ ಹಾಗೂ ನಿಖರ ಸುದ್ದಿ ಪ್ರಸಾರವೇ ನಮ್ಮ
              ಧ್ಯೇಯ. ಕರ್ನಾಟಕದ ಸಮಗ್ರ ಡಿಜಿಟಲ್ ಧ್ವನಿ.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wide uppercase border-l-2 border-red-600 pl-2 kannada">
              ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-400 kannada">
              <li>
                <Link to="/" className="hover:text-red-400 transition-colors">
                  ಮುಖಪುಟ
                </Link>
              </li>
              <li>
                <Link to="/category/karnataka" className="hover:text-red-400 transition-colors">
                  ಕರ್ನಾಟಕ
                </Link>
              </li>
              <li>
                <Link to="/category/national" className="hover:text-red-400 transition-colors">
                  ದೇಶ
                </Link>
              </li>
              <li>
                <Link to="/category/international" className="hover:text-red-400 transition-colors">
                  ವಿಶ್ವ
                </Link>
              </li>
              <li>
                <Link to="/category/politics" className="hover:text-red-400 transition-colors">
                  ರಾಜಕೀಯ
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wide uppercase border-l-2 border-red-600 pl-2 kannada">
              ಮಾಹಿತಿ
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-400 kannada">
              <li>
                <Link to="/about" className="hover:text-red-400 transition-colors">
                  ನಮ್ಮ ಬಗ್ಗೆ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-400 transition-colors">
                  ಸಂಪರ್ಕಿಸಿ
                </Link>
              </li>
              <li>
                <Link to="/advertising" className="hover:text-red-400 transition-colors">
                  ಜಾಹೀರಾತು
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-red-400 transition-colors">
                  ಗೌಪ್ಯತೆ ನೀತಿ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-red-400 transition-colors">
                  ನಿಯಮಗಳು
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us & Newsletter */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-2.5 tracking-wide uppercase border-l-2 border-red-600 pl-2 kannada">
                ನಮ್ಮನ್ನು ಅನುಸರಿಸಿ
              </h4>
              <div className="flex items-center gap-2">
                <a
                  href="#fb"
                  className="w-7 h-7 rounded-full bg-blue-600 hover:opacity-90 flex items-center justify-center text-white text-xs font-bold"
                  aria-label="Facebook"
                >
                  f
                </a>
                <a
                  href="#x"
                  className="w-7 h-7 rounded-full bg-black hover:opacity-90 border border-gray-700 flex items-center justify-center text-white text-xs font-bold"
                  aria-label="X"
                >
                  𝕏
                </a>
                <a
                  href="#yt"
                  className="w-7 h-7 rounded-full bg-red-600 hover:opacity-90 flex items-center justify-center text-white text-xs"
                  aria-label="YouTube"
                >
                  ▶
                </a>
                <a
                  href="#insta"
                  className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 hover:opacity-90 flex items-center justify-center text-white text-xs"
                  aria-label="Instagram"
                >
                  📷
                </a>
                <a
                  href="#wa"
                  className="w-7 h-7 rounded-full bg-emerald-500 hover:opacity-90 flex items-center justify-center text-white text-xs font-bold"
                  aria-label="WhatsApp"
                >
                  ✆
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2 tracking-wide uppercase border-l-2 border-red-600 pl-2 kannada">
                ನ್ಯೂಸ್‌ಲೆಟರ್
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  required
                  placeholder="ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ"
                  className="w-full bg-gray-800 border border-gray-700 rounded-l py-1.5 px-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-red-600 kannada"
                />
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded-r text-xs font-bold flex items-center justify-center gap-1 transition-colors kannada flex-shrink-0 cursor-pointer"
                >
                  <span>ಚಂದಾದಾರಾಗಿ</span>
                  <Send size={12} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p className="kannada text-center sm:text-left">
            © 2026 JANA NEWS NETWORK. ಎಲ್ಲಾ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-4 text-xs text-gray-400 kannada">
            <Link to="/privacy" className="hover:text-white">
              ಗೌಪ್ಯತೆ ನೀತಿ
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white">
              ಸೇವಾ ನಿಯಮಗಳು
            </Link>
            <span>•</span>
            <Link to="/advertising" className="hover:text-white">
              ಜಾಹೀರಾತು
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white">
              ಸಂಪರ್ಕ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

