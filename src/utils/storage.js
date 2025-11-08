import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "usePrefs";

//content that we are saving

export async function saveUserPrefs(localUserName) {
  //a payload is a request
  try {
    const payload = JSON.stringify({ localUserName });
    await AsyncStorage.setItem(KEY, payload);
  } catch (e) {
    console.warn(`failed to save prefs`, e);
  }
}

export async function loadUserPrefs(localUserName) {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn(`failed to load prefs`, e);
  }
}

export async function removeUserPrefs() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.warn(`failed to remove ref`, e);
  }
}
