import { useEffect, useState, useRef } from "react";
import { getByCity, getByCoords } from "../services/weather.js";
import WeatherCard from "../components/WeatherCard.jsx";

export default function Weather() {
  const [city, setCity] = useState("");
  const [units, setUnits] = useState("metric");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const lastRef = useRef(null);

  const fetchByCity = async (name) => {
    if (!name?.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await getByCity(name.trim(), { units, lang: "kr" });
      setData(res);
      lastRef.current = { type: "city", value: name.trim() };
    } catch (e) {
      setErr(e);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCoords = async (lat, lon) => {
    setLoading(true);
    setErr(null);
    try {
      const res = await getByCoords(lat, lon, { units, lang: "kr" });
      setData(res);
      lastRef.current = { type: "coords", lat, lon };
    } catch (e) {
      setErr(e);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    fetchByCity(city);
  };

  const onMyLocation = () => {
    if (!navigator.geolocation) {
      setErr(new Error("이 브라우저는 위치 정보를 지원하지 않습니다."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchByCoords(latitude, longitude);
      },
      () => setErr(new Error("위치 권한을 허용해주세요.")),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // 단위 전환 시 자동 재조회
  useEffect(() => {
    const src = lastRef.current;
    if (!src) return;
    if (src.type === "city") fetchByCity(src.value);
    else if (src.type === "coords") fetchByCoords(src.lat, src.lon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <h1>OpenWeather 날씨 앱</h1>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="도시명 입력 (예: Seoul,KR)"
          style={{ flex: "1 1 250px", padding: 8 }}
        />
        <button type="submit">검색</button>
        <button type="button" onClick={onMyLocation}>
          내 위치
        </button>
        <div style={{ marginLeft: "auto" }}>
          <label>
            <input
              type="radio"
              name="unit"
              value="metric"
              checked={units === "metric"}
              onChange={() => setUnits("metric")}
            />{" "}
            °C
          </label>{" "}
          <label>
            <input
              type="radio"
              name="unit"
              value="imperial"
              checked={units === "imperial"}
              onChange={() => setUnits("imperial")}
            />{" "}
            °F
          </label>
        </div>
      </form>

      {loading && <p style={{ marginTop: 12 }}>불러오는 중...</p>}
      {err && (
        <p style={{ color: "#d33", marginTop: 12 }}>오류: {err.message}</p>
      )}
      {!loading && !err && !data && (
        <p style={{ marginTop: 12 }}>도시를 검색하거나 내 위치를 눌러보세요.</p>
      )}
      {data && <WeatherCard data={data} />}
    </div>
  );
}
