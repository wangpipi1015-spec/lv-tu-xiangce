const fs = require("fs");
const path = require("path");

const provinceRows = require("/tmp/china-province.json");
const cityRows = require("/tmp/china-city.json");
const areaRows = require("/tmp/china-area.json");
const geoRows = require("/tmp/city-geo.json");

const ROOT = path.resolve(__dirname, "..");
const OUT_FILE = path.join(ROOT, "assets", "china-locations.js");
const COUNTRY = "中国";
const DIRECT_CITY_PROVINCES = new Set(["北京市", "天津市", "上海市", "重庆市"]);
const FAKE_PARENT_PATTERN = /直辖县级行政区划/;

const manualPlaces = {
  海南省: [["东沙群岛", 20.6992, 116.7297]],
  台湾省: [
    ["台北市", 25.033, 121.5654],
    ["新北市", 25.0169, 121.4628],
    ["桃园市", 24.9937, 121.301],
    ["台中市", 24.1477, 120.6736],
    ["台南市", 22.9999, 120.227],
    ["高雄市", 22.6273, 120.3014],
    ["基隆市", 25.1276, 121.7392],
    ["新竹市", 24.8138, 120.9675],
    ["嘉义市", 23.4801, 120.4491],
    ["新竹县", 24.8394, 121.0177],
    ["苗栗县", 24.5602, 120.8214],
    ["彰化县", 24.0518, 120.5161],
    ["南投县", 23.9609, 120.9719],
    ["云林县", 23.7092, 120.4313],
    ["嘉义县", 23.4518, 120.2555],
    ["屏东县", 22.5519, 120.5488],
    ["宜兰县", 24.7021, 121.7378],
    ["花莲县", 23.9872, 121.6015],
    ["台东县", 22.7972, 121.0714],
    ["澎湖县", 23.5711, 119.5793],
    ["金门县", 24.4321, 118.3171],
    ["连江县", 26.1605, 119.9517],
  ],
  香港特别行政区: [["香港", 22.3193, 114.1694]],
  澳门特别行政区: [["澳门", 22.1987, 113.5439]],
};

const manualCoords = new Map(
  [
    ["海南省|三沙市", [16.8321, 112.3336]],
    ["海南省|西沙群岛", [16.6707, 112.1606]],
    ["海南省|中沙群岛的岛礁及其海域", [15.9144, 114.3604]],
    ["海南省|中沙群岛", [15.9144, 114.3604]],
    ["海南省|南沙群岛", [8.7418, 114.3995]],
    ["海南省|东沙群岛", [20.6992, 116.7297]],
    ["新疆维吾尔自治区|石河子市", [44.3059, 86.0806]],
    ["新疆维吾尔自治区|阿拉尔市", [40.5477, 81.2807]],
    ["新疆维吾尔自治区|图木舒克市", [39.8649, 79.0749]],
    ["新疆维吾尔自治区|五家渠市", [44.1674, 87.5432]],
    ["新疆维吾尔自治区|铁门关市", [41.8687, 85.6753]],
    ["新疆维吾尔自治区|北屯市", [47.3532, 87.8249]],
    ["新疆维吾尔自治区|双河市", [44.8442, 82.3537]],
    ["新疆维吾尔自治区|可克达拉市", [43.947, 81.0448]],
    ["新疆维吾尔自治区|昆玉市", [37.2079, 79.2874]],
    ["新疆维吾尔自治区|胡杨河市", [44.6929, 84.8279]],
  ].map(([key, value]) => [key, { lat: value[0], lng: value[1] }]),
);

const provincesByCode = new Map(provinceRows.map((province) => [province.province, province]));
const citiesByProvince = groupBy(cityRows, "province");
const areasByProvince = groupBy(areaRows, "province");
const cityByProvinceAndCode = new Map(
  cityRows.map((city) => [`${city.province}|${city.city}`, city]),
);
const geoByKey = new Map(
  geoRows.map((row) => [`${row.province}|${row.city}|${row.area}`, normalizeGeo(row)]),
);
const provinceBounds = buildProvinceBounds();

const data = [
  {
    country: COUNTRY,
    regions: provinceRows.map(buildProvince),
  },
];

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(
  OUT_FILE,
  `globalThis.CHINA_LOCATION_DATA = ${JSON.stringify(data, null, 2)};\n`,
  "utf8",
);

const placeCount = data[0].regions.reduce((sum, region) => sum + region.places.length, 0);
console.log(`Generated ${data[0].regions.length} regions and ${placeCount} places.`);

function buildProvince(province) {
  const name = province.name;
  const places = [];

  const provinceCenter = getProvinceCenter(name);
  if (DIRECT_CITY_PROVINCES.has(name)) {
    places.push({
      code: province.code,
      name,
      displayName: name,
      level: "province-city",
      lat: provinceCenter.lat,
      lng: provinceCenter.lng,
      region: [COUNTRY, name],
    });
  }

  for (const city of (citiesByProvince.get(province.province) || []).filter((item) => !FAKE_PARENT_PATTERN.test(item.name))) {
    const point = bestPoint(name, city.name, "", provinceCenter);
    places.push({
      code: city.code,
      name: city.name,
      displayName: city.name,
      level: "prefecture",
      lat: point.lat,
      lng: point.lng,
      region: [COUNTRY, name, city.name],
    });
  }

  for (const area of areasByProvince.get(province.province) || []) {
    const parent = cityByProvinceAndCode.get(`${area.province}|${area.city}`);
    const parentName = parent && !FAKE_PARENT_PATTERN.test(parent.name) ? parent.name : "";
    const point = bestPoint(name, parentName || "市辖区", area.name, provinceCenter);
    const region = [COUNTRY, name, parentName, area.name].filter(Boolean);
    const shortName = area.name === "中沙群岛的岛礁及其海域" ? "中沙群岛" : area.name;
    const displayName = parentName && parentName !== shortName ? `${shortName}（${parentName}）` : shortName;
    places.push({
      code: area.code,
      name: area.name,
      displayName,
      parentName,
      level: area.name.endsWith("市") ? "county-city" : "county",
      lat: point.lat,
      lng: point.lng,
      region,
    });
  }

  for (const [manualName, lat, lng] of manualPlaces[name] || []) {
    places.push({
      code: `${province.code}-${manualName}`,
      name: manualName,
      displayName: manualName,
      level: manualName.endsWith("市") ? "county-city" : "county",
      lat,
      lng,
      region: [COUNTRY, name, manualName],
    });
  }

  return {
    code: province.code,
    name,
    lat: provinceCenter.lat,
    lng: provinceCenter.lng,
    places: dedupePlaces(places),
  };
}

function bestPoint(provinceName, cityName, areaName, fallback) {
  const manual = manualCoords.get(`${provinceName}|${areaName || cityName}`);
  if (manual) return manual;

  const candidates = [
    geoByKey.get(`${provinceName}|${cityName}|${areaName}`),
    areaName ? geoByKey.get(`${provinceName}|市辖区|${areaName}`) : null,
    cityName ? geoByKey.get(`${provinceName}|${cityName}|`) : null,
    fallback,
  ].filter(Boolean);

  return candidates.find((point) => isPointInProvince(provinceName, point)) || fallback;
}

function getProvinceCenter(provinceName) {
  const manual = (manualPlaces[provinceName] || [])[0];
  if (manual) return { lat: manual[1], lng: manual[2] };

  const emptyRow = geoRows.find((row) => row.province === provinceName && row.area === "");
  const emptyPoint = normalizeGeo(emptyRow);
  if (emptyPoint && isPointInProvince(provinceName, emptyPoint)) return emptyPoint;

  const points = geoRows
    .filter((row) => row.province === provinceName)
    .map(normalizeGeo)
    .filter(Boolean)
    .filter((point) => isPointInProvince(provinceName, point));

  if (!points.length) return { lat: 34.6, lng: 106.8 };
  return {
    lat: round(points.reduce((sum, point) => sum + point.lat, 0) / points.length),
    lng: round(points.reduce((sum, point) => sum + point.lng, 0) / points.length),
  };
}

function buildProvinceBounds() {
  const result = new Map();
  for (const province of provinceRows) {
    const points = geoRows
      .filter((row) => row.province === province.name)
      .map(normalizeGeo)
      .filter(Boolean);
    if (!points.length) continue;
    const lats = points.map((point) => point.lat);
    const lngs = points.map((point) => point.lng);
    result.set(province.name, {
      minLat: Math.min(...lats) - 1.2,
      maxLat: Math.max(...lats) + 1.2,
      minLng: Math.min(...lngs) - 1.2,
      maxLng: Math.max(...lngs) + 1.2,
    });
  }
  return result;
}

function isPointInProvince(provinceName, point) {
  if (!point) return false;
  const bounds = provinceBounds.get(provinceName);
  if (!bounds) return true;
  return (
    point.lat >= bounds.minLat &&
    point.lat <= bounds.maxLat &&
    point.lng >= bounds.minLng &&
    point.lng <= bounds.maxLng
  );
}

function normalizeGeo(row) {
  if (!row) return null;
  const lat = Number(row.lat);
  const lng = Number(row.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat: round(lat), lng: round(lng) };
}

function dedupePlaces(places) {
  const seen = new Set();
  return places.filter((place) => {
    const key = place.region.join("/");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function groupBy(rows, key) {
  const map = new Map();
  for (const row of rows) {
    const value = row[key];
    if (!map.has(value)) map.set(value, []);
    map.get(value).push(row);
  }
  return map;
}

function round(value) {
  return Math.round(value * 1_000_000) / 1_000_000;
}
