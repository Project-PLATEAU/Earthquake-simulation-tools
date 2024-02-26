import header from "../components/header.vue"
import Login from "../views/Login.vue"
import Menu from "../views/Menu.vue"
import RegionPresetList from "../views/RegionPresetList.vue"
import RegionPresetRegistName from "../views/RegionPresetRegistName.vue"
import RegionPresetRegistOption from "../views/RegionPresetRegistOption.vue"
import RegionPresetMap from "../views/RegionPresetMap.vue"
import EarthQuakePresetList from "../views/EarthQuakePresetList.vue"
import EarthQuakePresetRegistName from "../views/EarthQuakePresetRegistName.vue"
import EarthQuakePresetRegistOption from "../views/EarthQuakePresetRegistOption.vue"
import SimulationReserveList from "../views/SimulationReserveList.vue"
import SimulationReserveDetail from "../views/SimulationReserveDetail.vue"
import SimulationReserveRegistInput from "../views/SimulationReserveRegistInput.vue"
import SimulationReserveRegistConfirm from "../views/SimulationReserveRegistConfirm.vue"
import SimulationReserveRegistComplete from "../views/SimulationReserveRegistComplete.vue"
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/Login',
    children: [
      {
        path: '',
        name: 'Login',
        component: Login
      },
    ]
  },
  {
    path: '/',
    component: header,
    children: [
      {
        path: '',
        name: 'Menu',
        component: Menu
      },
      {
        path: 'RegionPresetList',
        name: 'RegionPresetList',
        component: RegionPresetList
      },
      {
        path: 'RegionPresetRegistName',
        name: 'RegionPresetRegistName',
        component: RegionPresetRegistName
      },
      {
        path: 'RegionPresetRegistName/:id',
        name: 'RegionPresetEditName',
        component: RegionPresetRegistName,
        props: true
      },
      {
        path: 'RegionPresetRegistOption/:id',
        name: 'RegionPresetRegistOption',
        component: RegionPresetRegistOption,
        props: true
      },
      {
        path: 'RegionPresetMap',
        name: 'RegionPresetMap',
        component: RegionPresetMap,
        props: true
      },
      {
        path: 'EarthQuakePresetList',
        name: 'EarthQuakePresetList',
        component: EarthQuakePresetList
      },
      {
        path: 'EarthQuakePresetRegistName',
        name: 'EarthQuakePresetRegistName',
        component: EarthQuakePresetRegistName
      },
      {
        path: 'EarthQuakePresetRegistOption/:id',
        name: 'EarthQuakePresetRegistOption',
        component: EarthQuakePresetRegistOption,
        props: true
      },
      {
        path: 'SimulationReserveList',
        name: 'SimulationReserveList',
        component: SimulationReserveList
      },
      {
        path: 'SimulationReserveDetail/:id',
        name: 'SimulationReserveDetail',
        component: SimulationReserveDetail,
        props: true
      },
      {
        path: 'SimulationReserveRegistInput',
        name: 'SimulationReserveRegistInput',
        component: SimulationReserveRegistInput
      },
      {
        path: 'SimulationReserveRegistConfirm',
        name: 'SimulationReserveRegistConfirm',
        component: SimulationReserveRegistConfirm
      },
      {
        path: 'SimulationReserveRegistComplete',
        name: 'SimulationReserveRegistComplete',
        component: SimulationReserveRegistComplete
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;