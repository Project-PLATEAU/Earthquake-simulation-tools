<template>
  <div class="m-10 regist-view regist-name">
    <div class="text-xl font-bold">CityGML（3D都市モデル）の追加・編集</div>
    <div class="text-center">
      <div class="mt-10">
        <label class="inline-block text-left text-base font-bold w-24">地域名</label>
        <input
          type="text"
          maxlength="255"
          class="inline-block text-left w-[600px] h-10 rounded-md border border-solid border-blue-500"
          v-model="formData.name"
        />
      </div>
      <div class="mt-6">
        <button class="bg-transparent text-blue-500 rounded-md border border-solid border-blue-500 align-top text-xs py-[14px] px-[28px]" @click="clickMap">
          地図からモデルを追加
        </button>
        <div
          class="inline-block p-5 w-96 h-60 bg-slate-200 ml-14 break-words text-left overflow-auto"
        >
          {{ formData.mesh_codes }}
        </div>
      </div>
      <div class="mt-6 text-center flex justify-center space-x-6">
        <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md px-4" @click="clickReturn">
          戻る
        </button>
        <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md px-4" @click="clickCreateAndEditPreset">
          地域(3D都市モデル)の追加・編集
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { RegionPresetApi } from "../apis/http/RegionPresets";
import {
  RegionPresetPathParam,
  RegionPresetPostRequestBody,
  RegionPresetPutRequestBody,
} from "../models/RegionPresets";
import { useMeshCodeStore } from "../store/meshCode";

const router = useRouter();
const props = defineProps<{
  id: string;
}>();
const apiClient = new RegionPresetApi();
const formData = ref<RegionPresetPostRequestBody>({
  name: "",
  gmlfile_path: "",
  mesh_codes: "",
  additional_info: "",
});
const meshCodeStore = useMeshCodeStore();

const getRegionPresetDetail = async () => {
  const params: RegionPresetPathParam = {
    id: props.id,
  };
  const res = await apiClient.get(params);
  formData.value = <RegionPresetPostRequestBody>{ ...res };

  if (meshCodeStore.changeFlag == false) {
    if (res.mesh_codes != "") {
      // メッシュコードをストアにセット
      const meshCodeList: string[] = res.mesh_codes.split(",");
      meshCodeStore.meshCodes = meshCodeList;
    }
  } else {
    // メッシュコードをフォームにセット
    formData.value.mesh_codes = meshCodeStore.meshCodeList.join(",");
  }
};

const clickCreateAndEditPreset = async () => {
  // 必須チェック
  if (formData.value.name == "") {
    alert("地域名は必須入力です。");
    return false;
  }
  try {
    // id の有無で登録か更新か判断する
    if (!props.id) {
      // 登録
      const registData: RegionPresetPostRequestBody = { ...formData.value };
      const res = await apiClient.create(registData);
      if (!res.id) {
        alert(
          "地域（CityGML）の追加に失敗しました。システム管理者にお問い合わせください。"
        );
        return false;
      }
    } else {
      // 更新
      const params: RegionPresetPathParam = {
        id: props.id,
      };
      const updatedata: RegionPresetPutRequestBody = {
        id: Number(props.id),
        ...formData.value,
      };
      const res = await apiClient.update(params, updatedata);
      if (!res.id) {
        alert(
          "地域（CityGML）の編集に失敗しました。システム管理者にお問い合わせください。"
        );
        return false;
      }
    }
    meshCodeStore.initMeshCode();
    // 地域プリセット一覧に戻る
    router.push({ name: "RegionPresetList" });
  } catch (e) {}
};

const clickReturn = () => {
  // 地域プリセット一覧に戻る
  meshCodeStore.initMeshCode();
  router.push({ name: "RegionPresetList" });
};

const clickMap = () => {
  meshCodeStore.tempPresetName = formData.value.name;
  router.push({ name: "RegionPresetMap" });
};

onMounted(() => {
  // idが指定された場合は更新モード
  if (props.id != undefined || props.id != "") {
    getRegionPresetDetail();
  }

  // メッシュコードの取得
  const meshCodeList: string[] = meshCodeStore.meshCodeList;
  formData.value.mesh_codes = meshCodeList.join(",");

  if (meshCodeStore.tempPresetName != "") {
    formData.value.name = meshCodeStore.tempPresetName;
  }

});
</script>
