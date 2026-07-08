# Al Brooks 价格行为 · 看图实战测验 + AI 老师

15 道基于 Al Brooks 价格行为体系的看图实战题,用**真实日线数据**出题:每题把后市遮住,你先在 ◇ 那根 K 线上做判断。之后可以两种方式对答案:

- **让 AI 老师批改** —— 填入你自己的 API,AI 按标准答案给你逐项点评 + 打分(像一对一精讲)。
- **揭晓标准答案** —— 直接看数据核对过的解析,自己打分。

**在线体验(揭晓答案 + Claude/OpenAI 的 AI 批改)👉 https://thomas238141-afk.github.io/brooks-price-action-quiz/**

> 想用 DeepSeek / Kimi / 通义 / GLM / 本地 Ollama 等接口批改?这些服务商多数不允许浏览器直连,请按下面「本地运行(推荐)」用 `node server.js` 跑,内置代理支持任意 OpenAI 兼容接口。

## 内容

- **第一部分 · 综合判图(10 题)**:判 状态 / Always-In 方向 / 打法 / 进场(stop 还是 limit)/ 止损。
  覆盖趋势买回调、下跌 M2S 卖、区间 fade 两边、突破回调买、顶/底反转三步、抛物线高潮别追等核心场景。
- **第二部分 · 区间挂单(5 题)**:写全套下单(方向 / limit 挂哪几价 / 止损 / 目标 / 分几批)。
  其中两题是「趋势伪装成区间」的陷阱,专治把区间和趋势读反的毛病。
- 附:十条核心铁律(自用提炼)+ 四步操作流程复习框架。

品种覆盖 EUR(6E)、黄金、美元指数 DXY、KOSPI、美债 10Y 收益率、ES 标普期货、原油、澳元。

## AI 老师:填自己的 API

点右上角 **⚙ 设置 AI 老师**,选服务商、填 Base URL / 密钥 / 模型名,保存即可。支持两类接口:

| 服务商 | 类型 | Base URL | 模型名示例 |
|---|---|---|---|
| Anthropic (Claude) | 原生 | `https://api.anthropic.com` | `claude-opus-4-8` |
| DeepSeek | OpenAI 兼容 | `https://api.deepseek.com/v1` | `deepseek-chat` |
| Moonshot (Kimi) | OpenAI 兼容 | `https://api.moonshot.cn/v1` | `moonshot-v1-8k` |
| 通义千问 Qwen | OpenAI 兼容 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-plus` |
| 智谱 GLM | OpenAI 兼容 | `https://open.bigmodel.cn/api/paas/v4` | `glm-4-plus` |
| OpenAI | OpenAI 兼容 | `https://api.openai.com/v1` | `gpt-5` |
| 本地 Ollama / LM Studio | OpenAI 兼容 | `http://localhost:11434/v1` | 你本地的模型名 |
| 自定义 | OpenAI 兼容 | 任意兼容地址 | 任意 |

**密钥只存在你本机浏览器的 localStorage,不上传任何第三方服务器**(除你选择的那家服务商本身)。

## 本地运行(推荐,支持所有服务商)

需要 Node.js(建议 18+)。下载/克隆本项目后:

```bash
node server.js
# 然后浏览器打开 http://localhost:8137
```

`server.js` 同时做两件事:①托管网页;②提供一个本机代理转发你的 AI 请求——这样即使服务商不允许浏览器直连(CORS),也能正常批改。代理只在你本机运行,不改写、不留存你的密钥。

也可只当静态页用(仅 Claude/OpenAI 等允许直连的服务商能批改):直接双击 `index.html`,或 `npx serve .`。

## 数据来源与免责声明

- 图表为公开行情 API 的真实日线数据,仅供学习复盘。
- 方法论基于 Al Brooks 的价格行为体系;题目、图表标注与解析为个人学习整理,非原书内容转载。
- AI 批改由**你自己的 API** 完成,本项目不代管密钥、不提供模型。
- **本项目不构成任何投资建议。** 交易有风险,盈亏自负。

## 致谢

方法论来自 Al Brooks《Reading Price Charts Bar by Bar》(中译《日本蜡烛图交易技术分析》)。强烈建议阅读原书。
