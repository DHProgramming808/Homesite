export const getInfo = async () => {
  try {
    const response = await fetch("https://localhost:5086/api/v1/info"); //TODO configure this for local and remote hosting

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Error fetching /info:", err);
    return null;
  }
};
