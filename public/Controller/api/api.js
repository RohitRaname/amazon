import { alertError } from '../Components/Alert/alertController.js';
const api = 'http://localhost:8000/api/v1/';
const api_view = 'http://localhost:8000/';

const makeReq = async function (
  method,
  route,
  body = undefined,
  redirectTo,
  passError = false
) {
  try {
    const res = await axios({
      method,
      url: `${api}${route}`,
      data: body,
    });


    if (redirectTo) return setTimeout(() => location.assign(redirectTo), 1000);
    console.log(res.data)
    return res.data;
    // show succes message or send succes back to view
  } catch (err) {
    console.error(err);

    if (passError) return err.response && err.response.data?err.response.data:false;

    alertError(err.response.data.message);

    return false;
  }
};

export const get = async (route, redirectTo, passError) => {
  return await makeReq('GET', route, null, redirectTo, true);
};
export const get_with_body = async (route, body, redirectTo) => {
  return await makeReq('GET', route, body, redirectTo);
};
export const post = async (route, body, redirectTo, passError) => {
  return await makeReq('POST', route, body, redirectTo, passError);
};
export const patch = async (route, body, redirectTo,passError) => {
  return await makeReq('PATCH', route, body, redirectTo,passError);
};

export const del = async (route, body, redirectTo,passError) => {
  return await makeReq('DELETE', route, body, redirectTo,passError);
};

// export const get_view_req = async (route, data, redirectTo) => {
//   return await makeReq('GET', route, data, redirectTo, true);
// };

// export const delete = async (route) => await makeReq("DELETE",route);
