export const getNickName = (): string => {
  return localStorage.getItem("nickname") ?? "";
}
