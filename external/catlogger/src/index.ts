import { Context, Schema, Logger, h } from 'koishi'

export const name = 'catlogger'

const logger = new Logger(name)

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // write your plugin here
  ctx.on('before-send', async (session) => {
    try {
      var date = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}${new Date().getSeconds()}`;
      logger.info(`<${session.platform}> ${date} | 成功将消息(${session.messageId})发送到[${session.event.guild.name}(${session.event.guild.id})]群聊<< ${session.content.replace('<template>','').replaceAll('</template>','')}`);
    } catch (err) {
      logger.error(`在发送消息时发生错误: ${err}`)
    }
  })
  ctx.on('message', async (session) => {
    try {
      var date = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}${new Date().getSeconds()}`;
      logger.info(`<${session.platform}> ${date} | [${session.username}(${session.userId})]在[${session.event.guild.name}(${session.event.guild.id})]中发言(${session.messageId})>> ${session.quote? `[回复消息]\r\n${session.quote.content}\r\n`:''}${session.content.replace('<template>','').replaceAll('</template>','')}`);
    } catch (err) {
      logger.error(`在监听消息时发生错误: ${err}`)
    }
  })
}

