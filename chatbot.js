// leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Mudança Buttons
const client = new Client();
// serviço de leitura do qr code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
// apos isso ele diz que foi tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});
// E inicializa tudo 
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

// Funil
let userInfo = {};

client.on('message', async msg => {

    if (msg.body.match(/(menu|Menu|MENU|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        const contact = await msg.getContact();
        const name = contact.pushname;
        await client.sendMessage(msg.from, 'Olá! ' + name.split(" ")[0] + ', sou seu PERSONAL TRAINER virtual. Como posso ajudá-lo hoje?\n\nPor favor, digite uma das opções abaixo:\n\n1 - Como funciona\n2 - Montar treino personalizado\n3 - Montar dieta personalizada\n4 - Acadêmias próximas a mim\n5 - Outras perguntas');
        await delay(1000);
    }

    // Opção 1
    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, 'COMO FUNCIONA?\nÉ muito simples.\n\n1º Passo\nEscolha uma de nossa opções no menu principal.\n\n2º Passo\nForneça algumas informações sobre você para um protocolo mais personalidado.\n\n3º Passo\nPonha em prática e tenha mais saúde!!\n*digite "MENU" para retonar as opções*');
    }

    // Opção 2: Montar treino personalizado
    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, 'Agora, para montar um treino personalizado, preciso de mais algumas informações:\n\nPor favor, informe o seu peso (em kg):');
        
        // Aguardar o peso
        userInfo.step = 'peso';  // Definir que agora é a vez de coletar o peso
    }

    // Opção 3: Montar dieta personalizada
    if (msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, 'Sorteio de prêmios todo ano.\n\nAtendimento médico ilimitado 24h por dia.\n\nReceitas de medicamentos');
        
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, 'Agora, para montar uma dieta personalizada, preciso de mais algumas informações:\n\nPor favor, informe o seu peso (em kg):');
        
        // Aguardar o peso
        userInfo.step = 'peso';  // Definir que agora é a vez de coletar o peso
    }

    // Aguardar o peso e altura
    if (userInfo.step === 'peso' && msg.from.endsWith('@c.us')) {
        userInfo.peso = msg.body;
        await client.sendMessage(msg.from, 'Agora, por favor, informe a sua altura (em metros):');
        userInfo.step = 'altura';  // Agora aguardar a altura
    }

    // Aguardar a altura
    if (userInfo.step === 'altura' && msg.from.endsWith('@c.us')) {
        userInfo.altura = msg.body;
        
        // Confirmar as informações e continuar
        await client.sendMessage(msg.from, `Peso: ${userInfo.peso} kg\nAltura: ${userInfo.altura} m\n\nCom essas informações, podemos prosseguir com seu treino/dieta personalizado!`);

        // Resetar o processo
        userInfo = {};  // Resetar para novos usuários

        // Aqui você pode continuar com a lógica para gerar o treino ou a dieta, com base nas informações coletadas.
    }

    // Opção 4
    if (msg.body === '4' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, 'Você pode aderir aos nossos planos diretamente pelo nosso site ou pelo WhatsApp.\n\nApós a adesão, você terá acesso imediato');
        
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');
    }

    // Opção 5
    if (msg.body === '5' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, 'Se você tiver outras dúvidas ou precisar de mais informações, por favor, fale aqui nesse whatsapp ou visite nosso site: https://site.com');
    }

});