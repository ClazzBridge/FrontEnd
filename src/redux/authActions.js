import apiClient from "../shared/apiClient";
import {login, logout} from "./authSlice";

export const loginAsync = (user, token) => async (dispatch) => {
  try {
    // 로그인 처리 로직
    dispatch(login({user: user, token: token}));

  } catch (error) {
    console.error("로그인 처리 중 오류 발생:", error);
  }
};

export const logoutAsync = () => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;

    if (user?.id) {
      await apiClient.post("/logout", { memberId: user.id });
      console.log("좌석 상태를 오프라인으로 업데이트 완료");
    }
  } catch (error) {
    console.error("좌석 상태 업데이트 중 오류 발생:", error);
  } finally {
    await dispatch(logout());
    window.location.href = "/"; // 리다이렉트
  }
};