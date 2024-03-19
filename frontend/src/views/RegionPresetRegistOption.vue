<template>
    <div class="m-10 regist-view regist-additional-info">
        <div class="text-xl font-bold">地域（3D都市モデル）の付帯情報登録（編集）</div>
        <div class="text-center">
          <div class="mt-10">
            <label class="inline-block text-left text-base font-bold w-48">モデル識別名（都市名）</label>
            <label class="inline-block text-left w-[600px]">{{formData.name}}</label>
          </div>
          <div class="mt-10">
            <label class="inline-block text-left text-base font-bold w-48">モデルに関する付帯情報</label>
            <textarea class="align-top inline-block text-left w-[600px] h-48 rounded-md border border-solid border-blue-500" v-model="formData.additional_info"></textarea>
          </div>
          <div class="mt-6 text-center flex justify-center space-x-6">
            <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md py-[10px] px-[16px]" @click="clickReturn">戻る</button>
            <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md py-[10px] px-[16px]" @click="clickUpdateAdditionalInfo">更新</button>
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { RegionPresetApi } from "../apis/http/RegionPresets";
import { RegionPresetPathParam, RegionPresetPutRequestBody } from "../models/RegionPresets"

const router = useRouter();
const props = defineProps<{
  id: string
}>();
const apiClient = new RegionPresetApi();
const formData = ref<RegionPresetPutRequestBody>({
  id: 0,
  name: "",
  gmlfile_path: "",
  mesh_codes: "",
  additional_info: "",
})

const getRegionPresetDetail = async() => {
  const params: RegionPresetPathParam = {
    id: props.id
  }
  const res = await apiClient.get(params);
  // この辺は 地域プリセット取得API のレスポンス判明後に手直し
  formData.value = <RegionPresetPutRequestBody>{ 
    id: Number(props.id),
    name: res.name,
    gmlfile_path: "",
    mesh_codes: "",
    additional_info: res.additional_info,
  };
}
// idが指定された場合は更新モード
if (props.id) {
  getRegionPresetDetail();
}

const clickUpdateAdditionalInfo = async ()=>{
  try {
    // 更新
    const params: RegionPresetPathParam = {
      id: props.id
    }
    const updatedata: RegionPresetPutRequestBody = {
      ...formData.value
    }
    const res = await apiClient.update(params, updatedata);
    if (!res.id) {
      alert("地域の付帯情報登録に失敗しました。システム管理者にお問い合わせください。");
      return false;
    }
    // 地域プリセット一覧に戻る
    router.push({name: "RegionPresetList"});
  } catch (e){
    // TODO: エラー共通化
    console.log(e);
  }
}

const clickReturn = () => {
  // 地域プリセット一覧に戻る
  router.push({name: "RegionPresetList"});
}
</script>