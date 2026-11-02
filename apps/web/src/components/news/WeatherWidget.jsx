import { CloudSun, ArrowUp, ArrowDown } from 'lucide-react'
import { MOCK_WEATHER } from '../../data/mockNewsData'

export function WeatherWidget() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-2xs">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
        <h3 className="text-sm font-bold text-gray-900 kannada flex items-center gap-1.5">
          <span>{MOCK_WEATHER.city} ಹವಾಮಾನ</span>
        </h3>
        <a href="#weather" className="text-[11px] text-blue-600 hover:underline kannada">
          ಇತರ ನಗರಗಳು &gt;
        </a>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Weather visual icon matching mockup */}
          <div className="relative text-amber-500">
            <CloudSun size={40} className="text-amber-500 fill-amber-200" />
          </div>

          <div>
            <div className="text-3xl font-extrabold text-gray-900 leading-none">
              {MOCK_WEATHER.temp}°C
            </div>
            <div className="text-xs text-gray-500 font-medium kannada mt-1">
              {MOCK_WEATHER.condition}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="flex items-center text-red-600">
            <ArrowUp size={13} />
            <span>{MOCK_WEATHER.high}°</span>
          </span>
          <span className="flex items-center text-blue-600">
            <ArrowDown size={13} />
            <span>{MOCK_WEATHER.low}°</span>
          </span>
        </div>
      </div>
    </div>
  )
}
