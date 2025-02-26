// Leitor de QR Code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js');
const client = new Client();

// Serviço de leitura do QR Code
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Conexão estabelecida
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Inicialização do cliente
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));
let userInfo = {};

client.on('message', async msg => {
    if (msg.body.match(/(menu|Menu|MENU|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        const contact = await msg.getContact();
        const name = contact.pushname;
        await client.sendMessage(msg.from, `Olá! ${name.split(" ")[0]}, sou seu PERSONAL TRAINER virtual. Como posso ajudá-lo hoje?\n\n` +
            "Por favor, digite uma das opções abaixo:\n\n" +
            "1 - Como funciona\n" +
            "2 - Montar treino personalizado\n" +
            "3 - Montar dieta personalizada\n" +
            "4 - Verificar IMC\n" +
            "5 - Quantidade de água diária\n" +
            "6 - Academias próximas a mim");
        await delay(1000);
    }

    // Opção 1: Como funciona
    if (msg.body === '1') {
        await client.sendMessage(msg.from, "COMO FUNCIONA?\nÉ muito simples.\n\n1º Passo: Escolha uma das opções no menu principal.\n" +
            "2º Passo: Forneça algumas informações sobre você para um protocolo mais personalizado.\n" +
            "3º Passo: Ponha em prática e tenha mais saúde!!\n*Digite 'MENU' para retornar às opções.*");
    }

    // Opção 2: Montar treino personalizado
    if (msg.body === '2') {
        await client.sendMessage(msg.from, "Para montar um treino personalizado, informe seu peso (em kg):");
        userInfo = { step: 'pesoTreino' };
    }

    // Opção 3: Montar dieta personalizada
    if (msg.body === '3') {
        await client.sendMessage(msg.from, "Para montar uma dieta personalizada, informe seu peso (em kg):");
        userInfo = { step: 'pesoDieta' };
    }

    // Opção 4: Verificar IMC
    if (msg.body === '4') {
        await client.sendMessage(msg.from, "Para calcular seu IMC, informe seu peso (em kg):");
        userInfo = { step: 'imcPeso' };
        return;
    }

    if (userInfo.step === 'imcPeso' && !userInfo.peso) {
        const peso = parseFloat(msg.body);
        if (isNaN(peso) || peso <= 0) {
            await client.sendMessage(msg.from, "Por favor, informe um peso válido.");
            return;
        }
        userInfo.peso = peso;
        await client.sendMessage(msg.from, "Agora, informe sua altura (em metros):");
        userInfo.step = 'imcAltura';
        return;
    }

    if (userInfo.step === 'imcAltura' && userInfo.peso) {
        const altura = parseFloat(msg.body);
        if (isNaN(altura) || altura <= 0) {
            await client.sendMessage(msg.from, "Por favor, informe uma altura válida.");
            return;
        }
        userInfo.altura = altura;
        
        const imc = userInfo.peso / (userInfo.altura * userInfo.altura);
        let classificacao = "";
        if (imc < 18.5) classificacao = "Abaixo do peso";
        else if (imc < 24.9) classificacao = "Peso normal";
        else if (imc < 29.9) classificacao = "Sobrepeso";
        else classificacao = "Obesidade";
        
        await client.sendMessage(msg.from, `Seu IMC é ${imc.toFixed(2)} - ${classificacao}`);
        userInfo = {};
        return;
    }

    // Opção 5: Quantidade de água diária
    if (msg.body === '5') {
        await client.sendMessage(msg.from, "Para calcular sua necessidade de água, informe seu peso (em kg):");
        userInfo = { step: 'agua' };
    }

    // Opção 6: Academias próximas
    if (msg.body === '6') {
        await client.sendMessage(msg.from, "Para encontrar academias próximas, ative sua localização no WhatsApp e envie sua posição.");
    }
});
