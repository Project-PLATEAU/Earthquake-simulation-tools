<template>
    <div class="m-10 list-view">
        <div class="text-xl font-bold">地振動プリセット一覧</div>
        <div class="flex space-x-4 mt-4 action-button-area">
          <button class="basis-5/12 bg-transparent text-blue-500 rounded-md border border-solid border-blue-500 text-base py-[9px] px-[17px] hover:text-blue-400" @click="clickCreatePreset">地振動の登録</button>
          <button class="basis-5/12 bg-transparent text-blue-500 rounded-md border border-solid border-blue-500 text-base py-[9px] px-[17px] hover:text-blue-400" @click="clickDeletePreset">追加されたプリセットの削除</button>
          <button class="basis-2/12 bg-transparent text-blue-500 rounded-md border border-solid border-blue-500 text-base py-[9px] px-[17px] hover:text-blue-400" @click="clickUpdatePresetOption">付帯情報</button>
        </div>
        <div class="mt-4 w-full">
          <table class="w-full table-fixed">
            <thead>
              <tr>
                <th class="font-semibold text-base h-10 align-middle border-b-4 border-solid border-blue-200 w-20"></th>
                <th class="font-semibold text-base h-10 align-middle border-b-4 border-solid border-blue-200 text-left">地振動</th>
                <th class="font-semibold text-base h-10 align-middle border-b-4 border-solid border-blue-200 w-60">最終更新日時</th>
              </tr>
            </thead>
            <tbody>
              <tr class="h-6" v-for="preset in presets">
                <td class="text-center h-12 border-b border-solid border-blue-500"><input type="checkbox" v-model="preset.chk"></td>
                <td class="text-left h-12 border-b border-solid border-blue-500">{{ preset.name }}</td>
                <td class="text-center h-12 border-b border-solid border-blue-500">{{ preset.updated }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 text-center flex justify-center">
          <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md px-4" @click="clickReturn">戻る</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { EarthQuakePresetApi } from "../apis/http/EarthQuakePresets";
import { EarthQuakePresetPathParam } from '../models/EarthQuakePresets';

const router = useRouter();
const apiClient = new EarthQuakePresetApi();
type presetTableRowType = {
  chk: boolean;
  id: number;
  name: string;
  updated: string;
}

const presets = ref<presetTableRowType[]>();

const getEarthQuakePreset = async() => {
  const res = await apiClient.list();
  if (!res.earthquake_presets){
    alert('地振動プリセットの取得に失敗しました。システム管理者にお問い合わせください。');
    return false;
  }
  presets.value = res.earthquake_presets.map((preset) => <presetTableRowType>{
    chk: false,
    id: preset.id,
    name: preset.name,
    updated: preset.create_date,
  });
}
getEarthQuakePreset();

const clickCreatePreset = ()=>{
  // 地振動登録画面に遷移
  router.push({name: "EarthQuakePresetRegistName"});
}

const clickDeletePreset = async() => {
  const checkedRows = presets.value!.filter((e)=> e.chk);
  if (checkedRows.length == 0) {
    alert('削除対象を指定してください。');
  } else {
    if (confirm('選択された地振動プリセット情報を削除しますか?')) {
      let row: presetTableRowType;
      for (row of checkedRows) {
        const param: EarthQuakePresetPathParam = {
          id: row.id.toString()
        }
        try {
          await apiClient.delete(param);
        } catch(e) {
          alert(`地振動プリセット[${row.name}]の削除に失敗しました。システム管理者にお問い合わせください。`);
          return false;
        }
      }
      //データ再取得
      getEarthQuakePreset();
    }
  }
}

const clickUpdatePresetOption = () =>{
  const checkedRows = presets.value!.filter((e)=> e.chk);
  if (checkedRows.length > 1) {
    alert('付帯情報の編集対象は1件のみ指定してください。')
  } else if (checkedRows.length == 0) {
    alert('付帯情報の編集対象を指定してください。')
  } else if (checkedRows.length == 1) {
    router.push({name: "EarthQuakePresetRegistOption", params:{id: checkedRows[0].id.toString()}});
  }
  //TODO: 0件の場合はボタン自体押せなくする
}

const clickReturn = () => {
  // メニューに戻る
  router.push({name: "Menu"});
}

</script>
