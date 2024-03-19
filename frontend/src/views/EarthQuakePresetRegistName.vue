<template>
    <div class="pt-6 regist-view regist-name">
        <div class="ml-10 text-xl font-bold">地振動の登録</div>
        <div class="container ml-10">
          <div class="mt-10 flex flex-row">
            <label class="inline-block text-left text-base font-bold w-48 basis-1/4">地振動識別名</label>
            <input type="text" maxlength="255" class="inline-block text-left w-[600px] ml-5 h-10 rounded-md border border-solid border-blue-500" v-model="formData.name" />
          </div>
          <div class="mt-10 flex flex-row">
            <label class="inline-block text-left text-base font-bold w-48 basis-1/4">地振動ファイルの選択（長期的特性）</label>
            <label class="bg-transparent rounded-md text-blue-500 cursor-pointer text-base border border-solid border-blue-500 px-4 ml-5 flex items-center justify-center hover:text-blue-400">
              <input type="file" ref="fileInputRef1" @change="changeFile1" accept=".csv" class="hidden"/>ファイルを選択
            </label>
            <input type="text" readonly class="bg-transparent rounded-md text-blue-500 text-base ml-2 border border-solid border-blue-200 py-[6px] px-[17px] w-[440px] basis-1/4" placeholder="選択されていません" :value="filename1" />
          </div>
          <div class="mt-10 flex flex-row">
            <label class="inline-block text-left text-base font-bold w-48 basis-1/4">地振動ファイルの選択（標準的）</label>
            <label class="bg-transparent rounded-md text-blue-500 cursor-pointer text-base border border-solid border-blue-500 px-4 ml-5 flex items-center justify-center hover:text-blue-400">
              <input type="file" ref="fileInputRef2" @change="changeFile2" accept=".csv" class="hidden"/>ファイルを選択
            </label>
            <input type="text" readonly class="bg-transparent rounded-md text-blue-500 text-base ml-2 border border-solid border-blue-200 py-[6px] px-[17px] w-[440px] basis-1/4" placeholder="選択されていません" :value="filename2" />
          </div>
          <div class="mt-10 flex flex-row">
            <label class="inline-block text-left text-base font-bold w-48 basis-1/4">地振動ファイルの選択（直下地震）</label>
            <label class="bg-transparent rounded-md text-blue-500 cursor-pointer text-base border border-solid border-blue-500 px-4 ml-5 flex items-center justify-center hover:text-blue-400">
              <input type="file" ref="fileInputRef3" @change="changeFile3" accept=".csv" class="hidden"/>ファイルを選択
            </label>
            <input type="text" readonly class="bg-transparent rounded-md text-blue-500 text-base ml-2 border border-solid border-blue-200 py-[6px] px-[17px] w-[440px] basis-1/4" placeholder="選択されていません" :value="filename3" />
          </div>
          <div class="mt-6 text-center flex justify-center space-x-6">
            <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md px-4" @click="clickReturn">戻る</button>
            <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md px-4" @click="clickCreateAndEditPreset">地振動ファイルの登録</button>
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
const filename1 = ref('');
const filename2 = ref('');
const filename3 = ref('');

const changeFile1 = () => {
    files1.value = fileInputRef1.value?.files;
    filename1.value = files1.value ? files1.value[0].name : '';
}
const changeFile2 = () => {
    files2.value = fileInputRef2.value?.files;
    filename2.value = files2.value ? files2.value[0].name : '';
}
const changeFile3 = () => {
    files3.value = fileInputRef3.value?.files;
    filename3.value = files3.value ? files3.value[0].name : '';
}

const clickCreateAndEditPreset = async ()=>{
  // 必須チェック
  if (formData.value.name == "") {
    alert("地振動識別名は必須入力です。");
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