import { http } from 'msw'

/** 地域プリセットデータ */
const db_datas = [
  {
    "id": 3,
    "name": "aaaaa",
    "geom": "ddddd",
    "gmlfile_path": null,
    "mesh_codes": "ccccc,eeee",
    "additional_info": "eeee",
    "create_date": "2023-12-22T15:00:00+00:00"
  },
  {
    "id": 4,
    "name": "test2",
    "geom": "ccccc",
    "gmlfile_path": null,
    "mesh_codes": "bbbb",
    "additional_info": "dddd",
    "create_date": "2023-12-27T19:54:30+00:00"
  },
  {
    "id": 5,
    "name": "aaaaa",
    "geom": "vcvv",
    "gmlfile_path": null,
    "mesh_codes": "bbbbbbbbb",
    "additional_info": "ccc",
    "create_date": "2023-12-27T20:22:01+00:00"
  },
  {
    "id": 6,
    "name": "fdsfasdfasd",
    "geom": "faaa",
    "gmlfile_path": null,
    "mesh_codes": "fadsfsda",
    "additional_info": "111321312",
    "create_date": "2023-12-27T20:25:56+00:00"
  },
  {
    "id": 7,
    "name": "fdsfasdfasd",
    "geom": "faaa",
    "gmlfile_path": null,
    "mesh_codes": "fadsfsda",
    "additional_info": "111321312",
    "create_date": "2023-12-27T20:26:01+00:00"
  },
  {
    "id": 8,
    "name": "fdsfasdfasd",
    "geom": "faaa",
    "gmlfile_path": null,
    "mesh_codes": "fadsfsda",
    "additional_info": "111321312",
    "create_date": "2023-12-27T20:26:02+00:00"
  },
  {
    "id": 9,
    "name": "fdsfasdfasd",
    "geom": "faaa",
    "gmlfile_path": null,
    "mesh_codes": "fadsfsda",
    "additional_info": "111321312",
    "create_date": "2023-12-27T20:26:02+00:00"
  },
  {
    "id": 10,
    "name": "fdsfasdfasd",
    "geom": "faaa",
    "gmlfile_path": null,
    "mesh_codes": "fadsfsda",
    "additional_info": "111321312",
    "create_date": "2023-12-27T20:26:03+00:00"
  },
  {
    "id": 11,
    "name": "fdsfasdfasd",
    "geom": "faaa",
    "gmlfile_path": null,
    "mesh_codes": "fadsfsda",
    "additional_info": "111321312",
    "create_date": "2023-12-27T20:26:04+00:00"
  },
  {
    "id": 13,
    "name": "fdsfasdfasd",
    "geom": "faaa",
    "gmlfile_path": null,
    "mesh_codes": "fadsfsda",
    "additional_info": "111321312",
    "create_date": "2023-12-27T20:26:05+00:00"
  }
];

export const RegionPresetsHandlers = [
  http.get('region_presets', () => {
    const response_data = {
      Total: db_datas.length,
      Page: 1,
      PageSize: 10,
      region_presets : db_datas
    };
    return new Response(JSON.stringify(response_data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }),
  http.get('region_preset/:id', ({params}) => {
    const { id } = params;
    const res = db_datas.find((element)=>{element.id == Number(id)});
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }),
  http.post('region_preset', async ({request}) => {
    const body = await request.json();
    console.log(`request body is ${body}`);
    const res = {
      id: 99,
    }
    return new Response(JSON.stringify(res), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }),
  http.put('region_preset/:id', async ({params, request}) => {
    const { id } = params;
    const body = await request.json();
    console.log(`path parameter is ${id}`);
    console.log(`request body is ${body}`);
    const res = {
      id: id
    }
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }),
  http.delete('region_preset/:id', async ({params}) => {
    const { id } = params;
    console.log(`path parameter is ${id}`);
    const res = {
      id: id
    }
    return new Response(JSON.stringify(res), {
      status: 204,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }),
]