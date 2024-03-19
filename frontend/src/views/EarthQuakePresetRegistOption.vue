<template>
    <div class="m-10 regist-view regist-additional-info">
        <div class="text-xl font-bold">地振動の付帯情報登録（編集）</div>
        <div class="text-center">
          <div class="mt-10">
          <label class="inline-block text-left text-base font-bold w-48">地振動識別名</label>
          <input type="text" maxlength="255" class="inline-block text-left w-[600px] inline-block text-left border border-solid border-blue-500" v-model="formData.name" />
          <button class="bg-transparent text-blue-500 rounded-md border border-solid border-blue-500 text-xs ml-2 px-4 h-10 hover:text-blue-400" @click="clickUpdate">更新</button>
        </div>
        <div class="mt-10">
          <label class="inline-block text-left text-base font-bold w-48 align-top">地振動に関する付帯情報</label>
          <textarea class="inline-block text-left w-[600px] h-48 rounded-md border border-solid border-blue-500" v-model="formData.additional_info"></textarea>
          <button class="bg-transparent text-blue-500 rounded-md border border-solid border-blue-500 text-xs ml-2 px-4 align-top h-10 hover:text-blue-400" @click="clickUpdate">更新</button>
        </div>
        <div class="mt-6 text-center flex justify-center">
          <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md px-4" @click="clickReturn">戻る</button>
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