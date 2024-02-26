<template>
    <div class="m-10">
        <div class="text-xl">地域の付帯情報登録（編集）</div>
        <div class="mt-10">
          <label class="pr-6">地振動識別名</label>
          <label class="w-2/5">{{formData.name}}</label>
        </div>
        <div class="mt-10">
          <label class="pr-6">地振動に関する付帯情報</label>
          <textarea class="w-2/5 h-60 align-top" v-model="formData.additional_info"></textarea>
        </div>
        <div class="mt-6">
          <div class="w-72 grid grid-cols-2 gap-2">
            <button class="border bg-slate-200 py-1 px-6 w-32" @click="clickReturn">戻る</button>
            <button class="border bg-slate-200 py-1 px-6 w-32" @click="clickUpdateAdditionalInfo">更新</button>
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