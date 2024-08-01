
const criptografarSenha =(senha:string)=>{
    let criptografada = senha.split("").reverse().join("");
    return 'zz'+criptografada+'yy'
}
export default criptografarSenha