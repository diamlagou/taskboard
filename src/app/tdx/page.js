'use client'
import { useEffect, useState } from 'react'

const airlineMap = {
  AE: '華信航空',
  B7: '立榮航空',
  CI: '中華航空',
  BR: '長榮航空',
  IT: '台灣虎航',
  DA: '德安航空',
}

const airportMap = {
  TSA: '台北松山機場',
  TPE: '桃園國際機場',
  KHH: '高雄小港機場',
  HUN: '花蓮機場',
  MZG: '馬公機場',
  CMJ: '七美機場',
  KNH: '金門尚義機場',
  TTT: '台東豐年機場',
  GNI: '綠島機場',
  CYI: '嘉義水上機場',
}

export default function TDXFlightPage() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [filter, setFilter] = useState('全部')
  const [isDark, setIsDark] = useState(true)

  const CLIENT_ID = 'B11217069-a9fdde8e-5802-4576'
  const CLIENT_SECRET = '94caf35a-227c-40e5-ae64-b0ed63136d57'

  const fetchToken = async () => {
    const res = await fetch(
      'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
      }
    )
    const data = await res.json()
    return data.access_token
  }

  const fetchData = async () => {
    setLoading(true)
    const token = await fetchToken()
    const res = await fetch(
      'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Flight?$top=100&$format=JSON',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data = await res.json()
    setFlights(data)
    setLastUpdated(new Date().toLocaleString('zh-TW'))
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredFlights = filter === '全部'
    ? flights
    : flights.filter(f => f.DepartureAirportID === filter || f.ArrivalAirportID === filter)

  const themeClass = isDark ? 'bg-black text-white' : 'bg-white text-black'
  const borderClass = isDark ? 'border-white' : 'border-black'
  const tableHeaderClass = isDark ? 'bg-gray-800' : 'bg-gray-200'

  return (
    <main className={`p-6 min-h-screen ${themeClass}`}>
      <h1 className="text-2xl font-bold mb-4">✈️ 即時航班資訊</h1>
      <div className="mb-4 space-x-4">
        <label htmlFor="filter">篩選機場：</label>
        <select
          id="filter"
          className="rounded px-2 py-1 border border-gray-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="全部">全部</option>
          {Object.entries(airportMap).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
        <button
          onClick={fetchData}
          className="px-3 py-1 rounded border border-gray-500"
        >重新整理</button>
        <button
          onClick={() => setIsDark(!isDark)}
          className="px-3 py-1 rounded border border-gray-500"
        >切換主題</button>
      </div>
      {lastUpdated && <p className="mb-4 text-sm">最後更新：{lastUpdated}</p>}
      {loading ? (
        <p>載入中...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className={`table-auto w-full text-sm border ${borderClass}`}>
            <thead>
              <tr className={`text-center ${tableHeaderClass}`}>
                <th className={`p-2 border ${borderClass}`}>航班編號</th>
                <th className={`p-2 border ${borderClass}`}>航空公司</th>
                <th className={`p-2 border ${borderClass}`}>出發地</th>
                <th className={`p-2 border ${borderClass}`}>目的地</th>
                <th className={`p-2 border ${borderClass}`}>預定起飛時間</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlights.slice(0, 10).map((f, idx) => (
                <tr key={idx} className="text-center">
                  <td className={`p-2 border ${borderClass}`}>{f.FlightNumber}</td>
                  <td className={`p-2 border ${borderClass}`}>
                    {f.AirlineID}（{airlineMap[f.AirlineID] || f.AirlineID}）
                  </td>
                  <td className={`p-2 border ${borderClass}`}>
                    {f.DepartureAirportID}（{airportMap[f.DepartureAirportID] || f.DepartureAirportID}）
                  </td>
                  <td className={`p-2 border ${borderClass}`}>
                    {f.ArrivalAirportID}（{airportMap[f.ArrivalAirportID] || f.ArrivalAirportID}）
                  </td>
                  <td className={`p-2 border ${borderClass}`}>
                    {f.ScheduleDepartureTime ? new Date(f.ScheduleDepartureTime).toLocaleString('zh-TW') : '無資料'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
