import { Context, Schema, Logger, Random } from 'koishi'
import { pathToFileURL } from 'url'
import { resolve } from 'path'

export const name = 'menu'

const logger = new Logger(name);

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

// 表情包资源根目录
let baseImgurl = 'https://upyun.iin0.cn/bella/';
const baseUrl = 'https://upyun.iin0.cn/bella/';
// let audioUrlBase = 'https://upyun.iin0.cn/bella/mp3/';

export function apply(ctx: Context) {
  // write your plugin here
  ctx.command('menu', "List the command menu.").alias("菜单")
  .shortcut(/^(\/\s*|\s*)menu\s*/gi)
  .action(({session}) => {
      return <>
      贝拉bot可用指令列表: &#10;
          Command     Description&#10;
          menu       查看命令菜单&#10;
          bella      贝拉签到指令&#10;
          jrys       查看今日运势&#10;
          inspect    查看自己的信息&#10;
          img        随机一图&#10;
          自检       查看服务器状态Pro&#10;
          猫猫       随机发送一张猫猫图&#10;
          今天吃什么&#10;
          今天喝什么&#10;
          贝拉      召唤贝拉（仅频道）&#10;
          晚安      晚安哦召唤贝拉（仅频道）&#10;
          老婆      谁是你老婆！召唤贝拉（仅频道）
          </>
  })

  // 一图
  ctx.command('img', "随机发送一张图片").alias("一图")
  .action(async ({session}) => {
    return <image url="https://img.iin0.cn/pubimg" />
  })

  // 猫猫
  ctx.command('neko', "随机发送一张猫猫图片").alias("猫猫")
  .action(async ({session}) => {
    session.sendQueued("摸凹猫~", 1500);
    session.sendQueued(<image url="https://api.iin0.cn/img/neko.php"/>);
  })


  ctx.on("message", async (session) => {
    if (session.content === '贝拉') {
      session.send(bellaRdm());
    }
    if (session.content.includes('晚安') || session.content === '欧亚斯密') {
      session.send(<random>
        <><at id={session.userId}/>{'\n'+wanRdm().txt}<image url={wanRdm().imgurl} /></>
        {/* <>晚~安~~<image url={baseImgurl+"-63b5a14d84d58978.jpg"}/></> */}
        <>打扮扮~睡觉觉~<image url={baseImgurl+"-205673fa1ec32a2.gif"}/></>
        </random>);
    }
    if (session.content==='你好') session.send('嗯，我好');
    if (session.content === '老婆' || (session.content.includes('贝拉') && session.content.includes('老婆')) || session.content === '老婆~' || session.content === '老婆!' || session.content === '老婆！' || session.content === '老婆?' || session.content === '老婆？') {
      session.send(lpRdm());
    }
  })
}

function bellaRdm() {
  var cnt = randomNum(1,233)%12;
  var txtarr = ['怎么了嘛','应召而来','叫贝拉什么事啦','嗯嗯，好，知道了','啊！？','你干嘛~哎哟~','贝拉不在','麻麻生的','好啦好啦，不要再叫啦'];
  var imgarr = ['-1fad13026497291d.jpg','-4d1f6de7eb64ec06.jpg','-5c0b7575e1db2ae5.jpg','-6da24123689ca9b7.jpg',
  '-7826353a22e1ca44.jpg','7c06323573c03d0b.jpg','-4aba7388ceba67c3.jpg','-5a045587fc2adaf2.jpg','QQ%E5%9B%BE%E7%89%8720230414130134.jpg',
  'QQ%E5%9B%BE%E7%89%8720230414130154.jpg','QQ%E5%9B%BE%E7%89%8720230414130228.jpg','QQ%E5%9B%BE%E7%89%8720210920225332.jpg'];
  var subrdm = Math.floor((Math.random()*imgarr.length));
  var subrdm2 = Math.floor((Math.random()*txtarr.length));
  switch(cnt) {
    case 1: return  <>
      在下贝拉，阁下吃了嘛，没吃吃我一拳！！
      <image url={baseImgurl+"1672677378122(1).jpg"} />
      </>;
      break;
    case 2: return  <>
      <image url={baseImgurl+"34a4284443a9822653b1bfe4cf82b9014b90eb60.jpg"} />
      </>;
      break;
    case 3: return  <>
      你把我召唤出来了, 要v我50才能回去!
      <image url={baseImgurl+"1672677367060.png"} />
      </>;
      break;
    case 4: return  <>
      嗨~是想我了么w
      <image url={baseImgurl+"36500a1b36b5eaf0edca53f3078088cba372e565.jpg"} />
      </>;
      break;
    case 5: return  <>
      是有什么事嘛
      <image url={baseImgurl+'4e76128258b9f4cad44531b2ee2cffc5fadff6b0.jpg'} />
      </>;
      break;
    case 6: return  <>
      美好的一天，要从美妙的邂逅开始~
      <image url={baseImgurl+'4f37cc50a217fa04.jpg'} />
      </>;
      break;
    default:  return <>
      {txtarr[subrdm2]}
      <image url={(baseUrl+imgarr[subrdm])} />
      </>
      break;
  }
}

function randomNum(minNum,maxNum) { 
  switch(arguments.length){ 
      case 1: 
          return Math.floor(Number(Math.random()*minNum+1)); 
      break; 
      case 2: 
          return Math.floor(Number(Math.random()*(maxNum-minNum+1)+minNum)); 
      break; 
          default: 
              return 0; 
          break; 
  }
}

function wanRdm() {
  var rdata = {txt: 'String',imgurl: 'String'}
  var txtarr = ['晚安哦','一起睡觉觉~','快睡觉觉啦~','晚安~','晚安安~'];
  var txtardm = Math.floor((Math.random()*txtarr.length));
  var rslt = ['-2550caef3f27792f.jpg','-5148d3074c517a8d.jpg','2e28fdeb0fc2796a.jpg','-cc39ae6ac099f09.jpg','6dea8c551aad32a4.jpg','632696ab894d5e61.gif','1672677355066.png'];
  var rsltrdm = Math.floor((Math.random()*rslt.length));
  rdata.imgurl = baseUrl+rslt[rsltrdm];
  rdata.txt = txtarr[txtardm];
  return rdata;
}

function lpRdm() {
  var mediaUrl = 'https://upyun.twiyin0.cn/bella/mp3/';
  var cnt = randomNum(1,233)%11;
  switch(cnt) {
    case 1: return  <>
      <image url={baseImgurl+"-2a7d27ee401a0027.jpg"} />
      </>;
      break;
    case 2: return  <>
      <image url={baseImgurl+"-2e240708f9260f08.jpg"} />
      </>;
      break;
    case 3: return  <>
      <image url={baseImgurl+"-5f067349ef15d73a.jpg"} />
      </>;
      break;
    case 4: return  <>
      <image url={baseImgurl+"-6da24123689ca9b7.jpg"} />
      </>;
      break;
    case 5: return  <>
      <image url={baseImgurl+"-33f06a0374b702.jpg"} />
      </>;
      break;
    case 6: return  <>
      <image url={baseImgurl+"-75c9290aae88b9f7.jpg"} />
      </>;
      break;
    case 7:
      break;
    default: return  <>
      <image url={baseImgurl+"-337681a405cbe9f4.jpg"} />
      </>;
      break;
  }
}
