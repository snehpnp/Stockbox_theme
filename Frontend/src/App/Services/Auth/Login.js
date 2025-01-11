import axios from "axios";

import * as Config from "../../../Utils/config";

export async function LoginApi(data) {
  try {
    const response = await axios.post(`${Config.base_url}user/login`,data);

    return response.data;
  } catch (error) {
    console.log("Error fetching login:", error.message || error);
    throw error;
  }
}
