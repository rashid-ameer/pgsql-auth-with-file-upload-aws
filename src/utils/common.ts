export const getOtp = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "123456789";

  const all = letters + digits;

  let otp = "";
  otp += letters[Math.floor(Math.random() * letters.length)];
  otp += digits[Math.floor(Math.random() * digits.length)];

  for (let i = 0; i < 4; i++) {
    otp += all[Math.floor(Math.random() * all.length)];
  }

  return otp
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};
