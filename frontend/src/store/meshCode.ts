import { defineStore } from "pinia";

export const useMeshCodeStore = defineStore("meshCode", {
  state: () => ({
    meshCodes: [] as Array<string>,
    changeFlag: false as boolean,
    tempPresetName: "" as string,
  }),
  getters: {
    meshCodeList():Array<string> {
      return this.meshCodes;
    },
  },
  actions: {
    setMeshCode(meshCode: string) {
      if (meshCode == "") {
        return;
      }
      this.meshCodes.push(meshCode);
    },
    removeMeshCode(meshCode: string) {
      // 該当のmeshCodeを削除
      this.meshCodes.forEach((code) => {
        if (code == meshCode) {
          const index = this.meshCodes.indexOf(code);
          this.meshCodes.splice(index, 1);
        }
      });
    },
    initMeshCode() {
      this.meshCodes = [];
      this.changeFlag = false;
      this.tempPresetName = "";
    },
  },
});