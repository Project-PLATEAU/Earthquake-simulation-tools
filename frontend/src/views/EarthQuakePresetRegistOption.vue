<template>
    <div class="m-10">
        <div class="text-xl">地振動の付帯情報登録（編集）</div>
        <div class="mt-10">
          <label class="pr-6">地振動識別名</label>
          <input type="text" maxlength="255" class="w-2/5 ml-20" v-model="formData.name" />
          <button class="border bg-slate-200 py-1 px-6 w-32 ml-6" @click="clickUpdate">更新</button>
        </div>
        <div class="mt-10">
          <label class="pr-6">地振動に関する付帯情報</label>
          <textarea class="w-2/5 h-60 align-top" v-model="formData.additional_info"></textarea>
          <button class="border bg-slate-200 py-1 px-6 w-32 ml-6" @click="clickUpdate">更新</button>
        </div>
        <div class="mt-6">
          <div class="w-72 grid grid-cols-2 gap-2">
            <button class="border bg-slate-200 py-1 px-6 w-32" @click="clickReturn">戻る</button>
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { EarthQuakePresetApi } from "../apis/http/EarthQuakePresets";
import { EarthQuakePresetPathParam, EarthQuakePresetPutRequestBody } from "../models/EarthQuakePresets"

const router = useRouter();
const props = defineProps<{
  id: string
}>();
const apiClient = new EarthQuakePresetApi();
const formData = ref<EarthQuakePresetPutRequestBody>({
  id: 0,
  name: "",
  file_path_type1: "",
  file_path_type2: "",
  file_path_type3: "",
  additional_info: "",
})

const getEarthQuakePresetDetail = async() => {
  const params: EarthQuakePresetPathParam = {
    id: props.id
  }
  const res = await apiClient.get(params);
  formData.value = <EarthQuakePresetPutRequestBody>{
    id: Number(props.id),
    name: res.name,
    file_path_type1: res.file_path_type1,
    file_path_type2: res.file_path_type2,
    file_path_type3: res.file_path_type3,
    additional_info: res.additional_info,
  };
}
getEarthQuakePresetDetail();

const clickUpdate = async ()=>{
  try {
    // 更新
    const params: EarthQuakePresetPathParam = {
      id: props.id
    }
    const updatedata: EarthQuakePresetPutRequestBody = {
      ...formData.value
    }
    const res = await apiClient.update(params, updatedata);
    // レスポンスとしてidが返却されない場合は api実行失敗
    if (!res.id) {
      alert("地振動の付帯情報登録に失敗しました。システム管理者にお問い合わせください。");
      return false;
    }
    // 地振動プリセット一覧に戻る
    router.push({name: "EarthQuakePresetList"});
  } catch (e){
    // TODO: エラー共通化
    console.log(e);
  }
}

const clickReturn = () => {
  // 地振動プリセット一覧に戻る
  router.push({name: "EarthQuakePresetList"});
}
</script>