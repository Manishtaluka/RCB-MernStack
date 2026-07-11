import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken, setCredentials, logout } from "../redux/slices/authSlice.js";
import { refreshSession, fetchMe } from "../api/authApi.js";

// Runs once when the app mounts. If a valid refresh cookie exists, this
// silently logs the person back in without them re-entering credentials.
export default function useSessionRestore() {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      try {
        const { data } = await refreshSession();
        if (cancelled) return;
        dispatch(setAccessToken(data.accessToken));

        const meResponse = await fetchMe();
        if (cancelled) return;
        dispatch(setCredentials({ user: meResponse.data.user, accessToken: data.accessToken }));
      } catch {
        if (!cancelled) dispatch(logout());
      } finally {
        if (!cancelled) setChecked(true);
      }
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return checked;
}
