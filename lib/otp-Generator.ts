export const generateOTP = () => ({
  token: Math.floor(1000 + Math.random() * 9000).toString(),
  expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
});
