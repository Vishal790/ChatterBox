import { toast } from "react-hot-toast";
import { authEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
const { SIGNUP_API, LOGIN_API } = authEndpoints;
import { setLoading, setToken, setUser } from "../../redux/slices/authSlice";

export function signUp(data, navigate) {
  const { name, bio, userName, avatar, password } = data;
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

   // console.log(name, bio, userName, avatar, password);
    const formData = new FormData();

    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("userName", userName);
    formData.append("avatar", avatar);
    formData.append("password", password);

    console.log("Formdata", formData.avatar);

    try {
      const response = await apiConnector("POST", SIGNUP_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // withCredentials: true,
      });

      console.log("SIGNUP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup Successful");
      navigate("/home");
    } catch (error) {
      console.log("SIGNUP API ERROR............", error);
      toast.error(
        error.response.data.message
          ? error.response.data.message
          : "Signup Failed"
      );
      navigate("/login");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(userName, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        userName,
        password,
      });

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.data.token));

      dispatch(setUser(response.data.data));

      localStorage.setItem("token", JSON.stringify(response.data.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.data));

      navigate("/home");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/login");
  };
}
