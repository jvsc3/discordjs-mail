const Discord = require('discord.js');
const nodemailer = require('nodemailer');
const client = new Discord.Client();

const EMAIL_ADDRESS = 'your@email.com';
const EMAIL_PASSWORD = 'yourpassword';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD,
  },
});

client.on('message', message => {
  if (message.author.bot || message.channel.type !== 'dm') return;

  const emailMatch = message.content.match(/\S+@\S+\.\S+/);
  if (emailMatch) {
    const email = emailMatch[0];
    const code = Math.random().toString(36).slice(-6);
    
    transporter.sendMail({
      from: EMAIL_ADDRESS,
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}`,
    });

    const filter = m => m.author.id === message.author.id && m.content === code;
    message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
      .then(collected => {
        const role = message.guild.roles.cache.find(r => r.name === 'Verified');
        message.member.roles.add(role);
        message.author.send('You have been verified!');
      })
      .catch(() => {
        message.author.send('Verification timed out. Please try again.');
      });
  }
});

client.login('YOUR_BOT_TOKEN_HERE');
