export const generateCode = (length: number) => {
  const a = 'A'.charCodeAt(0);
  const z = 'Z'.charCodeAt(0);

  let code = '';
  for (let i = 0; i < length; i++)
    code += String.fromCharCode(Math.floor(Math.random() * (z - a + 1)) + a);

  return code;
};