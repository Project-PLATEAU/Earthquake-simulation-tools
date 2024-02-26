<template>
    <div class="m-10">
        <div class="text-xl">地振動プリセット一覧</div>
        <div class="flex space-x-4 mt-4">
          <button class="border bg-slate-200 p-1" @click="clickCreatePreset">地振動の登録</button>
          <button class="border bg-slate-200 p-1" @click="clickDeletePreset">追加されたプリセットの削除</button>
          <button class="border bg-slate-200 p-1" @click="clickUpdatePresetOption">付帯情報</button>
        </div>
        <div class="mt-4 w-full h-80">
          <table class="border-slate-500 w-full table-fixed">
            <thead>
              <tr>
                <th class="border-b-2 w-20"></th>
                <th class="border-b-2">地振動</th>
                <th class="border-b-2 w-60">最終更新日時</th>
              </tr>
            </thead>
            <tbody>
              <tr class="h-6" v-for="preset in presets">
                <td class="border-b"><input type="checkbox" v-model="preset.chk"></td>
                <td class="border-b">{{ preset.name }}</td>
                <td class="border-b text-center">{{ preset.updated }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4">
          <button class="border bg-slate-200 p-1" @click="clickReturn">戻る</button>
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
        const res = await apiClient.delete(param);
        if (!res.id) {
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
