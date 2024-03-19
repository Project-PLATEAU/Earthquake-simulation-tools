import chroma from 'chroma-js';


export const getDisplacementColorParamList = (strParam?: string) => {
  // geojsonがstringとして値を持っているのでcast
  const param = Number(strParam);
  return [
    {
      param: param ? param < 50 : false,
      name: '0-50 mm',
      color: [80, 64, 191, 200],
    },
    {
      param: param ? 50 < param && param < 100 : false,
      name: '50-100 mm',
      color: [64, 96, 191, 200],
    },
    {
      param: param ? 100 < param && param < 150 : false,
      name: '100-150 mm',
      color: [64, 143, 191, 200],
    },
    {
      param: param ? 150 < param && param < 200 : false,
      name: '150-200 mm',
      color: [64, 191, 191, 200],
    },
    {
      param: param ? 200 < param && param < 250 : false,
      name: '200-250 mm',
      color: [64, 191, 164, 200],
    },
    {
      param: param ? 250 < param && param < 300 : false,
      name: '250-300 mm',
      color: [64, 191, 127, 200],
    },
    {
      param: param ? 300 < param && param < 350 : false,
      name: '300-350 mm',
      color: [96, 191, 64, 200],
    },
    {
      param: param ? 350 < param && param < 400 : false,
      name: '350-400 mm',
      color: [64, 191, 64, 200],
    },
    {
      param: param ? 400 < param && param < 450 : false,
      name: '400-450 mm',
      color: [127, 191, 64, 200],
    },
    {
      param: param ? 450 < param && param < 500 : false,
      name: '450-500 mm',
      color: [191, 191, 64, 200],
    },
    {
      param: param ? 500 < param && param < 550 : false,
      name: '500-550 mm',
      color: [191, 164, 64, 200],
    },
    {
      param: param ? 550 < param && param < 600 : false,
      name: '550-600 mm',
      color: [191, 127, 64, 200],
    },
    {
      param: param ? 600 < param && param < 650 : false,
      name: '600-650 mm',
      color: [191, 111, 64, 200],
    },
    {
      param: param ? 650 < param && param < 700 : false,
      name: '650-700 mm',
      color: [191, 96, 64, 200],
    },
    {
      param: param ? 700 < param && param < 750 : false,
      name: '700-750 mm',
      color: [191, 64, 64, 200],
    },
    {
      param: param ? 750 < param : false,
      name: '750-800 mm',
      color: [191, 64, 111, 200],
    },
  ];
};

export const displacementDamageColor = (param?: number) => {
  return [
    {
      param: param? param === 1 : false,
      name : '木造：軽微',
      color: [64, 96, 191, 200],
    },
    {
      param: param? param === 2 : false,
      name : '木造：被害',
      color: [255, 255, 0, 200],
    },
    {
      param: param? param === 3 : false,
      name : '木造：倒壊',
      color: [255, 0, 0, 200],
    },
    {
      param: param? param === 4 : false,
      name : 'RC造・S造：軽微',
      color: [64, 96, 191, 200],
    },
    {
      param: param? param === 5 : false,
      name : 'RC造・S造：小破',
      color: [255, 255, 0, 200],
    },
    {
      param: param? param === 6 : false,
      name : 'RC造・S造：中破',
      color: [255, 191, 0, 200],
    },
    {
      param: param? param === 7 : false,
      name : 'RC造・S造：大破',
      color: [255, 0, 0, 200],
    },
  ]
}

export const getColorParamList = (id: string, param?: number | string) => {
  if (
    (id === 'displacement' || id === 'main_shock') &&
    (typeof param === 'string' || typeof param === 'undefined')
  ) {
    return getDisplacementColorParamList(param);
  }
  if (
    id.includes('building_damage') &&
    (typeof param === 'number' || typeof param === 'undefined')
  ) {
    return displacementDamageColor(param);
  }
  return [];
};
