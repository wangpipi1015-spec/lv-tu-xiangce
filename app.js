const STORAGE_KEY = "couple-travel-album-v3";
const IMAGE_DB_NAME = "couple-travel-album-images";
const IMAGE_STORE_NAME = "images";
const IMPORT_CONCURRENCY = 4;
const IMPORT_IMAGE_MAX_SIZE = 1600;
const IMPORT_IMAGE_QUALITY = 0.82;
const EXIF_SCAN_BYTES = 512 * 1024;
const DEFAULT_GPS_PLACE_NAME = "照片 GPS 地点";
const RESOLVING_PLACE_NAME = "正在识别地点...";
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const CHINESE_MAP_LABEL_FIELD = [
  "case",
  [
    "any",
    ["match", ["get", "name:zh-Hans"], ["台湾", "台灣", "臺灣"], true, false],
    ["match", ["get", "name:zh"], ["台湾", "台灣", "臺灣"], true, false],
    ["match", ["get", "name:zh-CN"], ["台湾", "台灣", "臺灣"], true, false],
    ["==", ["get", "name"], "Taiwan"],
  ],
  "台湾省",
  ["coalesce", ["get", "name:zh-Hans"], ["get", "name:zh"], ["get", "name:zh-CN"], ""],
];
const CHINA_STATE_LABEL_NAMES = [
  "北京市",
  "北京",
  "天津市",
  "天津",
  "上海市",
  "上海",
  "重庆市",
  "重庆",
  "河北省",
  "河北",
  "山西省",
  "山西",
  "辽宁省",
  "辽宁",
  "吉林省",
  "吉林",
  "黑龙江省",
  "黑龙江",
  "江苏省",
  "江苏",
  "浙江省",
  "浙江",
  "安徽省",
  "安徽",
  "福建省",
  "福建",
  "江西省",
  "江西",
  "山东省",
  "山东",
  "河南省",
  "河南",
  "湖北省",
  "湖北",
  "湖南省",
  "湖南",
  "广东省",
  "广东",
  "海南省",
  "海南",
  "四川省",
  "四川",
  "贵州省",
  "贵州",
  "云南省",
  "云南",
  "陕西省",
  "陕西",
  "甘肃省",
  "甘肃",
  "青海省",
  "青海",
  "台湾省",
  "台湾",
  "內蒙古自治區",
  "内蒙古自治区",
  "内蒙古",
  "廣西壯族自治區",
  "广西壮族自治区",
  "广西",
  "西藏自治区",
  "西藏",
  "寧夏回族自治區",
  "宁夏回族自治区",
  "宁夏",
  "新疆维吾尔自治区",
  "新疆",
  "香港特别行政区",
  "香港",
  "澳门特别行政区",
  "澳门",
];
const CHINA_STATE_LABEL_FILTER = ["match", CHINESE_MAP_LABEL_FIELD, CHINA_STATE_LABEL_NAMES, true, false];
const TAIWAN_PROVINCE_LABEL_FILTER = ["match", CHINESE_MAP_LABEL_FIELD, ["台湾省"], true, false];
const CHINA_LABEL_AREA = {
  type: "MultiPolygon",
  coordinates: [
    [
      [
        [73.4, 39.3],
        [75.2, 40.4],
        [76.5, 42.9],
        [80.2, 45.1],
        [82.6, 47.2],
        [85.7, 48.4],
        [87.8, 49.2],
        [91.1, 47.7],
        [96.4, 42.8],
        [100.2, 42.7],
        [105.8, 41.8],
        [111.5, 43.7],
        [115.8, 48.1],
        [117.8, 49.6],
        [120.7, 53.3],
        [121.4, 53.4],
        [126.2, 52.3],
        [132.7, 48.2],
        [134.7, 47.2],
        [130.7, 42.3],
        [124.1, 39.8],
        [122.3, 37.1],
        [119.9, 34.7],
        [121.7, 30.8],
        [119.8, 26.5],
        [117.5, 23.5],
        [111.1, 18],
        [108, 21.4],
        [103, 22],
        [98.7, 24.1],
        [97.5, 28.2],
        [94.7, 29.2],
        [88.9, 27.9],
        [84.5, 30.1],
        [80.4, 35],
        [76.9, 35.5],
        [73.4, 39.3],
      ],
    ],
    [
      [
        [108.6, 18],
        [111.2, 18],
        [111.2, 20.4],
        [108.6, 20.4],
        [108.6, 18],
      ],
    ],
    [
      [
        [119.1, 21.7],
        [122.3, 21.7],
        [122.3, 25.6],
        [119.1, 25.6],
        [119.1, 21.7],
      ],
    ],
  ],
};
const CHINA_LABEL_FILTER = ["within", CHINA_LABEL_AREA];
const MAP_LABEL_LAYERS = [
  {
    id: "label_state",
    minZoom: 3,
    maxZoom: 7.4,
    filter: ["all", ["==", ["get", "class"], "state"], CHINA_STATE_LABEL_FILTER],
  },
  {
    id: "label_city",
    minZoom: 5.2,
    maxZoom: 13,
    filter: [
      "all",
      ["==", ["get", "class"], "city"],
      ["!=", ["get", "capital"], 2],
      CHINA_LABEL_FILTER,
    ],
  },
  {
    id: "label_city_capital",
    minZoom: 5.2,
    maxZoom: 13,
    filter: [
      "all",
      ["==", ["get", "class"], "city"],
      ["==", ["get", "capital"], 2],
      CHINA_LABEL_FILTER,
    ],
  },
  {
    id: "label_town",
    minZoom: 8,
    maxZoom: 13,
    filter: ["all", ["==", ["get", "class"], "town"], CHINA_LABEL_FILTER],
  },
  {
    id: "label_village",
    minZoom: 9.2,
    maxZoom: 13,
    filter: ["all", ["==", ["get", "class"], "village"], CHINA_LABEL_FILTER],
  },
  {
    id: "label_other",
    minZoom: 10.4,
    maxZoom: 13,
    filter: [
      "all",
      ["match", ["get", "class"], ["city", "continent", "country", "state", "town", "village"], false, true],
      CHINA_LABEL_FILTER,
    ],
  },
];
const COUNTRY_LABEL_LAYERS = [
  {
    id: "label_country_1",
    minZoom: 1.8,
    maxZoom: 4.7,
    filter: [
      "all",
      ["==", ["get", "class"], "country"],
      ["==", ["get", "rank"], 1],
      ["!", TAIWAN_PROVINCE_LABEL_FILTER],
      CHINA_LABEL_FILTER,
    ],
  },
  {
    id: "label_country_2",
    minZoom: 1.8,
    maxZoom: 4.7,
    filter: [
      "all",
      ["==", ["get", "class"], "country"],
      ["==", ["get", "rank"], 2],
      ["!", TAIWAN_PROVINCE_LABEL_FILTER],
      CHINA_LABEL_FILTER,
    ],
  },
  {
    id: "label_country_3",
    minZoom: 2,
    maxZoom: 4.7,
    filter: [
      "all",
      ["==", ["get", "class"], "country"],
      [">=", ["get", "rank"], 3],
      ["!", TAIWAN_PROVINCE_LABEL_FILTER],
      CHINA_LABEL_FILTER,
    ],
  },
];
const ADMIN_BOUNDARY_LAYERS = [
  {
    id: "travel-province-boundaries",
    minZoom: 2.6,
    maxZoom: 13,
    filter: [
      "all",
      [">=", ["get", "admin_level"], 3],
      ["<=", ["get", "admin_level"], 4],
      ["!=", ["get", "maritime"], 1],
      ["!=", ["get", "disputed"], 1],
      CHINA_LABEL_FILTER,
    ],
    paint: {
      "line-color": "#d86f94",
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 3, 0.42, 6, 0.66, 10, 0.5],
      "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.9, 6, 1.55, 10, 2.3],
    },
  },
  {
    id: "travel-city-boundaries",
    minZoom: 4.6,
    maxZoom: 13,
    filter: [
      "all",
      [">=", ["get", "admin_level"], 5],
      ["<=", ["get", "admin_level"], 6],
      ["!=", ["get", "maritime"], 1],
      ["!=", ["get", "disputed"], 1],
      CHINA_LABEL_FILTER,
    ],
    paint: {
      "line-color": "#d86f94",
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 4.6, 0.38, 5.8, 0.62, 9, 0.5],
      "line-width": ["interpolate", ["linear"], ["zoom"], 4.6, 0.55, 6.5, 0.92, 10, 1.28],
    },
  },
];
const CHINA_VIEW = {
  center: [106.8, 34.6],
  zoom: 4.05,
  bounds: [
    [73, 18],
    [135, 54],
  ],
};
const CITY_FALLBACKS = [
  { name: "贵阳市", lat: 26.647, lng: 106.6302, radius: 1.1 },
  { name: "成都市", lat: 30.5728, lng: 104.0668, radius: 1.1 },
  { name: "昆明市", lat: 25.0389, lng: 102.7183, radius: 1.1 },
  { name: "重庆市", lat: 29.563, lng: 106.5516, radius: 1.1 },
  { name: "西安市", lat: 34.3416, lng: 108.9398, radius: 1.1 },
  { name: "北京市", lat: 39.9042, lng: 116.4074, radius: 1.1 },
  { name: "上海市", lat: 31.2304, lng: 121.4737, radius: 1.1 },
  { name: "广州市", lat: 23.1291, lng: 113.2644, radius: 1.1 },
  { name: "杭州市", lat: 30.2741, lng: 120.1551, radius: 1.1 },
  { name: "南京市", lat: 32.0603, lng: 118.7969, radius: 1.1 },
  { name: "武汉市", lat: 30.5928, lng: 114.3055, radius: 1.1 },
  { name: "长沙市", lat: 28.2282, lng: 112.9388, radius: 1.1 },
];
const KNOWN_CHINA_PLACES = [
  { name: "北京市", aliases: ["北京"], lat: 39.9042, lng: 116.4074 },
  { name: "天津市", aliases: ["天津"], lat: 39.3434, lng: 117.3616 },
  { name: "上海市", aliases: ["上海"], lat: 31.2304, lng: 121.4737 },
  { name: "重庆市", aliases: ["重庆"], lat: 29.563, lng: 106.5516 },
  { name: "河北省", aliases: ["河北", "石家庄市", "石家庄"], lat: 38.0428, lng: 114.5149 },
  { name: "山西省", aliases: ["山西", "太原市", "太原"], lat: 37.8706, lng: 112.5489 },
  { name: "辽宁省", aliases: ["辽宁", "沈阳市", "沈阳"], lat: 41.8057, lng: 123.4315 },
  { name: "吉林省", aliases: ["吉林", "长春市", "长春"], lat: 43.8171, lng: 125.3235 },
  { name: "黑龙江省", aliases: ["黑龙江", "哈尔滨市", "哈尔滨"], lat: 45.8038, lng: 126.5349 },
  { name: "江苏省", aliases: ["江苏", "南京市", "南京"], lat: 32.0603, lng: 118.7969 },
  { name: "浙江省", aliases: ["浙江", "杭州市", "杭州"], lat: 30.2741, lng: 120.1551 },
  { name: "安徽省", aliases: ["安徽", "合肥市", "合肥"], lat: 31.8206, lng: 117.2272 },
  { name: "福建省", aliases: ["福建", "福州市", "福州"], lat: 26.0745, lng: 119.2965 },
  { name: "江西省", aliases: ["江西", "南昌市", "南昌"], lat: 28.682, lng: 115.8579 },
  { name: "山东省", aliases: ["山东", "济南市", "济南"], lat: 36.6512, lng: 117.1201 },
  { name: "河南省", aliases: ["河南", "郑州市", "郑州"], lat: 34.7466, lng: 113.6254 },
  { name: "湖北省", aliases: ["湖北", "武汉市", "武汉"], lat: 30.5928, lng: 114.3055 },
  { name: "湖南省", aliases: ["湖南", "长沙市", "长沙"], lat: 28.2282, lng: 112.9388 },
  { name: "广东省", aliases: ["广东", "广州市", "广州"], lat: 23.1291, lng: 113.2644 },
  { name: "海南省", aliases: ["海南", "海口市", "海口"], lat: 20.044, lng: 110.1999 },
  { name: "四川省", aliases: ["四川", "成都市", "成都"], lat: 30.5728, lng: 104.0668 },
  { name: "贵州省", aliases: ["贵州", "贵阳市", "贵阳"], lat: 26.647, lng: 106.6302 },
  { name: "云南省", aliases: ["云南", "昆明市", "昆明"], lat: 25.0389, lng: 102.7183 },
  { name: "陕西省", aliases: ["陕西", "西安市", "西安"], lat: 34.3416, lng: 108.9398 },
  { name: "甘肃省", aliases: ["甘肃", "兰州市", "兰州"], lat: 36.0611, lng: 103.8343 },
  { name: "青海省", aliases: ["青海", "西宁市", "西宁"], lat: 36.6171, lng: 101.7782 },
  { name: "台湾省", aliases: ["台湾", "台灣", "臺灣", "台北市", "台北"], lat: 25.033, lng: 121.5654 },
  { name: "内蒙古自治区", aliases: ["内蒙古", "呼和浩特市", "呼和浩特"], lat: 40.8426, lng: 111.7492 },
  { name: "广西壮族自治区", aliases: ["广西", "南宁市", "南宁"], lat: 22.817, lng: 108.3669 },
  { name: "西藏自治区", aliases: ["西藏", "拉萨市", "拉萨"], lat: 29.652, lng: 91.1721 },
  { name: "宁夏回族自治区", aliases: ["宁夏", "银川市", "银川"], lat: 38.4872, lng: 106.2309 },
  { name: "新疆维吾尔自治区", aliases: ["新疆", "乌鲁木齐市", "乌鲁木齐"], lat: 43.8256, lng: 87.6168 },
  { name: "香港特别行政区", aliases: ["香港"], lat: 22.3193, lng: 114.1694 },
  { name: "澳门特别行政区", aliases: ["澳门", "澳門"], lat: 22.1987, lng: 113.5439 },
  { name: "南充市", aliases: ["南充"], lat: 30.8373, lng: 106.1107 },
  { name: "南部县", aliases: ["南部"], lat: 31.3532, lng: 106.0673 },
  { name: "达州市", aliases: ["达州"], lat: 31.2096, lng: 107.468 },
  { name: "渠县", aliases: ["渠县"], lat: 30.8366, lng: 106.9738 },
  { name: "大竹县", aliases: ["大竹"], lat: 30.7361, lng: 107.2044 },
  { name: "广安市", aliases: ["广安"], lat: 30.4564, lng: 106.6332 },
  { name: "岳池县", aliases: ["岳池"], lat: 30.5387, lng: 106.4408 },
  { name: "邻水县", aliases: ["邻水"], lat: 30.3346, lng: 106.9304 },
  { name: "遂宁市", aliases: ["遂宁"], lat: 30.5328, lng: 105.5929 },
  { name: "资阳市", aliases: ["资阳"], lat: 30.1286, lng: 104.6276 },
  { name: "内江市", aliases: ["内江"], lat: 29.5802, lng: 105.0584 },
  { name: "自贡市", aliases: ["自贡"], lat: 29.3392, lng: 104.7784 },
  { name: "宜宾市", aliases: ["宜宾"], lat: 28.7513, lng: 104.6417 },
  { name: "泸州市", aliases: ["泸州"], lat: 28.8718, lng: 105.4423 },
  { name: "乐山市", aliases: ["乐山"], lat: 29.5521, lng: 103.7656 },
  { name: "雅安市", aliases: ["雅安"], lat: 30.0167, lng: 103.0415 },
  { name: "绵阳市", aliases: ["绵阳"], lat: 31.4675, lng: 104.6796 },
  { name: "广元市", aliases: ["广元"], lat: 32.4355, lng: 105.8436 },
  { name: "阆中市", aliases: ["阆中"], lat: 31.5584, lng: 106.005 },
  { name: "射洪市", aliases: ["射洪"], lat: 30.8711, lng: 105.3884 },
  { name: "蓬溪县", aliases: ["蓬溪"], lat: 30.7576, lng: 105.7075 },
  { name: "西充县", aliases: ["西充"], lat: 30.9956, lng: 105.893 },
  { name: "江津区", aliases: ["江津"], lat: 29.2901, lng: 106.2593 },
  { name: "涪陵区", aliases: ["涪陵"], lat: 29.7031, lng: 107.3893 },
];
const LOCATION_PICKER_DATA = Array.isArray(globalThis.CHINA_LOCATION_DATA)
  ? globalThis.CHINA_LOCATION_DATA
  : [];
const pendingAddressLookups = new Set();
let markerIntentPointerKey = null;
let importProgressHideTimer = 0;

const state = {
  photos: [],
  selectedId: null,
  view: "grid",
  activePlaceKey: null,
  photoReturnPlaceKey: null,
  detailMode: "photo",
  batchMode: false,
  batchSelected: new Set(),
  currentImportIds: new Set(),
  map: null,
  markers: new Map(),
};

const els = {
  input: document.querySelector("#photoInput"),
  detailPanel: document.querySelector("#detailPanel"),
  detailTitle: document.querySelector("#detailTitle"),
  cityAlbumPanel: document.querySelector("#cityAlbumPanel"),
  cityAlbumTitle: document.querySelector("#cityAlbumTitle"),
  cityAlbumMeta: document.querySelector("#cityAlbumMeta"),
  cityAlbumGallery: document.querySelector("#cityAlbumGallery"),
  batchManage: document.querySelector("#batchManage"),
  batchToolbar: document.querySelector("#batchToolbar"),
  batchSelectedCount: document.querySelector("#batchSelectedCount"),
  batchSelectAll: document.querySelector("#batchSelectAll"),
  batchMoveTarget: document.querySelector("#batchMoveTarget"),
  batchMove: document.querySelector("#batchMove"),
  batchDelete: document.querySelector("#batchDelete"),
  dropZone: document.querySelector(".drop-zone"),
  importProgress: document.querySelector("#importProgress"),
  importProgressText: document.querySelector("#importProgressText"),
  importProgressCount: document.querySelector("#importProgressCount"),
  importProgressBar: document.querySelector("#importProgressBar"),
  openDetail: document.querySelector("#openDetail"),
  backHome: document.querySelector("#backHome"),
  gallery: document.querySelector("#gallery"),
  empty: document.querySelector("#emptyState"),
  form: document.querySelector("#photoForm"),
  deletePhoto: document.querySelector("#deletePhoto"),
  clearAll: document.querySelector("#clearAll"),
  gridView: document.querySelector("#gridView"),
  placeView: document.querySelector("#placeView"),
  fields: {
    placeName: document.querySelector("#placeName"),
    placeRegion: document.querySelector("#placeRegion"),
    latitude: document.querySelector("#latitude"),
    longitude: document.querySelector("#longitude"),
    takenAt: document.querySelector("#takenAt"),
    memory: document.querySelector("#memory"),
  },
  locationPicker: {
    country: document.querySelector("#countrySelect"),
    province: document.querySelector("#provinceSelect"),
    city: document.querySelector("#citySelect"),
    area: document.querySelector("#areaSelect"),
  },
  savePhoto: document.querySelector("#savePhoto"),
  setCoverPhoto: document.querySelector("#setCoverPhoto"),
  tripCount: document.querySelector("#tripCount"),
  photoCount: document.querySelector("#photoCount"),
  memoryCount: document.querySelector("#memoryCount"),
  zoomInMap: document.querySelector("#zoomInMap"),
  zoomOutMap: document.querySelector("#zoomOutMap"),
  mapOverlay: document.querySelector("#mapOverlay"),
  mapFallback: document.querySelector("#mapFallback"),
};
let isSyncingLocationPicker = false;

document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  await loadState();
  initLocationPicker();
  initMap();
  bindEvents();
  render();
  hydrateMissingAddresses();
}

function bindEvents() {
  els.input.addEventListener("change", handleUpload);
  document.querySelector(".drop-zone").addEventListener("dragover", handleDragOver);
  document.querySelector(".drop-zone").addEventListener("drop", handleDrop);
  els.form.addEventListener("submit", saveSelectedPhoto);
  els.openDetail.addEventListener("click", openDetailPanel);
  els.backHome.addEventListener("click", closeDetailPanel);
  els.deletePhoto.addEventListener("click", deleteSelectedPhoto);
  els.batchManage.addEventListener("click", toggleBatchMode);
  els.batchSelectAll.addEventListener("click", toggleBatchSelectAll);
  els.batchDelete.addEventListener("click", deleteBatchPhotos);
  els.batchMove.addEventListener("click", moveBatchPhotos);
  els.clearAll.addEventListener("click", clearAll);
  els.setCoverPhoto.addEventListener("click", setSelectedPhotoAsCover);
  els.gridView.addEventListener("click", () => setView("grid"));
  els.placeView.addEventListener("click", () => setView("places"));
  els.locationPicker.country.addEventListener("change", handleCountryPickerChange);
  els.locationPicker.province.addEventListener("change", handleProvincePickerChange);
  els.locationPicker.city.addEventListener("change", handleCityPickerChange);
  els.locationPicker.area.addEventListener("change", handleAreaPickerChange);
  els.zoomInMap.addEventListener("click", () => zoomMap(1));
  els.zoomOutMap.addEventListener("click", () => zoomMap(-1));
  els.mapOverlay.addEventListener("click", handleOverlayMapClick);
  document.addEventListener("click", handleHeartMarkerIntent, true);
  document.addEventListener("pointerdown", handleHeartMarkerIntent, true);
  document.addEventListener("keydown", handleHeartMarkerIntent, true);
}

function initLocationPicker() {
  const countries = LOCATION_PICKER_DATA.map((item) => ({
    value: item.country,
    label: item.country,
  }));
  fillSelect(els.locationPicker.country, countries, "选择国家");
  if (countries.length === 1) {
    els.locationPicker.country.value = countries[0].value;
  }
  populateProvincePicker();
}

function handleCountryPickerChange() {
  if (isSyncingLocationPicker) return;
  populateProvincePicker();
}

function handleProvincePickerChange() {
  if (isSyncingLocationPicker) return;
  populateCityPicker();
  const photo = selectedPhoto();
  const place = selectedPickerCity();
  if (!photo || !place || place.level !== "province-city") return;
  assignPhotoLocationFromPicker(photo, place);
  persist();
  render();
  locateSelected();
}

function handleCityPickerChange() {
  if (isSyncingLocationPicker) return;
  const photo = selectedPhoto();
  const place = selectedPickerArea() || selectedPickerCity();
  populateAreaPicker();
  if (!photo || !place) return;
  assignPhotoLocationFromPicker(photo, place);
  persist();
  render();
  locateSelected();
}

function handleAreaPickerChange() {
  if (isSyncingLocationPicker) return;
  const photo = selectedPhoto();
  const place = selectedPickerArea() || selectedPickerCity();
  if (!photo || !place) return;
  assignPhotoLocationFromPicker(photo, place);
  persist();
  render();
  locateSelected();
}

function populateProvincePicker(selectedCode = "") {
  const country = selectedPickerCountry();
  const regions = country?.regions || [];
  fillSelect(
    els.locationPicker.province,
    regions.map((region) => ({ value: region.code, label: region.name })),
    "选择省级地区",
  );
  els.locationPicker.province.value = regions.some((region) => region.code === selectedCode)
    ? selectedCode
    : "";
  populateCityPicker();
}

function populateCityPicker(selectedCode = "") {
  const region = selectedPickerRegion();
  const directCity = directCityForRegion(region);
  if (directCity) {
    fillSelect(els.locationPicker.city, [], "直辖市无需选择市");
    els.locationPicker.city.disabled = true;
    populateAreaPicker();
    return;
  }

  const places = pickerCitiesForRegion(region);
  fillSelect(
    els.locationPicker.city,
    places.map((place) => ({
      value: place.code,
      label: place.displayName || place.name,
    })),
    "选择城市",
  );
  els.locationPicker.city.value = places.some((place) => place.code === selectedCode)
    ? selectedCode
    : "";
  els.locationPicker.city.disabled = !selectedPhoto() || LOCATION_PICKER_DATA.length === 0;
  populateAreaPicker();
}

function populateAreaPicker(selectedCode = "") {
  const places = pickerAreasForCity(selectedPickerRegion(), selectedPickerCity());
  fillSelect(
    els.locationPicker.area,
    places.map((place) => ({
      value: place.code,
      label: areaPickerLabel(place),
    })),
    "选择区县（可选）",
  );
  els.locationPicker.area.value = places.some((place) => place.code === selectedCode)
    ? selectedCode
    : "";
  els.locationPicker.area.disabled =
    !selectedPhoto() || LOCATION_PICKER_DATA.length === 0 || places.length === 0;
}

function fillSelect(select, options, placeholder) {
  select.innerHTML = "";
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = placeholder;
  select.appendChild(empty);

  for (const option of options) {
    const element = document.createElement("option");
    element.value = option.value;
    element.textContent = option.label;
    select.appendChild(element);
  }
}

function selectedPickerCountry() {
  const country = els.locationPicker.country.value;
  return LOCATION_PICKER_DATA.find((item) => item.country === country) || null;
}

function selectedPickerRegion() {
  const country = selectedPickerCountry();
  const code = els.locationPicker.province.value;
  return country?.regions.find((region) => region.code === code) || null;
}

function selectedPickerCity() {
  const region = selectedPickerRegion();
  const directCity = directCityForRegion(region);
  if (directCity) return directCity;
  const code = els.locationPicker.city.value;
  return pickerCitiesForRegion(region).find((place) => place.code === code) || null;
}

function selectedPickerArea() {
  const region = selectedPickerRegion();
  const city = selectedPickerCity();
  const code = els.locationPicker.area.value;
  return pickerAreasForCity(region, city).find((place) => place.code === code) || null;
}

function selectedPickerPlace() {
  return selectedPickerArea() || selectedPickerCity();
}

function pickerCitiesForRegion(region) {
  if (!region) return [];
  const parentNames = new Set(region.places.map((place) => place.parentName).filter(Boolean));
  return region.places.filter((place) => {
    if (["prefecture", "province-city"].includes(place.level)) return true;
    if (place.parentName) return false;
    if (parentNames.has(place.name)) return false;
    return ["county-city", "county"].includes(place.level);
  });
}

function directCityForRegion(region) {
  return region?.places.find((place) => place.level === "province-city") || null;
}

function pickerAreasForCity(region, city) {
  if (!region || !city) return [];
  if (city.level === "province-city") {
    return region.places.filter((place) => place.code !== city.code && !place.parentName);
  }
  return region.places.filter((place) => place.parentName === city.name);
}

function areaPickerLabel(place) {
  if (!place) return "";
  return place.name === "中沙群岛的岛礁及其海域" ? "中沙群岛" : place.name;
}

function assignPhotoLocationFromPicker(photo, place) {
  photo.placeRegion = place.region.join(" ");
  photo.lat = roundCoord(place.lat);
  photo.lng = roundCoord(place.lng);
  photo.addressStatus = "manual";
  photo.locationCountry = place.region[0] || "中国";
  photo.locationProvinceCode = selectedPickerRegion()?.code || "";
  photo.locationCityCode = selectedPickerCity()?.code || "";
  photo.locationPlaceCode = place.code;
  if (shouldReplaceAutoPlaceName(photo.placeName)) {
    photo.placeName = place.name || place.displayName || "";
  }
  updateFields(photo);
}

function clearSelectedPhotoLocationFromPicker() {
  const photo = selectedPhoto();
  if (!photo) return;
  const place = selectedPickerPlace();
  if (place) {
    assignPhotoLocationFromPicker(photo, place);
  } else {
    photo.placeRegion = "";
    photo.locationProvinceCode = els.locationPicker.province.value || "";
    photo.locationCityCode = "";
    photo.locationPlaceCode = "";
    if (!hasLocation(photo)) photo.addressStatus = "needs-manual";
    els.fields.placeRegion.value = "";
  }
  persist();
  render();
}

function syncLocationPickerFromPhoto(photo) {
  isSyncingLocationPicker = true;
  try {
    const countryValue = pickerCountryForPhoto(photo);
    els.locationPicker.country.value = countryValue;
    const province = pickerProvinceForPhoto(photo, countryValue);
    populateProvincePicker(province?.code || "");
    const city = province ? pickerCityForPhoto(photo, province) : null;
    populateCityPicker(city?.code || "");
    const area = province && city ? pickerAreaForPhoto(photo, province, city) : null;
    populateAreaPicker(area?.code || "");
  } finally {
    isSyncingLocationPicker = false;
  }
}

function pickerCountryForPhoto(photo) {
  if (photo?.locationCountry && LOCATION_PICKER_DATA.some((item) => item.country === photo.locationCountry)) {
    return photo.locationCountry;
  }
  return LOCATION_PICKER_DATA[0]?.country || "";
}

function pickerProvinceForPhoto(photo, countryValue) {
  const country = LOCATION_PICKER_DATA.find((item) => item.country === countryValue);
  if (!country || !photo) return null;
  if (photo.locationProvinceCode) {
    const byCode = country.regions.find((region) => region.code === photo.locationProvinceCode);
    if (byCode) return byCode;
  }
  const parts = normalizeRegionParts(photo.placeRegion || "");
  return country.regions.find((region) => parts.includes(region.name)) || null;
}

function pickerCityForPhoto(photo, region) {
  if (!photo || !region) return null;
  const directCity = directCityForRegion(region);
  if (directCity) return directCity;
  const cityPlaces = pickerCitiesForRegion(region);
  if (photo.locationCityCode) {
    const byCode = cityPlaces.find((place) => place.code === photo.locationCityCode);
    if (byCode) return byCode;
  }
  const parts = normalizeRegionParts(photo.placeRegion || "");
  const cityPart = parts[2] || "";
  const city = cityPlaces.find((place) => place.name === cityPart || place.displayName === cityPart);
  if (city) return city;
  const exactRegion = cityPlaces.find((place) => place.region.join(" ") === photo.placeRegion);
  if (exactRegion) return exactRegion;
  const lastPart = parts[parts.length - 1] || "";
  return cityPlaces.find((place) => place.name === lastPart || place.displayName === lastPart) || null;
}

function pickerAreaForPhoto(photo, region, city) {
  if (!photo || !region || !city) return null;
  const areaPlaces = pickerAreasForCity(region, city);
  if (photo.locationPlaceCode) {
    const byCode = areaPlaces.find((place) => place.code === photo.locationPlaceCode);
    if (byCode) return byCode;
  }
  const parts = normalizeRegionParts(photo.placeRegion || "");
  const lastPart = parts[parts.length - 1] || "";
  return areaPlaces.find((place) => place.name === lastPart || place.displayName === lastPart) || null;
}

function handleOverlayMapClick(event) {
  if (event.target.closest?.(".heart-marker")) return;
  const photo = selectedPhoto();
  if (!photo || hasLocation(photo) || !state.map) return;

  const rect = els.mapOverlay.getBoundingClientRect();
  const coordinate = state.map.unproject([event.clientX - rect.left, event.clientY - rect.top]);
  setPhotoLocationFromMap(photo, coordinate);
}

function zoomMap(step) {
  if (!state.map) return;
  state.map.easeTo({
    zoom: state.map.getZoom() + step,
    duration: 260,
  });
}

function setPhotoLocationFromMap(photo, lngLat) {
  photo.lat = roundCoord(lngLat.lat);
  photo.lng = roundCoord(lngLat.lng);
  photo.addressStatus = "resolving";
  if (!photo.placeName) photo.placeName = "手动标记地点";
  updateFields(photo);
  persist();
  render();
  resolvePhotoAddress(photo.id);
  locateSelected();
}

function openDetailPanel() {
  els.detailPanel.hidden = false;
  state.detailMode = "photo";
  exitBatchMode();
  showPhotoEditor({ showTools: true });
  updateFields(selectedPhoto());
}

function closeDetailPanel() {
  if (state.detailMode === "photo" && returnToPhotoAlbum()) return;
  els.detailPanel.hidden = true;
  state.photoReturnPlaceKey = null;
  exitBatchMode();
  fitChinaView();
}

function returnToPhotoAlbum() {
  const returnKey = state.photoReturnPlaceKey;
  if (!returnKey || !state.photos.some((photo) => placeKey(photo) === returnKey)) {
    state.photoReturnPlaceKey = null;
    return false;
  }

  state.activePlaceKey = returnKey;
  state.photoReturnPlaceKey = null;
  exitBatchMode();
  showCityAlbum();
  return true;
}

function showPhotoEditor({ showTools = false } = {}) {
  state.detailMode = "photo";
  state.photoReturnPlaceKey = !showTools && state.activePlaceKey ? state.activePlaceKey : null;
  exitBatchMode();
  els.cityAlbumPanel.hidden = true;
  els.batchManage.hidden = true;
  document.querySelector(".upload-panel").hidden = !showTools;
  document.querySelector(".stats").hidden = !showTools;
  document.querySelector(".editor").hidden = false;
  updateFields(selectedPhoto());
}

function showCityAlbum() {
  state.detailMode = "city";
  state.photoReturnPlaceKey = null;
  els.cityAlbumPanel.hidden = false;
  els.batchManage.hidden = false;
  document.querySelector(".upload-panel").hidden = true;
  document.querySelector(".stats").hidden = true;
  document.querySelector(".editor").hidden = true;
  els.detailTitle.textContent = "城市相册";
  renderCityAlbum();
}

function initMap() {
  if (!window.maplibregl) {
    els.mapFallback.hidden = false;
    return;
  }

  els.mapFallback.hidden = true;
  state.map = new maplibregl.Map({
    container: "map",
    style: MAP_STYLE_URL,
    center: CHINA_VIEW.center,
    zoom: CHINA_VIEW.zoom,
    minZoom: 1.8,
    maxZoom: 13,
    maxBounds: [
      [64, 5],
      [145, 58],
    ],
    attributionControl: false,
    dragPan: true,
    scrollZoom: true,
    touchZoomRotate: true,
  });

  state.map.dragPan.enable();
  state.map.scrollZoom.enable();
  state.map.touchZoomRotate.enable();

  state.map.on("load", () => {
    hideUnneededRoadLayers();
    hideUnneededRiverLayers();
    hideBaseAdministrativeBoundaries();
    applyChineseMapLabels();
    applyAdministrativeBoundaries();
    renderMarkers();
    fitChinaView(0);
  });
  state.map.on("move", positionOverlayMarkers);
  state.map.on("resize", positionOverlayMarkers);

  state.map.on("click", (event) => {
    const photo = selectedPhoto();
    if (photo && !hasLocation(photo)) {
      setPhotoLocationFromMap(photo, event.lngLat);
      return;
    }

    const place = nearestPlaceFromMapPoint(event.point);
    if (place) {
      openPlaceAlbum(place.key);
      return;
    }
  });
}

function applyChineseMapLabels() {
  if (!state.map?.getStyle?.()) return;

  for (const layer of MAP_LABEL_LAYERS) {
    if (!state.map.getLayer(layer.id)) continue;

    state.map.setLayoutProperty(layer.id, "text-field", CHINESE_MAP_LABEL_FIELD);
    state.map.setFilter(layer.id, layer.filter);
    state.map.setLayerZoomRange(layer.id, layer.minZoom, layer.maxZoom);
  }

  for (const layer of COUNTRY_LABEL_LAYERS) {
    if (!state.map.getLayer(layer.id)) continue;

    state.map.setLayoutProperty(layer.id, "text-field", CHINESE_MAP_LABEL_FIELD);
    state.map.setFilter(layer.id, layer.filter);
    state.map.setLayerZoomRange(layer.id, layer.minZoom, layer.maxZoom);
  }

  addTaiwanProvinceLabel();
  applyProvinceLabelStyle("label_state");
  applyProvinceLabelStyle("travel-taiwan-province-label");
}

function addTaiwanProvinceLabel() {
  if (!state.map?.getSource?.("openmaptiles")) return;

  const layerId = "travel-taiwan-province-label";
  const filter = ["all", ["==", ["get", "class"], "country"], TAIWAN_PROVINCE_LABEL_FILTER];
  if (state.map.getLayer(layerId)) {
    state.map.setFilter(layerId, filter);
    state.map.setLayerZoomRange(layerId, 3, 7.4);
    return;
  }

  state.map.addLayer(
    {
      id: layerId,
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      minzoom: 3,
      maxzoom: 7.4,
      filter,
      layout: {
        "text-field": "台湾省",
        "text-font": ["Noto Sans Bold"],
        "text-size": provinceLabelTextSize(),
        "text-transform": "none",
        "text-letter-spacing": 0,
        "text-anchor": "center",
        "text-allow-overlap": false,
        "text-ignore-placement": false,
      },
      paint: provinceLabelPaint(),
    },
    firstExistingLayer(["label_city", "label_city_capital", "label_town"]),
  );
}

function applyProvinceLabelStyle(layerId) {
  if (!state.map.getLayer(layerId)) return;

  state.map.setLayoutProperty(layerId, "text-font", ["Noto Sans Bold"]);
  state.map.setLayoutProperty(layerId, "text-transform", "none");
  state.map.setLayoutProperty(layerId, "text-letter-spacing", 0);
  state.map.setLayoutProperty(layerId, "text-size", provinceLabelTextSize());
  for (const [property, value] of Object.entries(provinceLabelPaint())) {
    state.map.setPaintProperty(layerId, property, value);
  }
}

function provinceLabelTextSize() {
  return ["interpolate", ["linear"], ["zoom"], 3, 15, 5, 18, 7, 22];
}

function provinceLabelPaint() {
  return {
    "text-color": "#154234",
    "text-halo-color": "#fffdf8",
    "text-halo-width": 1.8,
    "text-halo-blur": 0.6,
  };
}

function hideUnneededRoadLayers() {
  const layers = state.map?.getStyle?.().layers || [];
  for (const layer of layers) {
    const isRoadLine = layer["source-layer"] === "transportation" && layer.type === "line";
    const isHighwayShield = layer["source-layer"] === "transportation_name" && layer.id.startsWith("highway-shield");
    if (!isRoadLine && !isHighwayShield) continue;
    if (!state.map.getLayer(layer.id)) continue;
    state.map.setLayoutProperty(layer.id, "visibility", "none");
  }
}

function hideUnneededRiverLayers() {
  const layers = state.map?.getStyle?.().layers || [];
  for (const layer of layers) {
    const isWaterFill = layer["source-layer"] === "water";
    const isRiverLine = layer["source-layer"] === "waterway";
    const isRiverLabel = layer["source-layer"] === "water_name";
    if (!isWaterFill && !isRiverLine && !isRiverLabel) continue;
    if (!state.map.getLayer(layer.id)) continue;
    state.map.setLayoutProperty(layer.id, "visibility", "none");
  }
}

function hideBaseAdministrativeBoundaries() {
  for (const layerId of ["boundary_3"]) {
    if (!state.map.getLayer(layerId)) continue;
    state.map.setLayoutProperty(layerId, "visibility", "none");
  }
}

function applyAdministrativeBoundaries() {
  if (!state.map?.getSource?.("openmaptiles")) return;

  for (const layer of ADMIN_BOUNDARY_LAYERS) {
    if (state.map.getLayer(layer.id)) {
      state.map.setFilter(layer.id, layer.filter);
      state.map.setLayerZoomRange(layer.id, layer.minZoom, layer.maxZoom);
      for (const [property, value] of Object.entries(layer.paint)) {
        state.map.setPaintProperty(layer.id, property, value);
      }
      continue;
    }

    state.map.addLayer(
      {
        id: layer.id,
        type: "line",
        source: "openmaptiles",
        "source-layer": "boundary",
        minzoom: layer.minZoom,
        maxzoom: layer.maxZoom,
        filter: layer.filter,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: layer.paint,
      },
      firstExistingLayer(["label_state", "label_city", "label_city_capital", "label_town"]),
    );
  }
}

function firstExistingLayer(layerIds) {
  return layerIds.find((id) => state.map.getLayer(id));
}

async function handleUpload(event) {
  const files = Array.from(event.target.files || []);
  await addFiles(files);
  event.target.value = "";
}

function handleDragOver(event) {
  event.preventDefault();
}

async function handleDrop(event) {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files || []).filter((file) =>
    file.type.startsWith("image/"),
  );
  await addFiles(files);
}

async function addFiles(files) {
  if (!files.length) return;
  state.currentImportIds.clear();
  const existingSignatures = new Set(
    state.photos.map((photo) => photo.sourceSignature).filter(Boolean),
  );
  const existingFileNames = new Set(state.photos.map((photo) => photo.fileName).filter(Boolean));
  const batchSignatures = new Set();
  const batchFileNames = new Set();
  const importItems = [];
  let duplicateCount = 0;

  for (const file of files) {
    const signature = photoFileSignature(file);
    const repeatedSignature = signature && (existingSignatures.has(signature) || batchSignatures.has(signature));
    const repeatedFileName = file.name && (existingFileNames.has(file.name) || batchFileNames.has(file.name));
    if (repeatedSignature || repeatedFileName) {
      duplicateCount += 1;
      continue;
    }
    if (signature) batchSignatures.add(signature);
    if (file.name) batchFileNames.add(file.name);
    importItems.push({ file, signature });
  }

  if (!importItems.length) {
    window.alert(duplicateCount ? "选中的照片已经在相册里了，无需重复导入。" : "没有可导入的照片。");
    return;
  }

  initImportProgress(importItems.length);
  setImportBusy(true);
  await nextPaint();
  let results = [];
  try {
    results = await mapWithConcurrency(importItems, IMPORT_CONCURRENCY, processImportFile, (done, total) => {
      updateImportProgress(done, total, "正在处理照片");
    });
  } finally {
    setImportBusy(false);
  }

  const imported = results.filter(Boolean);
  const skipped = results.length - imported.length;

  try {
    updateImportProgress(importItems.length, importItems.length, "正在保存照片");
    await savePhotoImages(imported.map((photo) => [photo.id, photo.image]));
    for (const photo of imported) {
      photo.imageRef = photo.id;
    }
  } catch {
    for (const photo of imported) {
      photo.imageRef = "";
    }
  }

  if (!imported.length) {
    finishImportProgress("导入未完成");
    window.alert("这批照片没有成功导入，请换成 JPG/PNG 后再试。");
    return;
  }

  state.photos.unshift(...imported);
  for (const photo of imported) {
    state.currentImportIds.add(photo.id);
  }
  state.selectedId = imported[0].id;

  try {
    persist();
  } catch {
    state.photos = state.photos.filter((photo) => !state.currentImportIds.has(photo.id));
    state.currentImportIds.clear();
    finishImportProgress("导入未完成");
    window.alert("照片太大，本地存储空间不够。请少选几张或选择较小的照片。");
    render();
    return;
  }

  render();
  finishImportProgress(duplicateCount ? `导入完成，已跳过 ${duplicateCount} 张重复照片` : "导入完成");
  for (const photo of imported) {
    if (hasLocation(photo)) resolvePhotoAddress(photo.id);
  }
  const notices = [];
  if (duplicateCount) notices.push(`${duplicateCount} 张重复照片已跳过`);
  if (skipped) notices.push(`${skipped} 张照片暂时无法识别，已跳过`);
  if (notices.length) {
    window.alert(notices.join("，") + "。");
  }
}

async function processImportFile(item) {
  try {
    const { file, signature } = item;
    const [dataUrl, meta] = await Promise.all([
      imageToAlbumDataUrl(file),
      readImageMeta(file).catch(() => ({})),
    ]);
    const id = crypto.randomUUID();
    return {
      id,
      imageRef: "",
      image: dataUrl,
      fileName: file.name,
      sourceSize: file.size,
      sourceLastModified: file.lastModified,
      sourceSignature: signature,
      placeName: meta.gps ? RESOLVING_PLACE_NAME : "",
      placeRegion: "",
      lat: meta.gps?.lat ?? "",
      lng: meta.gps?.lng ?? "",
      takenAt: meta.date ?? new Date().toISOString().slice(0, 10),
      memory: "",
      addressStatus: meta.gps ? "resolving" : "needs-manual",
      createdAt: Date.now(),
    };
  } catch {
    return null;
  }
}

async function mapWithConcurrency(items, limit, mapper, onProgress) {
  const results = new Array(items.length);
  let nextIndex = 0;
  let doneCount = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
      doneCount += 1;
      onProgress?.(doneCount, items.length);
    }
  });
  await Promise.all(workers);
  return results;
}

function setImportBusy(isBusy) {
  els.input.disabled = isBusy;
  els.dropZone?.classList.toggle("is-busy", isBusy);
  if (els.detailTitle) {
    els.detailTitle.textContent = isBusy ? "正在导入照片" : state.detailMode === "city" ? "城市相册" : "照片信息";
  }
}

function initImportProgress(total) {
  window.clearTimeout(importProgressHideTimer);
  els.importProgress.hidden = false;
  updateImportProgress(0, total, "准备导入");
}

function updateImportProgress(done, total, label) {
  const safeTotal = Math.max(1, total);
  const percent = Math.min(100, Math.round((done / safeTotal) * 100));
  els.importProgressText.textContent = label;
  els.importProgressCount.textContent = `${Math.min(done, total)}/${total}`;
  els.importProgressBar.style.width = `${percent}%`;
}

function finishImportProgress(label) {
  els.importProgressText.textContent = label;
  els.importProgressBar.style.width = "100%";
  importProgressHideTimer = window.setTimeout(() => {
    els.importProgress.hidden = true;
  }, 1400);
}

function photoFileSignature(file) {
  if (!file?.name) return "";
  return [file.name, file.size, file.lastModified].join("::");
}

function nextPaint() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
  });
}

async function saveSelectedPhoto(event) {
  event.preventDefault();
  const photo = selectedPhoto();
  if (!photo) return;
  const pickerPlace = selectedPickerPlace();
  photo.placeName = els.fields.placeName.value.trim();
  photo.lat = cleanCoord(els.fields.latitude.value);
  photo.lng = cleanCoord(els.fields.longitude.value);
  photo.takenAt = els.fields.takenAt.value;
  photo.memory = els.fields.memory.value.trim();
  if (pickerPlace) {
    assignPhotoLocationFromPicker(photo, pickerPlace);
  } else {
    photo.placeRegion = els.fields.placeRegion.value.trim();
    photo.locationPlaceCode = "";
    photo.locationCityCode = els.locationPicker.city.value || "";
    photo.locationProvinceCode = els.locationPicker.province.value || "";
    photo.addressStatus = photo.placeRegion ? "manual" : hasLocation(photo) ? "resolving" : "needs-manual";
  }
  persist();
  render();

  if (hasLocation(photo) && !photo.placeRegion) {
    resolvePhotoAddress(photo.id);
  }

  locateSelected();
}

function deleteSelectedPhoto() {
  if (!state.selectedId) return;
  deletePhotoById(state.selectedId);
}

function deletePhotoById(photoId) {
  const photo = state.photos.find((item) => item.id === photoId);
  if (!photo) return;
  const confirmed = window.confirm("删除这张照片吗？");
  if (!confirmed) return;

  const activeKey = state.activePlaceKey;
  const deletedWasSelected = state.selectedId === photoId;
  state.photos = state.photos.filter((item) => item.id !== photoId);
  if (deletedWasSelected) {
    state.selectedId = state.photos[0]?.id ?? null;
  }

  const activeGroupStillExists = activeKey
    ? state.photos.some((item) => placeKey(item) === activeKey)
    : true;
  if (deletedWasSelected) {
    state.batchMode = false;
    state.batchSelected.clear();
    if (activeKey && activeGroupStillExists) {
      const nextAlbumPhoto = sortPhotosAscending(state.photos.filter((item) => placeKey(item) === activeKey))[0];
      state.activePlaceKey = activeKey;
      state.selectedId = nextAlbumPhoto?.id ?? state.photos[0]?.id ?? null;
      state.photoReturnPlaceKey = null;
      showCityAlbum();
    } else {
      state.activePlaceKey = null;
      state.photoReturnPlaceKey = null;
      state.detailMode = "photo";
      els.detailPanel.hidden = true;
      fitChinaView();
    }
  } else if (!activeGroupStillExists) {
    state.activePlaceKey = null;
    state.photoReturnPlaceKey = null;
    if (state.detailMode === "city") {
      els.detailPanel.hidden = true;
    }
  }

  persist();
  deletePhotoImages([photoId]);
  render();
}

function clearAll() {
  const ids = [...state.currentImportIds].filter((id) => state.photos.some((photo) => photo.id === id));
  if (!ids.length) {
    window.alert("暂无本次导入的照片可清空。");
    return;
  }
  const confirmed = window.confirm(`清空本次导入的 ${ids.length} 张照片吗？`);
  if (!confirmed) return;

  const idSet = new Set(ids);
  state.photos = state.photos.filter((photo) => !idSet.has(photo.id));
  if (idSet.has(state.selectedId)) {
    state.selectedId = state.photos[0]?.id ?? null;
  }
  state.currentImportIds.clear();
  if (state.activePlaceKey && !state.photos.some((photo) => placeKey(photo) === state.activePlaceKey)) {
    state.activePlaceKey = null;
  }
  persist();
  deletePhotoImages(ids);
  render();
}

function seedDemoPhotos() {
  const samples = [
    {
      placeName: "清迈古城",
      placeRegion: "泰国 清迈",
      lat: 18.7883,
      lng: 98.9853,
      takenAt: "2026-02-14",
      memory: "傍晚沿着护城河散步，买了两杯冰咖啡，决定以后每年都留一张同角度合照。",
      image:
        "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=80",
    },
    {
      placeName: "镰仓高校前",
      placeRegion: "日本 神奈川",
      lat: 35.3067,
      lng: 139.5006,
      takenAt: "2025-10-03",
      memory: "海风很大，电车经过的时候我们刚好拍到一张很笨但很开心的自拍。",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",
    },
    {
      placeName: "洱海边",
      placeRegion: "中国 大理",
      lat: 25.792,
      lng: 100.187,
      takenAt: "2025-05-21",
      memory: "骑车骑到腿酸，但落日把水面照成金色的时候，觉得一切都很值得。",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const stamped = samples.map((sample) => ({
    id: crypto.randomUUID(),
    fileName: `${sample.placeName}.jpg`,
    createdAt: Date.now(),
    ...sample,
  }));
  state.photos = [...stamped, ...state.photos];
  state.selectedId = stamped[0].id;
  persist();
  render();
}

function setView(view) {
  state.view = view;
  state.activePlaceKey = null;
  els.gridView.classList.toggle("active", view === "grid");
  els.placeView.classList.toggle("active", view === "places");
  render();
}

function render() {
  if (!state.selectedId && state.photos.length) {
    state.selectedId = state.photos[0].id;
  }
  renderStats();
  renderGallery();
  renderMarkers();
  updateFields(selectedPhoto());
  if (!els.detailPanel.hidden && state.detailMode === "city") {
    renderCityAlbum();
  }
}

function renderStats() {
  els.tripCount.textContent = groupByPlace().filter((place) => hasLocation(place.photos[0])).length;
  els.photoCount.textContent = state.photos.length;
  els.memoryCount.textContent = state.photos.filter((photo) => photo.memory).length;
}

function renderGallery() {
  els.empty.hidden = state.photos.length > 0;
  els.gallery.innerHTML = "";
  if (!state.photos.length) return;

  if (state.view === "places") {
    renderPlaceCards();
    return;
  }

  renderCityCoverCards();
}

function renderCityCoverCards() {
  for (const city of groupByPlace()) {
    const cover = city.coverPhoto;
    const card = document.createElement("button");
    card.type = "button";
    card.className = `city-cover-card ${city.key === state.activePlaceKey ? "active" : ""}`;
    card.addEventListener("click", () => openCityAlbum(city.key));
    card.innerHTML = `
      <img src="${escapeAttr(cover.image)}" alt="${escapeAttr(city.name)}" />
      <span class="photo-card-body">
        <h3>${escapeHtml(city.name)}</h3>
        <small>${escapeHtml(city.region)} · ${city.photos.length} 张照片 · ${escapeHtml(cityTimeRange(city.photos))}</small>
      </span>
    `;
    els.gallery.appendChild(card);
  }
}

function renderCityAlbum() {
  els.cityAlbumGallery.innerHTML = "";
  const group = groupByPlace().find((place) => place.key === state.activePlaceKey);
  if (!group) {
    els.cityAlbumTitle.textContent = "城市相册";
    els.cityAlbumMeta.textContent = "";
    updateBatchToolbar([]);
    return;
  }

  const photos = sortPhotosAscending(group.photos);
  els.cityAlbumTitle.textContent = group.name;
  els.cityAlbumMeta.innerHTML = `${escapeHtml(group.region)} · ${photos.length} 张照片<span>${escapeHtml(cityTimeRange(photos))}</span>`;
  updateBatchToolbar(photos);

  for (const photo of photos) {
    const card = document.createElement("div");
    const selectedClass = state.batchSelected.has(photo.id) ? " selected" : "";
    const activeClass = !state.batchMode && photo.id === state.selectedId ? " active" : "";
    const coverClass = photo.id === group.coverPhoto.id ? " cover" : "";
    card.className = `photo-card city-photo-card${activeClass}${selectedClass}${coverClass}`;
    card.innerHTML = `
      <button class="city-photo-open" type="button">
        ${state.batchMode ? `<span class="batch-check" aria-hidden="true"></span>` : ""}
        ${photo.id === group.coverPhoto.id ? `<span class="cover-badge">当前封面</span>` : ""}
        <img src="${escapeAttr(photo.image)}" alt="${escapeAttr(photo.placeName || photo.fileName)}" />
        <span class="photo-card-body">
          <h3>${escapeHtml(photo.placeName || "未命名地点")}</h3>
          <small>${escapeHtml(albumMeta(photo))}</small>
          ${photo.memory ? `<p>${escapeHtml(photo.memory)}</p>` : ""}
        </span>
      </button>
      ${
        state.batchMode
          ? `<button class="cover-action" type="button" ${photo.id === group.coverPhoto.id ? "disabled" : ""}>${photo.id === group.coverPhoto.id ? "已是封面" : "设为封面"}</button>`
          : ""
      }
    `;
    card.querySelector(".city-photo-open").addEventListener("click", () => {
      if (state.batchMode) {
        toggleBatchPhoto(photo.id);
        return;
      }
      selectPhoto(photo.id);
      showPhotoEditor();
    });
    card.querySelector(".cover-action")?.addEventListener("click", (event) => {
      event.stopPropagation();
      setAlbumCover(photo.id);
    });
    els.cityAlbumGallery.appendChild(card);
  }
}

function setAlbumCover(photoId) {
  const photo = state.photos.find((item) => item.id === photoId);
  if (!photo) return;
  const key = placeKey(photo);
  for (const item of state.photos) {
    if (placeKey(item) === key) {
      item.isAlbumCover = item.id === photoId;
    }
  }
  persist();
  render();
}

function setSelectedPhotoAsCover() {
  const photo = selectedPhoto();
  if (!photo || isAlbumCoverPhoto(photo)) return;
  setAlbumCover(photo.id);
}

function isAlbumCoverPhoto(photo) {
  if (!photo) return false;
  const group = groupByPlace().find((place) => place.key === placeKey(photo));
  return group?.coverPhoto?.id === photo.id;
}

function toggleBatchMode() {
  if (state.detailMode !== "city") return;
  state.batchMode = !state.batchMode;
  state.batchSelected.clear();
  renderCityAlbum();
}

function exitBatchMode() {
  state.batchMode = false;
  state.batchSelected.clear();
  if (els.batchManage) els.batchManage.textContent = "管理";
  if (els.batchToolbar) els.batchToolbar.hidden = true;
}

function toggleBatchPhoto(photoId) {
  if (state.batchSelected.has(photoId)) {
    state.batchSelected.delete(photoId);
  } else {
    state.batchSelected.add(photoId);
  }
  renderCityAlbum();
}

function toggleBatchSelectAll() {
  const group = groupByPlace().find((place) => place.key === state.activePlaceKey);
  if (!group) return;
  const photos = sortPhotosAscending(group.photos);
  const allSelected = photos.length > 0 && photos.every((photo) => state.batchSelected.has(photo.id));
  if (allSelected) {
    for (const photo of photos) {
      state.batchSelected.delete(photo.id);
    }
  } else {
    for (const photo of photos) {
      state.batchSelected.add(photo.id);
    }
  }
  renderCityAlbum();
}

function updateBatchToolbar(photos) {
  const photoIds = new Set(photos.map((photo) => photo.id));
  for (const selectedId of [...state.batchSelected]) {
    if (!photoIds.has(selectedId)) state.batchSelected.delete(selectedId);
  }

  els.batchManage.textContent = state.batchMode ? "完成" : "管理";
  els.batchToolbar.hidden = !state.batchMode;
  if (!state.batchMode) return;

  const selectedCount = state.batchSelected.size;
  const allSelected = photos.length > 0 && photos.every((photo) => state.batchSelected.has(photo.id));
  const targetAlbums = groupByPlace().filter((place) => place.key !== state.activePlaceKey);
  const previousTarget = els.batchMoveTarget.value;
  els.batchSelectedCount.textContent = `已选择 ${selectedCount} 张`;
  els.batchSelectAll.textContent = allSelected ? "取消全选" : "全选";
  els.batchSelectAll.disabled = photos.length === 0;
  els.batchMoveTarget.innerHTML = targetAlbums
    .map((place) => `<option value="${escapeAttr(place.key)}">${escapeHtml(place.name)}</option>`)
    .join("");

  if (targetAlbums.some((place) => place.key === previousTarget)) {
    els.batchMoveTarget.value = previousTarget;
  }

  els.batchDelete.disabled = selectedCount === 0;
  els.batchMove.disabled = selectedCount === 0 || targetAlbums.length === 0;
  els.batchMoveTarget.disabled = targetAlbums.length === 0;
}

function deleteBatchPhotos() {
  const ids = [...state.batchSelected];
  if (!ids.length) return;
  const confirmed = window.confirm(`删除选中的 ${ids.length} 张照片吗？`);
  if (!confirmed) return;

  const idSet = new Set(ids);
  state.photos = state.photos.filter((photo) => !idSet.has(photo.id));
  if (idSet.has(state.selectedId)) {
    state.selectedId = state.photos[0]?.id ?? null;
  }

  state.batchMode = false;
  state.batchSelected.clear();
  repairActiveCityAfterBatch();
  persist();
  deletePhotoImages(ids);
  render();
}

function moveBatchPhotos() {
  const ids = [...state.batchSelected];
  const target = groupByPlace().find((place) => place.key === els.batchMoveTarget.value);
  if (!ids.length || !target) return;

  const idSet = new Set(ids);
  for (const photo of state.photos) {
    if (!idSet.has(photo.id)) continue;
    photo.placeRegion = [target.region, target.name].filter(Boolean).join(" ");
    photo.addressStatus = "manual";
    delete photo.isAlbumCover;
  }

  state.activePlaceKey = target.key;
  state.selectedId = ids[0] ?? state.selectedId;
  state.batchMode = false;
  state.batchSelected.clear();
  persist();
  render();
}

function repairActiveCityAfterBatch() {
  if (!state.activePlaceKey) return;
  const activeGroupStillExists = state.photos.some((photo) => placeKey(photo) === state.activePlaceKey);
  if (!activeGroupStillExists) {
    state.activePlaceKey = null;
    els.detailPanel.hidden = true;
    fitAllMarkers();
  }
}

function renderPlaceCards() {
  const groups = groupByPlace();
  for (const place of groups) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "place-card";
    card.addEventListener("click", () => {
      openPlaceAlbum(place.key);
    });
    card.innerHTML = `
      <h3>${escapeHtml(place.name)}</h3>
      <small>${escapeHtml(place.region)} · ${place.photos.length} 张照片</small>
      <p>${escapeHtml(place.latestMemory || "还没有写故事。")}</p>
    `;
    els.gallery.appendChild(card);
  }
}

function renderMarkers() {
  if (!state.map || !els.mapOverlay) return;
  const places = groupByPlace().filter((place) => hasLocation(place.photos[0]));
  state.markers.clear();
  els.mapOverlay.innerHTML = "";

  for (const place of places) {
    const photo = place.centerPhoto;
    const coverPhoto = markerCoverPhoto(place);
    const element = document.createElement("button");
    const activeClass = place.key === state.activePlaceKey || photo.id === state.selectedId ? " active" : "";
    element.type = "button";
    element.className = `heart-marker${activeClass}`;
    element.title = `${[place.region, place.name].filter(Boolean).join(" ")}，${place.photos.length} 张照片`;
    element.dataset.placeKey = place.key;
    element.setAttribute("aria-label", `打开${place.name}相册，${place.photos.length}张照片`);
    element.innerHTML = `
      <span class="heart-marker-shadow"></span>
      <svg class="heart-marker-icon" viewBox="0 0 64 58" aria-hidden="true">
        <path d="M32 53 C18 41 6 32 6 19 C6 10 12 4 21 4 C26 4 30 7 32 11 C34 7 38 4 43 4 C52 4 58 10 58 19 C58 32 46 41 32 53 Z"></path>
      </svg>
      <span class="heart-marker-count">${place.photos.length}</span>
      <span class="heart-marker-label">${escapeHtml(place.name)}</span>
      <span class="heart-marker-preview" aria-hidden="true">
        <img src="${escapeAttr(coverPhoto.image)}" alt="" />
      </span>
    `;
    element.dataset.lat = String(photo.lat);
    element.dataset.lng = String(photo.lng);
    els.mapOverlay.appendChild(element);
    state.markers.set(place.key, element);
  }
  positionOverlayMarkers();
}

function markerCoverPhoto(place) {
  return place.coverPhoto || place.photos.find((photo) => photo.image) || place.centerPhoto;
}

function positionOverlayMarkers() {
  if (!state.map) return;
  for (const marker of state.markers.values()) {
    const lng = Number(marker.dataset.lng);
    const lat = Number(marker.dataset.lat);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
    const point = state.map.project([lng, lat]);
    marker.style.left = `${point.x}px`;
    marker.style.top = `${point.y}px`;
  }
}

function updateFields(photo) {
  const disabled = !photo;
  els.detailTitle.textContent = photo ? "照片信息" : "添加照片";
  for (const field of Object.values(els.fields)) {
    field.disabled = disabled;
    field.value = "";
  }
  for (const picker of Object.values(els.locationPicker)) {
    picker.disabled = disabled || LOCATION_PICKER_DATA.length === 0;
  }
  els.deletePhoto.disabled = disabled;
  els.savePhoto.disabled = disabled;
  els.setCoverPhoto.disabled = disabled;
  els.setCoverPhoto.textContent = "设为封面";
  els.fields.placeRegion.placeholder = regionPlaceholder(photo);
  if (!photo) {
    syncLocationPickerFromPhoto(null);
    return;
  }
  els.fields.placeName.value = photo.placeName || "";
  els.fields.placeRegion.value = photo.placeRegion || "";
  els.fields.latitude.value = photo.lat ?? "";
  els.fields.longitude.value = photo.lng ?? "";
  els.fields.takenAt.value = photo.takenAt || "";
  els.fields.memory.value = photo.memory || "";
  const isCover = isAlbumCoverPhoto(photo);
  els.setCoverPhoto.disabled = isCover;
  els.setCoverPhoto.textContent = isCover ? "已是封面" : "设为封面";
  syncLocationPickerFromPhoto(photo);
}

function regionPlaceholder(photo) {
  if (!photo) return "";
  if (photo.addressStatus === "resolving") return "正在根据照片 GPS 自动识别...";
  if (!hasLocation(photo)) return "照片没有地址信息，请选择标准位置";
  if (photo.addressStatus === "failed") return "未能自动识别，请选择标准位置";
  return "请选择标准位置";
}

function hydrateMissingAddresses() {
  let changed = false;
  for (const photo of state.photos) {
    if (!hasLocation(photo)) {
      if (!photo.addressStatus) {
        photo.addressStatus = "needs-manual";
        changed = true;
      }
      continue;
    }
    if (photo.placeRegion || photo.addressStatus === "failed") continue;
    photo.addressStatus = "resolving";
    if (!photo.placeName || photo.placeName === DEFAULT_GPS_PLACE_NAME) {
      photo.placeName = RESOLVING_PLACE_NAME;
    }
    changed = true;
    resolvePhotoAddress(photo.id);
  }
  if (changed) {
    persist();
    render();
  }
}

async function resolvePhotoAddress(photoId) {
  const photo = state.photos.find((item) => item.id === photoId);
  if (!photo || !hasLocation(photo)) return;

  const lookupKey = `${photoId}:${roundCoord(photo.lat)},${roundCoord(photo.lng)}`;
  if (pendingAddressLookups.has(lookupKey)) return;

  pendingAddressLookups.add(lookupKey);
  photo.addressStatus = "resolving";
  if (!photo.placeName || photo.placeName === DEFAULT_GPS_PLACE_NAME) {
    photo.placeName = RESOLVING_PLACE_NAME;
  }
  persist();
  render();

  try {
    const address = await reverseGeocode(photo.lat, photo.lng);
    const freshPhoto = state.photos.find((item) => item.id === photoId);
    if (!freshPhoto || !hasLocation(freshPhoto)) return;

    if (!freshPhoto.placeRegion) {
      freshPhoto.placeRegion = address.region || "";
    }
    if (shouldReplaceAutoPlaceName(freshPhoto.placeName)) {
      freshPhoto.placeName = address.placeName || DEFAULT_GPS_PLACE_NAME;
    }
    freshPhoto.addressStatus = freshPhoto.placeRegion ? "resolved" : "failed";
    freshPhoto.addressLookupKey = lookupKey;
  } catch {
    const freshPhoto = state.photos.find((item) => item.id === photoId);
    if (freshPhoto) {
      freshPhoto.addressStatus = "failed";
      if (freshPhoto.placeName === RESOLVING_PLACE_NAME) {
        freshPhoto.placeName = DEFAULT_GPS_PLACE_NAME;
      }
    }
  } finally {
    pendingAddressLookups.delete(lookupKey);
    persist();
    render();
  }
}

async function resolveManualPhotoLocation(photoId) {
  const photo = state.photos.find((item) => item.id === photoId);
  if (!photo || hasLocation(photo)) return;
  const query = addressSearchText(photo);
  if (!query) return;

  const lookupKey = `manual:${query}`;
  if (pendingAddressLookups.has(lookupKey)) return;

  pendingAddressLookups.add(lookupKey);
  const previousButtonText = els.savePhoto.textContent;
  photo.addressStatus = "resolving";
  els.savePhoto.disabled = true;
  els.savePhoto.textContent = "定位中";
  persist();
  render();

  try {
    const result = await geocodeAddress(query);
    const freshPhoto = state.photos.find((item) => item.id === photoId);
    if (!freshPhoto || hasLocation(freshPhoto)) return;

    freshPhoto.lat = result.lat;
    freshPhoto.lng = result.lng;
    freshPhoto.addressStatus = "manual";
    freshPhoto.addressLookupKey = lookupKey;
    persist();
    render();
  } catch {
    const freshPhoto = state.photos.find((item) => item.id === photoId);
    if (freshPhoto && !hasLocation(freshPhoto)) {
      freshPhoto.addressStatus = "failed";
      persist();
      els.detailPanel.hidden = true;
      render();
      fitChinaView();
      window.alert("没有自动定位到这个地址。已回到地图，请直接在地图上点一下照片位置。");
    }
  } finally {
    pendingAddressLookups.delete(lookupKey);
    els.savePhoto.disabled = false;
    els.savePhoto.textContent = previousButtonText;
  }
}

async function reverseGeocode(lat, lng) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 9000);
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("zoom", "16");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("accept-language", "zh-CN");

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Reverse geocoding failed");
    return normalizeAddress(await response.json());
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function geocodeAddress(query) {
  const localMatch = knownPlaceFromQuery(query);
  if (localMatch) return localMatch;

  const queries = uniqueParts([
    query,
    query.includes("中国") ? "" : `中国 ${query}`,
  ]);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 9000);
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "zh-CN");

  try {
    for (const searchText of queries) {
      url.searchParams.set("q", searchText);
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) continue;
      const results = await response.json();
      const first = Array.isArray(results) ? results[0] : null;
      if (!first) continue;
      const lat = cleanCoord(first.lat);
      const lng = cleanCoord(first.lon);
      if (lat === "" || lng === "") continue;
      return { lat, lng };
    }
    throw new Error("No location found");
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function knownPlaceFromQuery(query) {
  const normalized = String(query).replace(/\s+/g, "");
  const match = CITY_FALLBACKS.find((city) => {
    const cityName = city.name;
    const shortName = cityName.replace(/市$/, "");
    return normalized.includes(cityName) || normalized.includes(shortName);
  });
  return match ? { lat: match.lat, lng: match.lng } : null;
}

function normalizeAddress(data) {
  const address = data.address || {};
  const city =
    address.city ||
    address.town ||
    address.prefecture ||
    address.city_district ||
    address.municipality ||
    address.county ||
    address.village;
  const region = uniqueParts([
    address.country,
    address.state || address.province || address.region,
    city,
  ]).join(" ");
  const placeName =
    data.name ||
    address.tourism ||
    address.attraction ||
    address.amenity ||
    address.neighbourhood ||
    address.suburb ||
    address.road ||
    address.city ||
    address.town ||
    address.village ||
    address.county ||
    "";
  return { region, placeName };
}

function uniqueParts(parts) {
  const seen = new Set();
  return parts
    .filter(Boolean)
    .map((part) => String(part).trim())
    .filter((part) => {
      if (!part || seen.has(part)) return false;
      seen.add(part);
      return true;
    });
}

function shouldReplaceAutoPlaceName(value) {
  return !value || [DEFAULT_GPS_PLACE_NAME, RESOLVING_PLACE_NAME, "手动标记地点"].includes(value);
}

function addressSearchText(photo) {
  return uniqueParts([photo.placeRegion, photo.placeName]).join(" ");
}

function handleHeartMarkerIntent(event) {
  const markerEl = event.target.closest?.(".heart-marker");
  if (!markerEl) return;
  if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  event.stopPropagation();
  const key = markerEl.dataset.placeKey;
  if (!key) return;
  if (event.type === "click" && markerIntentPointerKey === key) {
    markerIntentPointerKey = null;
    return;
  }
  if (event.type === "pointerdown") {
    markerIntentPointerKey = key;
  }
  openPlaceAlbum(key);
}

function nearestPlaceFromMapPoint(point) {
  if (!state.map || !point) return null;
  let nearest = null;
  let nearestDistance = Infinity;

  for (const place of groupByPlace().filter((item) => hasLocation(item.photos[0]))) {
    const photo = place.centerPhoto;
    const projected = state.map.project([Number(photo.lng), Number(photo.lat)]);
    const distance = Math.hypot(projected.x - point.x, projected.y - point.y);
    if (distance < nearestDistance) {
      nearest = place;
      nearestDistance = distance;
    }
  }

  return nearestDistance <= 42 ? nearest : null;
}

function openPlaceAlbum(key) {
  openCityAlbum(key);
}

function openCityAlbum(key) {
  const group = groupByPlace().find((place) => place.key === key);
  if (!group) return;
  state.activePlaceKey = key;
  state.view = "grid";
  state.selectedId = group.photos[0].id;
  els.gridView.classList.add("active");
  els.placeView.classList.remove("active");
  render();
  els.detailPanel.hidden = false;
  showCityAlbum();
}

function selectPhoto(id) {
  state.selectedId = id;
  render();
}

function locateSelected() {
  const photo = selectedPhoto();
  if (!photo || !hasLocation(photo) || !state.map) return;
  document.querySelector("#map")?.scrollIntoView({ behavior: "smooth", block: "center" });
  state.map.flyTo({
    center: [Number(photo.lng), Number(photo.lat)],
    zoom: 9,
    speed: 0.8,
  });
  const marker = state.markers.get(placeKey(photo));
  marker?.classList.add("pulse-once");
  window.setTimeout(() => marker?.classList.remove("pulse-once"), 900);
}

function fitAllMarkers() {
  if (!state.map) return;
  const locations = state.photos.filter(hasLocation);
  if (!locations.length) {
    fitChinaView();
    return;
  }
  const bounds = new maplibregl.LngLatBounds();
  for (const photo of locations) {
    bounds.extend([Number(photo.lng), Number(photo.lat)]);
  }
  state.map.fitBounds(bounds, { padding: 80, maxZoom: 8.5, duration: 800 });
}

function fitChinaView(duration = 800) {
  if (!state.map) return;
  state.map.easeTo({
    center: CHINA_VIEW.center,
    zoom: CHINA_VIEW.zoom,
    duration,
  });
}

function selectedPhoto() {
  return state.photos.find((photo) => photo.id === state.selectedId) || null;
}

function sortedPhotos() {
  return [...state.photos].sort((a, b) => {
    const dateA = a.takenAt || "";
    const dateB = b.takenAt || "";
    return dateB.localeCompare(dateA) || b.createdAt - a.createdAt;
  });
}

function sortPhotosAscending(photos) {
  return [...photos].sort((a, b) => {
    const dateA = a.takenAt || "";
    const dateB = b.takenAt || "";
    return dateA.localeCompare(dateB) || a.createdAt - b.createdAt;
  });
}

function cityTimeRange(photos) {
  const dates = photos.map((photo) => photo.takenAt).filter(Boolean).sort();
  if (!dates.length) return "未填写时间";
  if (dates[0] === dates[dates.length - 1]) return dates[0];
  return `${dates[0]} - ${dates[dates.length - 1]}`;
}

function groupByPlace() {
  const map = new Map();
  for (const photo of sortedPhotos()) {
    const key = placeKey(photo);
    const city = cityInfo(photo);
    if (!map.has(key)) {
      map.set(key, {
        key,
        name: city.name,
        region: city.region,
        latestMemory: "",
        photos: [],
      });
    }
    const group = map.get(key);
    group.photos.push(photo);
    if (!group.latestMemory && photo.memory) group.latestMemory = photo.memory;
  }
  return Array.from(map.values()).map((group) => ({
    ...group,
    coverPhoto: groupCoverPhoto(group),
    centerPhoto: groupCenterPhoto(group),
  }));
}

function groupCoverPhoto(group) {
  return group.photos.find((photo) => photo.isAlbumCover && photo.image) || group.photos.find((photo) => photo.image) || group.photos[0];
}

function placeKey(photo) {
  const city = cityInfo(photo);
  return `city:${city.region}|${city.name}`;
}

function cityInfo(photo) {
  const region = normalizeRegionParts(photo.placeRegion || "");
  const city = pickCityName(region, photo.placeName || "", photo);
  const country = region[0] || "";
  const province = country === "中国" ? region[1] || "" : region.length > 1 ? region[region.length - 2] : "";
  return {
    name: city || photo.placeName || "未标记城市",
    region: uniqueParts([country, province]).join(" ") || photo.placeRegion || "未填写地区",
  };
}

function normalizeRegionParts(value) {
  return String(value)
    .replace(/[，,、/]+/g, " ")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function pickCityName(parts, fallback, photo) {
  if (!parts.length) return fallback;
  const cityLike = [...parts].reverse().find((part) => /市$|自治州$|地区$|盟$/.test(part));
  if (cityLike) return cityLike;
  const nearby = nearbyKnownCity(photo);
  if (nearby) return nearby;
  return parts[parts.length - 1] || fallback;
}

function nearbyKnownCity(photo) {
  if (!hasLocation(photo)) return "";
  const lat = Number(photo.lat);
  const lng = Number(photo.lng);
  const match = CITY_FALLBACKS.find((city) => {
    const distance = Math.hypot(lat - city.lat, lng - city.lng);
    return distance <= city.radius;
  });
  return match?.name || "";
}

function groupCenterPhoto(group) {
  const located = group.photos.filter(hasLocation);
  if (!located.length) return group.photos[0];
  const lat = located.reduce((sum, photo) => sum + Number(photo.lat), 0) / located.length;
  const lng = located.reduce((sum, photo) => sum + Number(photo.lng), 0) / located.length;
  return { ...located[0], lat: roundCoord(lat), lng: roundCoord(lng) };
}

function compactMeta(photo) {
  const parts = [];
  if (photo.placeRegion) parts.push(photo.placeRegion);
  if (photo.takenAt) parts.push(photo.takenAt);
  if (hasLocation(photo)) parts.push(`${Number(photo.lat).toFixed(3)}, ${Number(photo.lng).toFixed(3)}`);
  return parts.join(" · ") || "待补充地点";
}

function albumMeta(photo) {
  const parts = [];
  if (photo.placeRegion) parts.push(photo.placeRegion);
  if (photo.takenAt) parts.push(photo.takenAt);
  return parts.join(" · ") || "待补充地点";
}

function hasLocation(photo) {
  return Number.isFinite(Number(photo.lat)) && Number.isFinite(Number(photo.lng));
}

function cleanCoord(value) {
  if (value === "") return "";
  const number = Number(value);
  return Number.isFinite(number) ? roundCoord(number) : "";
}

function roundCoord(value) {
  return Math.round(Number(value) * 1_000_000) / 1_000_000;
}

async function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const savedPhotos = raw ? JSON.parse(raw) : [];
    state.photos = [];
    for (const photo of savedPhotos) {
      const hydrated = { ...photo };
      const imageKey = hydrated.imageRef;
      const storedImage = imageKey ? await loadPhotoImage(imageKey) : "";
      if (storedImage) {
        hydrated.image = storedImage;
        hydrated.imageRef = imageKey;
      } else if (hydrated.image?.startsWith?.("data:")) {
        try {
          await savePhotoImage(hydrated.id, hydrated.image);
          hydrated.imageRef = hydrated.id;
        } catch {
          hydrated.imageRef = "";
        }
      }
      state.photos.push(hydrated);
    }
    state.selectedId = state.photos[0]?.id ?? null;
    persist();
  } catch {
    state.photos = [];
  }
}

function persist() {
  const metadata = state.photos.map(({ image, ...photo }) => {
    if (typeof image === "string" && !image.startsWith("data:")) {
      return { ...photo, image };
    }
    if (photo.imageRef) {
      return { ...photo, imageRef: photo.imageRef };
    }
    return { ...photo, image };
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
}

function openImageDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const request = indexedDB.open(IMAGE_DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(IMAGE_STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePhotoImage(id, dataUrl) {
  return savePhotoImages([[id, dataUrl]]);
}

async function savePhotoImages(records) {
  if (!records.length) return;
  const db = await openImageDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(IMAGE_STORE_NAME, "readwrite");
    const store = transaction.objectStore(IMAGE_STORE_NAME);
    for (const [id, dataUrl] of records) {
      store.put(dataUrl, id);
    }
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

async function loadPhotoImage(id) {
  const db = await openImageDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IMAGE_STORE_NAME, "readonly");
    const request = transaction.objectStore(IMAGE_STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result || "");
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

async function deletePhotoImages(ids) {
  if (!ids.length) return;
  const db = await openImageDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(IMAGE_STORE_NAME, "readwrite");
    const store = transaction.objectStore(IMAGE_STORE_NAME);
    for (const id of ids) {
      store.delete(id);
    }
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function imageToAlbumDataUrl(file) {
  try {
    return await resizeImageFile(file);
  } catch {
    return fileToDataUrl(file);
  }
}

function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, IMPORT_IMAGE_MAX_SIZE / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas unavailable"));
        return;
      }
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", IMPORT_IMAGE_QUALITY));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image decode failed"));
    };
    image.src = url;
  });
}

async function readImageMeta(file) {
  if (!/jpe?g$/i.test(file.name) && !["image/jpeg", "image/jpg"].includes(file.type)) {
    return {};
  }
  const buffer = await file.slice(0, EXIF_SCAN_BYTES).arrayBuffer();
  return parseExif(buffer);
}

function parseExif(buffer) {
  const view = new DataView(buffer);
  if (!hasBytes(view, 0, 2)) return {};
  if (view.getUint16(0) !== 0xffd8) return {};

  let offset = 2;
  while (hasBytes(view, offset, 4)) {
    const marker = view.getUint16(offset);
    offset += 2;
    if (!hasBytes(view, offset, 2)) return {};
    const length = view.getUint16(offset);
    if (marker === 0xffe1) {
      const exifOffset = offset + 2;
      if (!hasBytes(view, exifOffset, Math.min(length - 2, 6))) return {};
      const header = readAscii(view, exifOffset, 6);
      if (header !== "Exif\0\0") return {};
      return readTiff(view, exifOffset + 6);
    }
    offset += length;
  }
  return {};
}

function hasBytes(view, offset, length) {
  return offset >= 0 && length >= 0 && offset + length <= view.byteLength;
}

function readTiff(view, tiffStart) {
  const littleEndian = readAscii(view, tiffStart, 2) === "II";
  const firstIfd = get32(view, tiffStart + 4, littleEndian);
  const ifd0 = readIfd(view, tiffStart + firstIfd, tiffStart, littleEndian);
  const gpsOffset = ifd0[0x8825];
  const dateRaw = ifd0[0x0132] ? readExifString(view, ifd0[0x0132], tiffStart) : "";
  const result = {};
  if (dateRaw) result.date = formatExifDate(dateRaw);
  if (gpsOffset) {
    const gps = readIfd(view, tiffStart + gpsOffset, tiffStart, littleEndian);
    const lat = readGpsCoord(view, gps[2], gps[1], tiffStart, littleEndian);
    const lng = readGpsCoord(view, gps[4], gps[3], tiffStart, littleEndian);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      result.gps = { lat: roundCoord(lat), lng: roundCoord(lng) };
    }
  }
  return result;
}

function readIfd(view, offset, tiffStart, littleEndian) {
  const entries = get16(view, offset, littleEndian);
  const tags = {};
  for (let index = 0; index < entries; index += 1) {
    const entry = offset + 2 + index * 12;
    const tag = get16(view, entry, littleEndian);
    const type = get16(view, entry + 2, littleEndian);
    const count = get32(view, entry + 4, littleEndian);
    const valueOffset = entry + 8;
    const size = typeSize(type) * count;
    const value = size <= 4 ? valueOffset : tiffStart + get32(view, valueOffset, littleEndian);
    tags[tag] = type === 2 ? { value, count } : get32(view, valueOffset, littleEndian);
  }
  return tags;
}

function readGpsCoord(view, coordOffset, refTag, tiffStart, littleEndian) {
  if (!coordOffset || !refTag) return NaN;
  const offset = tiffStart + coordOffset;
  const degrees = readRational(view, offset, littleEndian);
  const minutes = readRational(view, offset + 8, littleEndian);
  const seconds = readRational(view, offset + 16, littleEndian);
  const ref = typeof refTag === "object" ? readAscii(view, refTag.value, 1) : "";
  const sign = ref === "S" || ref === "W" ? -1 : 1;
  return sign * (degrees + minutes / 60 + seconds / 3600);
}

function readRational(view, offset, littleEndian) {
  const numerator = get32(view, offset, littleEndian);
  const denominator = get32(view, offset + 4, littleEndian);
  return denominator ? numerator / denominator : 0;
}

function readExifString(view, tag, tiffStart) {
  if (!tag || typeof tag !== "object") return "";
  return readAscii(view, tag.value, tag.count).replace(/\0/g, "");
}

function formatExifDate(value) {
  const match = value.match(/^(\d{4}):(\d{2}):(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : "";
}

function get16(view, offset, littleEndian) {
  return view.getUint16(offset, littleEndian);
}

function get32(view, offset, littleEndian) {
  return view.getUint32(offset, littleEndian);
}

function typeSize(type) {
  return { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 }[type] || 0;
}

function readAscii(view, offset, length) {
  let output = "";
  for (let index = 0; index < length; index += 1) {
    output += String.fromCharCode(view.getUint8(offset + index));
  }
  return output;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
