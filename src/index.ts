require('dotenv').config();
import { CronJob, job } from 'cron';
import { Client, Guild, GuildMember, Message, MessageEmbed } from 'discord.js';
import * as db from './database/database';
import loadModules from './discord/init';
const config = require('../config.json');
import { configType, generatedVoiceRooms, teamSearch } from '../types';
import { ITeam } from './database/teams/teams.types';
import cronJob from './leaderboards/cronJob';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
const API = require('call-of-duty-api')({ platform: 'acti' });
class Bot {
  public config: configType;
  public client: Client;
  public db;
  public cache: ITeam[];
  public playingCache: ITeam[];
  public codAPI: any;
  public spreadsheets: GoogleSpreadsheetWorksheet[];
  public cachedMessageUsersLeaderboard: Message;
  public cachedMessageTeamsLeaderboard: Message;
  public cachedInvites: teamSearch[];
  public voiceRooms: generatedVoiceRooms;

  constructor() {
    this.config = config;
    this.client = new Client({
      partials: ['USER', 'MESSAGE', 'CHANNEL', 'REACTION'],
    });
    this.codAPI = API;
    this.db = db;
    this.cache = [];
    this.init();
  }

  private async init() {
    db.connect();
    this.scheduleJobs();
    this.loadBot();
    await this.connectStats();
  }

  public async sendDefaultEmbed(message: Message, content: string) {
    await message.reply(
      new MessageEmbed()
        .setDescription(content)
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.avatarURL()),
    );
  }

  public async sendErrorMessage(message: Message, content: string) {
    await message.reply(
      new MessageEmbed()
        .setDescription(content)
        .setTimestamp()
        .setColor(0xba0416)
        .setAuthor(message.author.tag, message.author.avatarURL()),
    );
  }

  public async getMember(guild: Guild, id: string): Promise<GuildMember> {
    let member: GuildMember = guild.members.cache.get(id);
    if (!member) {
      member = await guild.members.fetch(id);
    }
    return member;
  }

  private async loadBot() {
    await this.client.login(process.env.TOKEN);
    loadModules(this);
  }

  private async connectStats() {
    try {
      await this.codAPI.login(process.env.EMAIL, process.env.PASSWORD);
    } catch (err) {
      console.log(err);
    }
  }

  private scheduleJobs() {
    const jobs: Array<[string, (bot: Bot) => void]> = [
      ['0 */1 * * * *', cronJob],
    ];
    for (const [pattern, func] of jobs) {
      this.scheduleJob(pattern, () => {
        func(this);
      });
    }
  }

  /**
   * scheduleJob is creating a new cron job
   */
  private scheduleJob(pattern: string, callBack: () => void) {
    new CronJob(pattern, callBack).start();
  }
}

export default Bot;
new Bot();
