export default function WeatherCard({ data }) {
  if (!data) return null;
  const w = data.weather?.[0];
  const main = data.main || {};
  const wind = data.wind || {};
  const tz = data.timezone ?? 0;
  const fmt = (sec) =>
    new Date((sec + tz) * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  const icon = w?.icon
    ? `https://openweathermap.org/img/wn/${w.icon}@2x.png`
    : "";

  return (
    <section
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        background: "#fff",
      }}
    >
      <h2 style={{ marginTop: 0 }}>
        {data.name} {data.sys?.country && `(${data.sys.country})`}
      </h2>
      <p>
        {w?.main} · {w?.description}
      </p>
      {icon && <img src={icon} alt={w?.description || "weather icon"} />}
      <p style={{ fontSize: 36, margin: "8px 0" }}>{Math.round(main.temp)}°</p>
      <p>
        체감 {Math.round(main.feels_like)}°, 최저/최고{" "}
        {Math.round(main.temp_min)}° / {Math.round(main.temp_max)}°
      </p>
      <p>
        습도 {main.humidity}% · 풍속 {wind.speed} m/s
      </p>
      {data.sys?.sunrise && (
        <p>
          일출 {fmt(data.sys.sunrise)} · 일몰 {fmt(data.sys.sunset)}
        </p>
      )}
      <p style={{ color: "#777" }}>측정 시각: {fmt(data.dt)}</p>
    </section>
  );
}
