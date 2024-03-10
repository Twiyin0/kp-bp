import { Context, Schema, Logger } from 'koishi'

export const name = 'bilianalysis'

const logger = new Logger(name)

export interface Config {
  maxLength: number
}

export const Config: Schema<Config> = Schema.object({
  maxLength: Schema.number().default(100)
  .description('简介文本长度限制')
})

const aidGroupMap: Map<string, Set<string>> = new Map(); // 使用 Map 来记录每个群组已解析的 aid

export function apply(ctx: Context, config: Config) {
  ctx.on('message', async (session) => {
    const VIDEO_REGEX = /(((https?:\/\/)?(www\.|m\.)?bilibili\.com\/(video\/)?)?((av|AV)(\d+)|((BV|bv)1[1-9A-NP-Za-km-z]{9})))/;
    const B23_REGEX = /((https?:\/\/)?(b23\.tv|bili2233\.cn)\/(((av|ep|ss)\d+)|BV1[1-9A-NP-Za-km-z]{9}|\S{6,7}))/;

    const video_hashead = /(https?:\/\/)?(www\.)?bilibili\.com\/video\//;
    const b23_hashead = /(https?:\/\/)?(b23\.tv|bili2233\.cn)/;
    const content = session.content.toString();
    let match: any; // 匹配变量声明在循环外部
    // 匹配视频链接
    let i = 0;
    while ((match = VIDEO_REGEX.exec(content)) !== null || (match = B23_REGEX.exec(content)) !== null) {
      if (!match) {
        break; // 如果匹配失败，退出循环
      }
      const link = match[0];
      const groupID = session.event.channel.id.toString();
      const aidSet = aidGroupMap.get(groupID) || new Set();
      try {
        let data: any = await analysisUrl(link.match(video_hashead)? link:link.match(b23_hashead)? link: link.match(/(((av|ep|ss)\d+)|BV1[1-9A-NP-Za-km-z]{9}|\S{6,7})/)? 'https://b23.tv/'+link:'https://bilibili.com/video/'+link, ctx);
        const aid = data.videoData.aid.toString();
        // 判断在当前群组中是否已解析过该视频的 aid
        if (aidSet.has(aid)) {
          session.send('该链接已被解析……');
          break; // 已解析过，直接进入下一个匹配项的处理
        }
        // 记录当前群组已解析的 aid
        aidSet.add(aid);
        aidGroupMap.set(groupID, aidSet);
        const title = `${data.videoData.title}(av号: ${data.videoData.aid})`;
        const picurl = data.videoData.pic;
        const desc = data.videoData.desc ? (data.videoData.desc.length > config.maxLength ? data.videoData.desc.slice(0, config.maxLength) : data.videoData.desc) : '这个作者很懒，没有写简介';
        await session.send(<>{title}<image url={picurl}/>{desc}</>);
        // 处理完第一个匹配项后退出循环
        break;
      } catch (err) {
        session.send('视频解析发生错误……');
        break; // 跳过axios返回报错就break跳出循环
      }
    }
  })
}

async function analysisUrl(url:string, ctx:Context) {
  const videoDataRegex = /<script>window\.__INITIAL_STATE__=(.*);\(function\(\)\{var s;\(s=document.currentScript\|\|document.scripts\[document.scripts.length-1\]\)\.parentNode\.removeChild\(s\);\}\(\)\);<\/script>/gi;
  return new Promise(async (resolve, reject) => {
      try {
        let res = await ctx.http.axios(url);
        let videoJson = JSON.parse(res.data.toString().match(videoDataRegex)[0].replace('<script>window.__INITIAL_STATE__=','').replace(';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());</script>',''))
        resolve(videoJson);
        // console.log(`[title]${videoJson.videoData.title}(avid: ${videoJson.aid})\n \
        // [picurl]${videoJson.videoData.pic}\n \
        // [desc]${videoJson.videoData.desc}`)
        return videoJson;
      } catch (error) {
        reject(error);
        throw error;
      }
  })
}
