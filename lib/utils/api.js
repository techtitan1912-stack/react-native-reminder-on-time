import Constants from "expo-constants";
import { Platform } from 'react-native';

// determine the host/IP for development builds.
// Prefer non-deprecated properties (e.g. `Constants.debuggerHost` or `expoConfig`).
// Fall back to older manifest fields only when necessary.
const debuggerHost =
  Constants.debuggerHost ||
  Constants.expoConfig?.debuggerHost ||
  Constants.manifest2?.debuggerHost ||
  '';
let localhost = debuggerHost.split(':')[0] || 'localhost';

// If we're running on Android emulator, map `localhost` to the emulator host
// that routes to the host machine (10.0.2.2). On physical devices keep the
// detected host (usually the LAN IP).
if (localhost === 'localhost' && Platform.OS === 'android' && !Constants.isDevice) {
  localhost = '10.0.2.2';
}

export const BASE_URL = __DEV__
  ? `https://react-native-reminder-on-time.onrender.com` // local backend
  : 'https://react-native-reminder-on-time.onrender.com';

  //  `http://192.168.1.8:3000` 
// Try fetch against multiple likely development hosts (helps when emulator/device
// needs a different mapping). Returns the first successful Response.
export async function fetchWithFallback(path, options = {}) {
  // path should start with a `/` (e.g. `/api/tasks/...`) or be a full URL.
  const isFullUrl = /^https?:\/\//i.test(path);

  const debuggerHostIp = (debuggerHost || '').split(':')[0];

  const candidates = [];
  // prefer explicit emulator mapping on Android emulators
  if (Platform.OS === 'android') candidates.push('http://10.0.2.2:3000');
  // the resolved development host on your LAN
  candidates.push(`http://192.168.1.8:3000`);
  // include debugger host IP if it's different
  if (debuggerHostIp && debuggerHostIp !== localhost) candidates.push(`http://${debuggerHostIp}:3000`);
  // fallback to plain localhost
  candidates.push('http://localhost:3000');

  const tried = [];
  let lastError = null;

  for (const base of [...new Set(candidates)]) {
    try {
      const url = isFullUrl ? path : `${base}${path.startsWith('/') ? path : '/' + path}`;
      tried.push(url);
      const res = await fetch(url, options);
      // return even non-OK responses (caller can inspect status), but we succeeded connecting
      return { res, usedUrl: url };
    } catch (err) {
      lastError = err;
      // try next candidate
      // continue
    }
  }

  const error = lastError || new Error('All fetch attempts failed');
  error.tried = tried;
  throw error;
}
