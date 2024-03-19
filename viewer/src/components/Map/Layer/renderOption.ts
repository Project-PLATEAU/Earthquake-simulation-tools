import { getColorParamList } from '@/components/Map/Legend/colorParamList';

const getColorParam = (id: string, param: number | string) => {
  const colorParamList = getColorParamList(id, param);
  // @ts-ignore
  const colorParam = colorParamList.find((colorParam) => colorParam.param);
  return colorParam?.color;
};

const displacement = (layer: any) => {
  const getElevation = (d: any) => {
    if ('bui_floor' in d.properties) {
      if (d.properties.bui_floor === 0) {
        return 2 * 3;
      } else {
        return d.properties.bui_floor * 3;
      }
    }
    return 2 * 3;
  };

  return layer.clone({
    extruded: true,
    getElevation,
  });
};

const buildingDamage = (layer: any) => {
  const getFillColor = (d: any) => {
    let param:number = 1;
    const drift = d.properties['max_drift'];
    // 木造
    if (d.properties['_NAME00001'] === 'WoodMDOF') {
      if (drift < 0.017) {
        param = 1;
      }
      if (0.017 <= drift && drift < 0.1) {
        param = 2;
      }
      if (0.1 <= drift) {
        param = 3;
      }
    }
    // RC造
    if (d.properties['_NAME00002'] === 'RC' || d.properties['_NAME00002'] === 'SRC') {
      if (drift < 0.004) {
        param = 4;
      }
      if (0.004 <= drift && drift < 0.01) {
        param = 5;
      }
      if (0.01 <= drift && drift < 0.02) {
        param = 6;
      }
      if (0.02 <= drift) {
        param = 7;
      }
    }
    // S造
    if (d.properties['_NAME00001'] === 'SteelMDOF') {
      if (drift < 0.005) {
        param = 4;
      }
      if (0.005 <= drift && drift < 0.01) {
        param = 5;
      }
      if (0.01 <= drift && drift < 0.025) {
        param = 6;
      }
      if (0.025 <= drift) {
        param = 7;
      }
    }
    return getColorParam(layer.id, param);
  };
  const getLineColor = () => [200, 200, 200, 200];
  const getElevation = (d: any) => {
    if ('height' in d.properties) {
      return d.properties.height;
    }
    if ('bui_floor' in d.properties) {
      if (d.properties.bui_floor === 0) {
        return 2 * 3;
      } else {
        return d.properties.bui_floor * 3;
      }
    }
    return 2 * 3;
  };

  return layer.clone({
    extruded: true,
    getFillColor,
    getLineColor,
    getElevation,
  });
};

const buildingPlateau = (layer: any) => {
  const getLineColor = () => [255, 170, 50, 200];
  const getFillColor = (d: any) => [200, 200, 200, 200];
  const getElevation = (d: any) =>
    'measuredHeight' in d.properties ? d.properties.measuredHeight : 0;

  return layer.clone({
    extruded: true,
    getLineColor,
    getFillColor,
    getElevation,
  });
};

export const addRenderOption = (layer: any) => {
  if (layer && layer.id) {

    //変位量（本震）
    if (layer.id === 'main_shock') {
      return displacement(layer);
    }

    if (layer.id === 'building_damage') {
      return buildingDamage(layer);
    }

    if (layer.id === 'plateau-building') {
      return buildingPlateau(layer);
    }
  }
  return layer;
};
