const ROOT_URL =
  "https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev";

export const fetchSearchResult = async (inputValue) => {
  try {
    const cachedResponse = localStorage.getItem(inputValue);
    if (cachedResponse) {
      return JSON.parse(cachedResponse);
    }
    const response = await fetch(`${ROOT_URL}/languages?keyword=${inputValue}`);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    localStorage.setItem(inputValue, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error("fetch fail", error);
    throw error;
  }
};
