import { TeamModel } from '../../../../database/teams/teams.model';
const { registerChannel } = require('../../../../../config.json');
import Bot from '../../../..';
import { Message } from 'discord.js';
export default {
  name: 'team',
  aliases: ['myteam'],
  channelID: registerChannel,
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      var team = await TeamModel.findOneByID(message.author.id);
    } catch (err) {
      bot.sendErrorMessage(message, `You are not a member of any team`);
    }
    bot.sendDefaultEmbed(
      message,
      ` Members of your team are: ${team.users
        .map((memberID) => `<@${memberID}>`)
        .join(' ')}`,
    );
  },
};
