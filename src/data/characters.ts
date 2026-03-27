import { Character } from '../types';

// 角色数据
// 添加新角色时，复制一个角色对象并修改各字段即可
export const characters: Character[] = [
  {
    id: 'finney',
    name: '芬妮',
    // 基本资料
    height: '166cm',
    birthday: '7月30日',
    measurements: { bust: 77.24, waist: 48.77, hip: 83.11 },
    color: 'rgb(250, 209, 126)',
    // 图片
    avatar: '/images/avatars/finney.png',
    cover: '/images/covers/finney.png',
    reference: '/images/refs/finney.png',
    // 描述
    outfit: '常穿白色连衣裙，搭配淡蓝色披肩。战斗时换上轻便的骑士甲胄，以银色为主调，点缀着蓝色宝石。',
    personality: '开朗活泼，总是充满活力的少女。对朋友真诚热情，面对困难从不退缩。有时候会有些冒失，但关键时刻非常可靠。对分析员有着特别的信任和依赖。',
    speakingStyle: '语气轻快活泼，喜欢用「呐」「哇」「诶嘿嘿」等语气词。说话直接不拐弯抹角，偶尔会有些小傲娇。对分析员说话时会更加亲昵。',
    // 特有道具
    items: [
      {
        id: 'finney-pendant',
        name: '星光吊坠',
        description: '芬妮珍藏的吊坠，据说是家族传承的宝物。在黑暗中会散发微弱的光芒，据说能够指引迷途之人。',
        icon: '✨'
      }
    ],
    // 表情差分
    expressions: [
      { name: '开心', file: 'finney-happy.png' },
      { name: '疑惑', file: 'finney-confused.png' },
      { name: '害羞', file: 'finney-shy.png' },
      { name: '惊讶', file: 'finney-surprised.png' },
      { name: '生气', file: 'finney-angry.png' },
      { name: '难过', file: 'finney-sad.png' },
      { name: '认真', file: 'finney-serious.png' },
      { name: '得意', file: 'finney-proud.png' },
      { name: '困惑', file: 'finney-puzzled.png' },
      { name: '期待', file: 'finney-excited.png' },
    ],
  },
  {
    id: 'liv',
    name: '里芙',
    // 基本资料
    height: '170cm',
    birthday: '3月21日',
    measurements: { bust: 84, waist: 56, hip: 85 },
    color: 'rgb(181, 184, 201)',
    // 图片
    avatar: '/images/avatars/liv.png',
    cover: '/images/covers/liv.png',
    reference: '/images/refs/liv.png',
    // 描述
    outfit: '平时穿着简约的白色衬衫和黑色长裙，戴着一副无框眼镜。在公会工作时会穿上带有公会徽章的深蓝色制服外套。',
    personality: '沉稳冷静，做事有条理。表面上看起来有些高冷，但内心其实很温柔，会默默关心身边的人。对待工作认真负责，是大家可以信赖的存在。对分析员有着隐藏的好感。',
    speakingStyle: '说话温和有礼，语速适中，用词准确。偶尔会露出一丝温柔的微笑。不太会表达情感，有时候会用敬语来掩饰自己的害羞。',
    // 特有道具
    items: [
      {
        id: 'liv-glasses',
        name: '智慧之眼',
        description: '里芙佩戴的眼镜，实际上具有分析魔力流动的能力。可以识别伪装和幻术，是她作为管理员的重要工具。',
        icon: '👓'
      },
      {
        id: 'liv-notebook',
        name: '公会记事本',
        description: '里芙随身携带的笔记本，记录着公会的各种信息和任务详情。据说里面也有一些私人日记...',
        icon: '📔'
      }
    ],
    // 表情差分
    expressions: [
      { name: '微笑', file: 'liv-smile.png' },
      { name: '害羞', file: 'liv-shy.png' },
      { name: '认真', file: 'liv-serious.png' },
      { name: '惊讶', file: 'liv-surprised.png' },
      { name: '困惑', file: 'liv-confused.png' },
      { name: '开心', file: 'liv-happy.png' },
      { name: '担忧', file: 'liv-worried.png' },
      { name: '无奈', file: 'liv-helpless.png' },
      { name: '思考', file: 'liv-thinking.png' },
      { name: '温柔', file: 'liv-gentle.png' },
    ],
  },
  {
    id: 'chenxing',
    name: '晨星',
    // 基本资料
    height: '160cm',
    birthday: '12月24日',
    measurements: { bust: 80, waist: 55, hip: 82 },
    color: 'rgb(244, 236, 249)',
    // 图片
    avatar: '/images/avatars/chenxing.png',
    cover: '/images/covers/chenxing.png',
    reference: '/images/refs/chenxing.png',
    // 描述
    outfit: '穿着神秘的黑色斗篷，内里是星空图案的连衣裙。手上戴着能够聚集魔力的银色手环，耳朵上挂着月牙形状的耳坠。',
    personality: '神秘而安静，有着超越年龄的成熟气质。对星象和命运有着深刻的理解，说话常常带有预言的意味。表面冷淡但内心渴望温暖，对分析员有着特别的命运羁绊。',
    speakingStyle: '说话简洁，语调平稳，偶尔会说出意味深长的话语。喜欢用「...」表示停顿和思考。对分析员说话时会比对别人多一些话语。',
    // 特有道具
    items: [
      {
        id: 'chenxing-crystal',
        name: '命运水晶球',
        description: '晨星用于占卜的水晶球，据说可以看到命运的片段。但预言往往以谜语形式呈现，需要智慧才能解读。',
        icon: '🔮'
      }
    ],
    // 表情差分
    expressions: [
      { name: '平静', file: 'chenxing-calm.png' },
      { name: '微笑', file: 'chenxing-smile.png' },
      { name: '惊讶', file: 'chenxing-surprised.png' },
      { name: '好奇', file: 'chenxing-curious.png' },
      { name: '神秘', file: 'chenxing-mysterious.png' },
      { name: '担忧', file: 'chenxing-worried.png' },
      { name: '认真', file: 'chenxing-serious.png' },
      { name: '害羞', file: 'chenxing-shy.png' },
      { name: '开心', file: 'chenxing-happy.png' },
      { name: '悲伤', file: 'chenxing-sad.png' },
    ],
  },
];

// 根据ID获取角色
export const getCharacterById = (id: string): Character | undefined => {
  return characters.find(c => c.id === id);
};

// 获取所有角色ID
export const getAllCharacterIds = (): string[] => {
  return characters.map(c => c.id);
};
