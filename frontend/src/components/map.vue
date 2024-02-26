<script setup lang="ts">
import { onMounted, shallowRef, watch } from "vue";
import {
  GeoJSONSource,
  LngLat,
  Map,
  NavigationControl,
  type MapGeoJSONFeature,
} from "maplibre-gl";
import { type Raw, toRaw } from "vue";
import { RegisteredCitygmlsApi } from "../apis/http/RegisteredCitygmls";
import { useMeshCodeStore } from "../store/meshCode";
import { useRouter } from "vue-router";

const meshCodeStore = useMeshCodeStore();
const router = useRouter();

const apiClient = new RegisteredCitygmlsApi();
const mapContainer = shallowRef<string | HTMLElement>("");
const map = shallowRef<Raw<Map> | null>(null);

const clickedFeatures = [] as MapGeoJSONFeature[];

let mapInstance: Map | null = null;

const props = defineProps<{
  lat: number;
  lon: number;
}>();

const emit = defineEmits<{
  (event: "select-tile", data: any): void;
}>();

const getRegisteredCitygmls = (params: {
  upper_lon: number | undefined;
  upper_lat: number | undefined;
  lower_lon: number | undefined;
  lower_lat: number | undefined;
}) => {
  const res = apiClient.get(params);
  return res;
};

const getRegisteredCitygmlsFromMeshData = (params: {
  mashcode_list: Array<string> | undefined;
}) => {
  const paramArray: string[] | undefined = toRaw(params.mashcode_list) ?? [];
  const res = apiClient.getFromMeshCode({ meshcode_list: paramArray });
  return res;
};

onMounted(async () => {
  const initialState = { lng: 138.397714, lat: 35.035368, zoom: 10 };

  mapInstance = new Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        "base-tile": {
          type: "raster",
          tiles: ["https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: "base-tile",
          type: "raster",
          source: "base-tile",
        },
      ],
    },
    center: [initialState.lng, initialState.lat],
    zoom: initialState.zoom,
  });

  mapInstance.on("load", async () => {
    if (!mapInstance) return;
    const bounds = mapInstance.getBounds();
    const topRight: LngLat = bounds.getNorthEast();
    const bottomLeft: LngLat = bounds.getSouthWest();
    // メッシュデータの取得
    const meshData = await getRegisteredCitygmls({
      upper_lon: topRight.lng,
      upper_lat: topRight.lat,
      lower_lon: bottomLeft.lng,
      lower_lat: bottomLeft.lat,
    });

    mapInstance.addSource("mesh", {
      type: "geojson",
      data: meshData,
    });

    mapInstance.addLayer({
      id: "mesh",
      type: "fill",
      source: "mesh",
      paint: {
        "fill-color": "#0000ff",
        "fill-opacity": 0.5,
      },
    });

    // 地図クリック
    mapInstance.on("click", "mesh", (e) => {
      if (!e.features) return;
      if (!mapInstance) return;

      // featureをハイライトする
      const features = mapInstance.queryRenderedFeatures(e.point, {
        layers: ["mesh"],
      });
      if (!features) return;

      // もし、すでに同じfeatureがclickedFeaturesに入っていたら、色を戻して削除する
      if (
        clickedFeatures.some(
          (f) => f.properties.id == features[0].properties.id
        )
      ) {
        clickedFeatures.forEach((f) => {
          if (f.properties.id == features[0].properties.id) {
            const index = clickedFeatures.indexOf(f);
            clickedFeatures.splice(index, 1);
          }
        });

        console.log(features[0].properties.mesh_code);
        meshCodeStore.removeMeshCode(features[0].properties.mesh_code);
        console.log(meshCodeStore.meshCodeList);
      } else {
        clickedFeatures.push(features[0]);
        meshCodeStore.setMeshCode(features[0].properties.mesh_code);
      }

      featureHighlight(clickedFeatures);

      // メッシュが更新されたフラグをたてる
      meshCodeStore.changeFlag = true;
    });

    // 既に選択されているメッシュコードがあれば、ハイライトする
    const meshCodes = meshCodeStore.meshCodeList;
    if (meshCodes.length > 0) {
      const meshData = await getRegisteredCitygmlsFromMeshData({
        mashcode_list: meshCodes,
      });
      if (meshData.features) {
        clickedFeatures.push(...meshData.features);
      }
      if (meshData && meshData.features) {
        featureHighlight(meshData.features);
      }
    }
  });

  mapInstance.addControl(new NavigationControl());
});

watch(
  () => props,
  (val) => {
    if (map.value) {
      map.value.setCenter([val.lon, val.lat]);
    }
  },
  { deep: true }
);

const onClickSubmit = () => {
  router.go(-1);
};

const featureHighlight = (features: MapGeoJSONFeature[]) => {
  if (!mapInstance) return;

  const selectedFeatureSource: GeoJSONSource = mapInstance.getSource(
    "selectedFeature"
  ) as GeoJSONSource;

  if (typeof selectedFeatureSource !== "undefined") {
    selectedFeatureSource.setData({
      type: "FeatureCollection",
      features: features,
    });
  } else {
    mapInstance.addSource("selectedFeature", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: features,
      },
    });
    mapInstance.addLayer({
      id: "selectedFeature",
      type: "fill",
      source: "selectedFeature",
      paint: {
        "fill-color": "#4caf50",
        "fill-opacity": 0.5,
      },
    });
  }
};
</script>

<template>
  <div class="map-wrap">
    <div ref="mapContainer" class="map"></div>
  </div>
  <div>
    <button class="border bg-slate-200 p-1" @click="onClickSubmit">決定</button>
  </div>
</template>

<style scoped>
.map-wrap {
  position: relative;
  width: 100vw;
  height: 78vh;
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
