export const validUrl = (name) => {
  const url = name
    ?.toString()
    ?.replaceAll(" ", "-")
    ?.replaceAll(",", "-")
    ?.replaceAll("&", "-");
  return url;
};
