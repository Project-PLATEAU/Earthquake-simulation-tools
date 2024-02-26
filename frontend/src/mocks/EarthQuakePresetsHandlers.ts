import { http } from 'msw'

/** 地振動プリセットデータ */
const db_datas = [
  {
    "id": 1,
    "name": "test",
    "file_path_type1": "aaa",
    "file_path_type2": "bbb",
    "file_path_type3": "ccc",
    "additional_info": "bbbb",
    "create_date": "2023-12-27T21:11:51+00:00"
  },
  {
    "id": 2,
    "name": "test",
    "file_path_type1": "aaa",
    "file_path_type2": "bbb",
    "file_path_type3": "ccc",
    "additional_info": "bbbb",
    "create_date": "2023-12-27T21:11:55+00:00"
  },
  {
    "id": 3,
    "name": "test",
    "file_path_type1": "aaa",
    "file_path_type2": "bbb",
    "file_path_type3": "ccc",
    "additional_info": "bbbb",
    "create_date": "2023-12-27T21:11:56+00:00"
  },
  {
    "id": 5,
    "name": "test",
    "file_path_type1": "aaa",
    "file_path_type2": "bbb",
    "file_path_type3": "ccc",
    "additional_info": "bbbb",
    "create_date": "2023-12-27T21:11:57+00:00"
  },
  {
    "id": 6,
    "name": "test",
    "file_path_type1": "aaa",
    "file_path_type2": "bbb",
    "file_path_type3": "ccc",
    "additional_info": "bbbb",
    "create_date": "2023-12-27T21:11:58+00:00"
  },
  {
    "id": 7,
    "name": "test",
    "file_path_type1": "aaa",
    "file_path_type2": "bbb",
    "file_path_type3": "ccc",
    "additional_info": "bbbb",
    "create_date": "2023-12-27T21:11:59+00:00"
  },
  {
    "id": 8,
    "name": "test",
    "file_path_type1": "aaa",
    "file_path_type2": "bbb",
    "file_path_type3": "ccc",
    "additional_info": "bbbb",
    "create_date": "2023-12-27T21:11:59+00:00"
  },
  {
    "id": 9,
    "name": "test",
    "file_path_type1": "aaa",
    "file_path_type2": "bbb",
    "file_path_type3": "ccc",
    "additional_info": "bbbb",
    "create_date": "2023-12-27T21:12:00+00:00"
  },
  {
    "id": 10,
    "name": "test",
    "file_path_type1": "aaa",
    "file_path_type2": "bbb",
    "file_path_type3": "ccc",
    "additional_info": "bbbb",
    "create_date": "2023-12-27T21:12:00+00:00"
  },
  {
    "id": 11,
    "name": "test",
    "file_path_type1": "aaa",
    "file_path_type2": "bbb",
    "file_path_type3": "ccc",
    "additional_info": "bbbb",
    "create_date": "2023-12-27T21:12:01+00:00"
  }
];

export const EarthQuakePresetsHandlers = [
  http.get('earthquake_presets', () => {
    const response_data = {
      Total: db_datas.length,
      Page: 1,
      PageSize: 10,
      earthquake_presets : db_datas
    };
    return new Response(JSON.stringify(response_data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }),
  http.get('earthquake_preset/:id', ({params}) => {
    const { id } = params;
    const res = db_datas.find((element)=>{element.id == Number(id)});
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }),
  http.post('earthquake_preset', async ({request}) => {
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
  http.put('earthquake_preset/:id', async ({params, request}) => {
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
  http.delete('earthquake_preset/:id', async ({params}) => {
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