import bcrypt from 'bcrypt';
const senha = '04082026-art';
const hash = await bcrypt.hash(senha, 10);
console.log('Copie este hash para o .env:');
console.log(hash);
