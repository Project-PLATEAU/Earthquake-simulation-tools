import { http } from 'msw'

/** シミュレーション予約データ */
const db_datas = [
  {
    "id": 1,
    "region_presets_name": "aaaaa",
    "earthquake_presets_name": "ddddd",
    "create_date": "2023-12-22T15:00:00+00:00",
    "calc_status_name": "計算中"
  }
];

export const SimulationReservesHandlers = [
  http.get('simulation_reserves', () => {
    const response_data = {
      Total: db_datas.length,
      Page: 1,
      PageSize: 10,
      simulation_reserves : db_datas
    };
    return new Response(JSON.stringify(response_data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }),
  http.get('simulation_reserve/:id', ({params}) => {
    const { id } = params;
    const res = db_datas.find((element)=>{element.id == Number(id)});
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }),
  http.post('simulation_reserve', async ({request}) => {
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
  http.put('simulation_reserve/:id', async ({params, request}) => {
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
]