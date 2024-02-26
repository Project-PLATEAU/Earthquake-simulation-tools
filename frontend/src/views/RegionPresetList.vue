<template>
    <div class="m-10">
        <div class="text-xl">地域プリセット一覧</div>
        <div class="flex space-x-4 mt-4">
          <button class="border bg-slate-200 p-1" @click="clickCreateAndEditPreset">地域（CityGML)の追加・編集</button>
          <button class="border bg-slate-200 p-1" @click="clickDeletePreset">追加されたプリセットの削除</button>
          <button class="border bg-slate-200 p-1" @click="clickUpdatePresetOption">付帯情報</button>
        </div>
        <div class="mt-4 w-full h-80">
          <table class="border-slate-500 w-full table-fixed">
            <thead>
              <tr>
                <th class="border-b-2 w-20"></th>
                <th class="border-b-2">名称</th>
                <th class="border-b-2 w-40">メッシュ数</th>
                <th class="border-b-2 w-60">最終更新日時</th>
              </tr>
            </thead>
            <tbody>
              <tr class="h-6" v-for="preset in presets">
                <td class="border-b"><input type="checkbox" v-model="preset.chk"></td>
                <td class="border-b">{{ preset.name }}</td>
                <td class="border-b text-right">{{ preset.mesh_count }}</td>
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
import { RegionPresetApi } from "../apis/http/RegionPresets";
import { RegionPresetPathParam } from '../models/RegionPresets';
import { useMeshCodeStore } from '../store/meshCode';

const router = useRouter();
const apiClient = new RegionPresetApi();
type presetTableRowType = {
  chk: boolean;
  id: number;
  name: string;
  mesh_count: number;
  updated: string;
}
const meshCodeStore = useMeshCodeStore();

const presets = ref<presetTableRowType[]>();

const getRegionPreset = async() => {
  const res = await apiClient.list();
  if (!res.region_presets){
    alert('地域プリセットの取得に失敗しました。システム管理者にお問い合わせください。');
    return false;
  }
  presets.value = res.region_presets.map((preset) => <presetTableRowType>{
    chk: false,
    id: preset.id,
    name: preset.name,
    mesh_count: (preset.mesh_codes ?? '').split(',').length,
    updated: preset.create_date,
  });
}
getRegionPreset();

const clickCreateAndEditPreset = ()=>{
  const checkedRows = presets!.value!.filter((e)=> e.chk);
  if (checkedRows.length > 1) {
    alert('地域（CityGML)の編集対象は1件のみ指定してください。')
  } else if (checkedRows.length == 0) {
    router.push({name: "RegionPresetRegistName"});
  } else if (checkedRows.length == 1) {
    router.push({name: "RegionPresetEditName", params:{id: checkedRows[0].id.toString()}});
  }

  // メッシュコード初期化
  meshCodeStore.initMeshCode();
}

const clickDeletePreset = async () => {
  const checkedRows = presets.value!.filter((e)=> e.chk);
  if (checkedRows.length == 0) {
    alert('削除対象を指定してください。');
  } else {
    if (confirm('選択された地域プリセット情報を削除しますか?')) {
      let row: presetTableRowType;
      for (row of checkedRows) {
        const param: RegionPresetPathParam = {
          id: row.id.toString()
        }
        try {
          await apiClient.delete(param);
        } catch(e) {
          alert(`地域プリセット[${row.name}]の削除に失敗しました。システム管理者にお問い合わせください。`);
          return false;
        }
      }
      //データ再取得
      getRegionPreset();
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
    router.push({name: "RegionPresetRegistOption", params:{id: checkedRows[0].id.toString()}});
  }
  //TODO: 0件の場合はボタン自体押せなくする
}

const clickReturn = () => {
  // メニューに戻る
  router.push({name: "Menu"});
}

</script>
