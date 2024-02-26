<template>
    <div class="pt-6">
        <div class="text-xl">地振動の登録</div>
        <div class="mt-10">
          <label class="pr-6">地振動識別名</label>
          <input type="text" maxlength="255" class="w-2/5" v-model="formData.name" />
        </div>
        <div class="mt-10">
          <label class="pr-6">地振動ファイルの選択</label>
          <input type="file" ref="fileInputRef1" @change="changeFile1" class="block mt-6">
          <input type="file" ref="fileInputRef2" @change="changeFile2" class="block mt-6">
          <input type="file" ref="fileInputRef3" @change="changeFile3" class="block mt-6">
        </div>
        <div class="mt-6">
          <div class="w-full grid grid-cols-6 gap-2">
            <button class="border bg-slate-200 py-1 px-6 w-32" @click="clickReturn">戻る</button>
            <button class="border bg-slate-200 py-1 px-6 w-454" @click="clickCreateAndEditPreset">地振動ファイルの登録</button>
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { EarthQuakePresetApi } from "../apis/http/EarthQuakePresets";
import { 
  EarthQuakePresetPostRequestBody, 
  EarthQuakePresetPostResponse,
} from "../models/EarthQuakePresets"

const router = useRouter();
const apiClient = new EarthQuakePresetApi();
const formData = ref<EarthQuakePresetPostRequestBody>({
  name: "",
  file_path_type1: "",
  file_path_type2: "",
  file_path_type3: "",
  additional_info: "",
})
const fileInputRef1 = ref<HTMLInputElement | null>(null);
const fileInputRef2 = ref<HTMLInputElement | null>(null);
const fileInputRef3 = ref<HTMLInputElement | null>(null);
const files1 = ref<FileList | null>();
const files2 = ref<FileList | null>();
const files3 = ref<FileList | null>();

const changeFile1 = () => {
    files1.value = fileInputRef1.value?.files;
}
const changeFile2 = () => {
    files2.value = fileInputRef2.value?.files;
}
const changeFile3 = () => {
    files3.value = fileInputRef3.value?.files;
}

const clickCreateAndEditPreset = async ()=>{
  // 必須チェック
  if (formData.value.name == "") {
    alert("地振動識別名は必須入力です。")
    return false;
  }
  try {
    // 登録
    const form = new FormData();
    form.append('name', formData.value.name!);
    form.append('additional_info', '');
    if(files1.value) {
      form.append('file1', files1.value![0]);
    }
    if(files2.value) {
      form.append('file2', files2.value![0]);
    }
    if(files3.value) {
      form.append('file3', files3.value![0]);
    }
    
    const result: EarthQuakePresetPostResponse = await apiClient.create(form)
    if (!result.id) {
      alert("地振動の追加に失敗しました。システム管理者にお問い合わせください。");
      return false;
    }
    // 地振動プリセット一覧に戻る
    router.push({name: "EarthQuakePresetList"});
  } catch (e){
    console.log(e);
  }
}

const clickReturn = () => {
  // 地域プリセット一覧に戻る
  router.push({name: "EarthQuakePresetList"});
}
</script>