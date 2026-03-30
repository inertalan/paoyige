const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key, anthropic-version",
};

const INDEX_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Paoyige 💥</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
:root {
  --bg: #FAF8F4;
  --surface: #FFFFFF;
  --border: #E8E4DC;
  --text: #2D2D2D;
  --text-dim: #9A9490;
  --accent: #6C63FF;
  --accent2: #FF6584;
  --gold: #F0A500;
  --shadow: 0 2px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.14);
}
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

/* ── Left toolbar ── */
.left-bar {
  width: 220px;
  min-width: 220px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  box-shadow: 2px 0 12px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  z-index: 10;
  overflow: hidden;
}
.left-bar-header {
  padding: 18px 16px 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
}
.left-bar-header h1 { font-size: 16px; font-weight: 700; }
.left-bar-header .emoji { font-size: 20px; }

.input-section {
  padding: 14px 12px;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-section input {
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  outline: none;
  transition: border-color 0.2s;
}
.input-section input:focus { border-color: var(--accent); }
.input-section input::placeholder { color: var(--text-dim); }

.btn-row { display: flex; gap: 6px; }
.btn-primary {
  flex: 1;
  background: var(--accent);
  border: none;
  border-radius: 10px;
  color: #fff;
  padding: 8px 10px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s, transform 0.1s;
}
.btn-primary:hover { opacity: 0.88; }
.btn-primary:active { transform: scale(0.97); }
.btn-secondary {
  background: transparent;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  color: var(--text-dim);
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-secondary:hover { border-color: var(--accent2); color: var(--accent2); }

.step-info {
  padding: 10px 14px;
  font-size: 11px;
  color: var(--text-dim);
  border-bottom: 1px solid var(--border);
}
.step-info b { color: var(--accent); }

/* ── Favorites ── */
.fav-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
.fav-header {
  padding: 12px 14px 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  gap: 6px;
}
.fav-count {
  background: var(--accent);
  color: #fff;
  border-radius: 20px;
  font-size: 10px;
  padding: 1px 7px;
  margin-left: auto;
}
.fav-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-content: flex-start;
}
.fav-chip {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 5px;
  animation: popIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
.fav-chip .rm { cursor: pointer; color: var(--text-dim); font-size: 10px; }
.fav-chip .rm:hover { color: var(--accent2); }

.left-bar-footer { padding: 10px; border-top: 1px solid var(--border); }
.btn-mindmap {
  width: 100%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  border: none;
  border-radius: 10px;
  color: #fff;
  padding: 9px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-mindmap:hover { opacity: 0.88; }
.btn-mindmap:disabled { opacity: 0.3; cursor: not-allowed; }

/* ── Canvas area ── */
.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}
#nodeCanvas {
  position: absolute;
  inset: 0;
  cursor: default;
}
.empty-hint {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-dim);
  pointer-events: none;
}
.empty-hint .big { font-size: 52px; }
.empty-hint p { font-size: 13px; }

/* ── Right sidebar (收藏夹已移到左边，这里留给未来扩展) ── */

/* ── Popup menu — fixed inside left-bar ── */
.popup-menu {
  display: none;
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 12px;
  z-index: 50;
  animation: popIn 0.18s cubic-bezier(0.34,1.56,0.64,1);
}
.popup-menu.show { display: block; }
.popup-title {
  font-size: 11px;
  color: var(--text-dim);
  margin-bottom: 8px;
  font-weight: 500;
}
.dim-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}
.dim-tag {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 4px 11px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text);
}
.dim-tag:hover { border-color: var(--accent); color: var(--accent); background: #f0eeff; }
.dim-tag.egg-tag { border-color: var(--gold); color: var(--gold); background: #fffbf0; }
.dim-tag.egg-tag:hover { background: #fff3cc; }
.popup-actions {
  display: flex;
  gap: 6px;
  border-top: 1px solid var(--border);
  padding-top: 9px;
}
.popup-btn {
  flex: 1;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text-dim);
}
.popup-btn:hover { border-color: var(--accent); color: var(--accent); }
.popup-btn.starred { border-color: var(--gold); color: var(--gold); background: #fffbf0; }

/* ── Modal ── */
.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 100;
  align-items: center;
  justify-content: center;
}
.modal-overlay.show { display: flex; }
.modal-box {
  background: var(--surface);
  border-radius: 18px;
  padding: 24px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: var(--shadow-lg);
}
.modal-header { display: flex; align-items: center; gap: 12px; }
.modal-header h2 { font-size: 16px; }
.modal-close {
  margin-left: auto;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-dim);
  padding: 5px 12px;
  cursor: pointer;
  font-size: 12px;
}
.modal-close:hover { border-color: var(--accent2); color: var(--accent2); }
#mindmapCanvas { border-radius: 12px; border: 1px solid var(--border); display: block; }

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

@keyframes popIn {
  0% { opacity:0; transform:scale(0.85); }
  100% { opacity:1; transform:scale(1); }
}
</style>
</head>
<body>

<!-- Left toolbar -->
<div class="left-bar">
  <div class="left-bar-header">
    <span class="emoji">💥</span>
    <h1>Paoyige</h1>
  </div>
  <div class="input-section">
    <input type="text" id="seedInput" placeholder="输入关键词，比如「自由」" maxlength="20" />
    <div class="btn-row">
      <button class="btn-primary" onclick="startGame()">抛一个 💥</button>
      <button class="btn-secondary" onclick="resetGame()">重置</button>
    </div>
  </div>
  <div class="step-info">探索步数：<b id="stepCount">0</b> &nbsp;·&nbsp; 探索 3 步解锁 ✨彩蛋</div>
  <div class="input-section" style="border-top:none;padding-top:0;gap:6px">
    <input type="password" id="kimiKeyInput" placeholder="Kimi API Key（sk-xxx）" style="font-size:12px"
      oninput="AI_CONFIG.kimiKey=this.value; updateAiStatus()"
    />
    <input type="password" id="claudeKeyInput" placeholder="Claude API Key（sk-ant-xxx）" style="font-size:12px"
      oninput="AI_CONFIG.claudeKey=this.value; updateAiStatus()"
    />
    <div id="aiStatus" style="font-size:10px;color:var(--text-dim);padding:0 2px">填入任意 Key 启用 AI 发散 ✨</div>
  </div>

  <!-- Dim picker — fixed in left bar -->
  <div class="popup-menu" id="popupMenu">
    <div class="popup-title" id="popupTitle">点击节点选择发散维度</div>
    <div class="dim-grid" id="dimGrid"></div>
    <div class="popup-actions">
      <button class="popup-btn" id="popupStar" onclick="toggleFavCurrent()">⭐ 收藏</button>
      <button class="popup-btn" id="popupDelete" onclick="deleteCurrentNode()" style="border-color:#ffcdd2;color:#e53935">🗑 删除</button>
      <button class="popup-btn" onclick="closePopup()">关闭</button>
    </div>
  </div>

  <div class="fav-section">
    <div class="fav-header">⭐ 收藏夹 <span class="fav-count" id="favCount">0</span></div>
    <div class="fav-list" id="favList"></div>
  </div>
  <div class="left-bar-footer">
    <button class="btn-mindmap" id="btnMindmap" disabled onclick="showMindmap()">✨ 生成创意地图</button>
  </div>
</div>

<!-- Canvas -->
<div class="canvas-container" id="canvasContainer">
  <canvas id="nodeCanvas"></canvas>
  <div class="empty-hint" id="emptyHint">
    <div class="big">🧠</div>
    <p>输入一个词，来，抛一个 💥</p>
  </div>
</div>

<!-- Modal -->
<div class="modal-overlay" id="modalOverlay" onclick="closeModal(event)">
  <div class="modal-box">
    <div class="modal-header">
      <h2>✨ 我的创意地图</h2>
      <button class="modal-close" onclick="closeModalDirect()">关闭</button>
    </div>
    <canvas id="mindmapCanvas"></canvas>
  </div>
</div>

<script>
// ── AI Config ────────────────────────────────────────────────────────────────
const AI_CONFIG = {
  kimiKey: '',
  claudeKey: '',
  proxyURL: '/api/proxy',
  get activeProvider(){
    if(this.claudeKey) return 'claude';
    if(this.kimiKey) return 'kimi';
    return '';
  },
};

function setAiStatus(msg, color='var(--text-dim)'){
  const el=document.getElementById('aiStatus');
  if(el){ el.textContent=msg; el.style.color=color; }
}
function updateAiStatus(){
  const p=AI_CONFIG.activeProvider;
  if(p==='claude') setAiStatus('✅ 使用 Claude 发散', '#6C63FF');
  else if(p==='kimi') setAiStatus('✅ 使用 Kimi 发散', '#16A34A');
  else setAiStatus('填入任意 Key 启用 AI 发散 ✨', 'var(--text-dim)');
}

async function aiExpand(word, dimId, dimLabel, exclude=[]) {
  if (!AI_CONFIG.activeProvider) {
    setAiStatus('未填入 Key，使用本地词库', 'var(--text-dim)');
    return null;
  }

  const dimPrompts = {
    syn:   '近义词或同义表达（口语/书面均可）',
    ant:   '反义词或对立概念',
    slang: '口语化、接地气的说法或俗称',
    meme:  '相关的网络梗、流行语或当下热词',
    idiom: '相关的俗语、成语或民间说法',
    emo:   '这个词让人联想到的情绪感受或心理状态',
    scene: '这个词会出现在哪些具体生活场景里',
    brand: '哪些品牌或产品在传递这个词的感觉',
    vis:   '这个词让人联想到的具体视觉画面或意象',
    egg:   '把这个词和一个完全意想不到的概念组合，产生创意张力',
  };

  const prompt = \`你是一个广告创意人，正在做词语联想发散练习。
关键词：「\${word}」
发散方向：\${dimLabel}（\${dimPrompts[dimId] || dimLabel}）
\${exclude.length ? \`已有词（不要重复）：\${exclude.join('、')}\` : ''}

请给出 3 个发散词，要求：
- 简短有力，每个词不超过 8 个字
- 有创意，不要太平淡
- 直接返回 3 个词，用逗号分隔，不要编号，不要解释

例如格式：词语一,词语二,词语三\`;

  setAiStatus('🤖 AI 生成中…', '#F0A500');
  try {
    let text = '';
    let tokenUsed = '?';

    if(AI_CONFIG.activeProvider === 'claude') {
      const res = await fetch(\`\${AI_CONFIG.proxyURL}?target=claude\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_CONFIG.claudeKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 100,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(\`Claude API error \${res.status}\`);
      const data = await res.json();
      text = data.content?.[0]?.text?.trim() || '';
      tokenUsed = (data.usage?.input_tokens||0) + (data.usage?.output_tokens||0);

    } else {
      const res = await fetch(\`\${AI_CONFIG.proxyURL}?target=kimi\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${AI_CONFIG.kimiKey}\`,
        },
        body: JSON.stringify({
          model: 'moonshot-v1-8k',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.9,
          max_tokens: 100,
        }),
      });
      if (!res.ok) throw new Error(\`Kimi API error \${res.status}\`);
      const data = await res.json();
      text = data.choices?.[0]?.message?.content?.trim() || '';
      tokenUsed = data.usage?.total_tokens || '?';
    }

    const words = text.split(/[,，]/).map(w => w.trim()).filter(w => w && w.length <= 12);
    if (words.length >= 2) {
      const provider = AI_CONFIG.activeProvider === 'claude' ? 'Claude' : 'Kimi';
      setAiStatus(\`✅ \${provider} 完成 · \${tokenUsed} tokens\`, '#16A34A');
      return words.slice(0, 3);
    }
  } catch(e) {
    console.warn('AI 请求失败，使用本地词库', e);
    setAiStatus('⚠️ AI 失败，使用本地词库', '#FF4D4D');
  }
  return null;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const DIMS = [
  { id:'syn',   label:'🔵 近义词', color:'#EEF2FF', stroke:'#6C63FF', egg:false },
  { id:'ant',   label:'🔴 反义词', color:'#FFF0F0', stroke:'#FF4D4D', egg:false },
  { id:'slang', label:'🟡 口语化', color:'#FFFBEB', stroke:'#D97706', egg:false },
  { id:'meme',  label:'⚡ 网络梗', color:'#F0FFF4', stroke:'#16A34A', egg:false },
  { id:'idiom', label:'🟢 俗语',   color:'#F0FDF4', stroke:'#15803D', egg:false },
  { id:'emo',   label:'🟣 情绪化', color:'#FAF0FF', stroke:'#9333EA', egg:false },
  { id:'scene', label:'🟠 场景化', color:'#FFF7F0', stroke:'#EA580C', egg:false },
  { id:'brand', label:'⚪ 品牌化', color:'#F8F8F8', stroke:'#6B7280', egg:false },
  { id:'vis',   label:'🎨 视觉化', color:'#FFF0F8', stroke:'#DB2777', egg:false },
  { id:'egg',   label:'✨ 彩蛋',   color:'#FFFBEB', stroke:'#F0A500', egg:true  },
];

const WORD_DB = {
  '自由':{ syn:['解放','自在','无拘束','随心所欲','洒脱'], ant:['束缚','囚禁','规则','枷锁','控制'], slang:['想咋整就咋整','随便啦','我的地盘我做主','爱咋咋地'], meme:['躺平','不想上班','YOLO','人间清醒','摆烂'], idiom:['天高任鸟飞','海阔凭鱼跃','无法无天','逍遥自在'], emo:['轻盈感','开阔','释然','畅快','无负担'], scene:['草原','无人的沙滩','深夜驾车','摘掉口罩的瞬间'], brand:['Apple','哈雷摩托','Levis','无印良品'], vis:['展翅的鹰','空旷的公路','断开的锁链','漂浮的气球'], egg:['自由×螺丝钉','自由×996','自由×算法','解放×上瘾'] },
  '青春':{ syn:['年轻','青涩','少年','朝气','热血'], ant:['衰老','成熟','沧桑','世故','暮气'], slang:['这波操作666','整挺好','这不就是我吗','绝了'], meme:['00后整顿职场','凭什么','青春没有售价','反正我不信'], idiom:['风华正茂','朝气蓬勃','少壮不努力','青出于蓝'], emo:['冲劲','羞涩','无所畏惧','心跳加速','遗憾'], scene:['高中操场','第一次恋爱','毕业典礼','暑假的便利店'], brand:['Nike','可口可乐','VANS','bilibili'], vis:['奔跑的剪影','绿色操场','泛黄的照片','满天星星'], egg:['青春×中年危机','青涩×AI换脸','热血×房贷'] },
  '孤独':{ syn:['寂寞','独处','落单','一个人','疏离'], ant:['热闹','陪伴','归属','人群','连接'], slang:['一个人吃饭真好','孤独患者','社恐本恐','搭子呢'], meme:['单身狗','独居生活','INFJ','高敏感人群','你懂我'], idiom:['形单影只','孤芳自赏','茕茕孑立','一枝独秀'], emo:['空洞感','宁静','自我消化','渴望被理解','沉浸'], scene:['深夜的拉面馆','一个人的电影院','回家路上的耳机','雨天的窗边'], brand:['MUJI','Kindle','网易云音乐','宜家'], vis:['城市里的单人影子','空旷的长廊','手机屏幕的光','一盏台灯'], egg:['孤独×直播带货','寂寞×算法推送','独处×元宇宙'] },
};

function getDimById(id){ return DIMS.find(d=>d.id===id); }
function getFallback(word,dimId){
  const f={ syn:[\`\${word}的同类\`,\`相似的\${word}\`,\`另一种\${word}\`], ant:[\`非\${word}\`,\`反\${word}\`,\`去\${word}化\`], slang:[\`\${word}ing\`,\`太\${word}了\`,\`\${word}到飞起\`], meme:[\`\${word}人知道\`,\`这不就是\${word}吗\`,\`\${word} but fashion\`], idiom:[\`\${word}如风\`,\`一\${word}当先\`,\`\${word}行天下\`], emo:[\`\${word}感\`,\`\${word}式焦虑\`,\`\${word}的温度\`], scene:[\`\${word}出现在深夜\`,\`\${word}里的人\`,\`关于\${word}的地方\`], brand:[\`\${word}感品牌\`,\`品牌×\${word}\`,\`\${word}营销案例\`], vis:[\`\${word}的颜色\`,\`\${word}的形状\`,\`\${word}的光影\`], egg:[\`\${word}×反差\`,\`\${word}×意外\`,\`\${word}×黑洞\`] };
  return f[dimId]||[\`\${word}变体1\`,\`\${word}变体2\`,\`\${word}变体3\`];
}
function getWords(word,dimId,exclude=[]){
  const db=WORD_DB[word];
  let pool=db?(db[dimId]||getFallback(word,dimId)):getFallback(word,dimId);
  const avail=pool.filter(w=>!exclude.includes(w));
  const src=avail.length>=3?avail:pool;
  return [...src].sort(()=>Math.random()-0.5).slice(0,3);
}

// ── State ─────────────────────────────────────────────────────────────────────
let nodes=[], edges=[], nodeIdCounter=0, stepCount=0, favorites=[];
let canvas, ctx, container;
let dpr=1;
let dragging=null, dragOffX=0, dragOffY=0, dragMoved=false;
let hoveredNode=null, selectedNode=null;
let currentPopupNode=null;

function newId(){ return ++nodeIdCounter; }

function cw(){ return canvas.width/dpr; }
function ch(){ return canvas.height/dpr; }

// ── Collision resolution ───────────────────────────────────────────────────────
const MIN_DIST = 80; // minimum center-to-center distance

function resolveCollisions(newNode, iterations=8){
  for(let iter=0;iter<iterations;iter++){
    let moved=false;
    for(const n of nodes){
      if(n.id===newNode.id) continue;
      const dx=newNode.x-n.x, dy=newNode.y-n.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const minD=newNode.r+n.r+14;
      if(dist<minD && dist>0.01){
        const overlap=(minD-dist)/2;
        const nx=dx/dist, ny=dy/dist;
        newNode.x+=nx*overlap;
        newNode.y+=ny*overlap;
        // also push other node slightly
        n.x-=nx*overlap*0.4;
        n.y-=ny*overlap*0.4;
        moved=true;
      }
    }
    // Clamp to canvas
    newNode.x=Math.max(newNode.r+8, Math.min(cw()-newNode.r-8, newNode.x));
    newNode.y=Math.max(newNode.r+8, Math.min(ch()-newNode.r-8, newNode.y));
    if(!moved) break;
  }
}

function addNode(word, dimId, dimLabel, parentId, tx, ty){
  const dim=getDimById(dimId)||{color:'#F5F5F5',stroke:'#999'};
  const n={
    id:newId(), word, dimId, dimLabel, parentId,
    x:tx, y:ty,
    r: parentId===null ? 44 : 34,
    color: parentId===null ? '#EEF2FF' : dim.color,
    stroke: parentId===null ? '#6C63FF' : dim.stroke,
    expanded:false,
    lastWords:[],
  };
  // Clamp initial position
  n.x=Math.max(n.r+8, Math.min(cw()-n.r-8, n.x));
  n.y=Math.max(n.r+8, Math.min(ch()-n.r-8, n.y));
  nodes.push(n);
  // Resolve collisions
  resolveCollisions(n);
  if(parentId!==null) edges.push({from:parentId, to:n.id});
  return n;
}

function getNode(id){ return nodes.find(n=>n.id===id); }

// ── Canvas ────────────────────────────────────────────────────────────────────
function initCanvas(){
  canvas=document.getElementById('nodeCanvas');
  ctx=canvas.getContext('2d');
  container=document.getElementById('canvasContainer');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('click', onCanvasClick);
}

function resizeCanvas(){
  dpr=window.devicePixelRatio||1;
  const rect=container.getBoundingClientRect();
  canvas.width=rect.width*dpr;
  canvas.height=rect.height*dpr;
  canvas.style.width=rect.width+'px';
  canvas.style.height=rect.height+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  render();
}

// ── Render ────────────────────────────────────────────────────────────────────
function render(){
  ctx.clearRect(0,0,cw(),ch());

  // Edges
  edges.forEach(e=>{
    const f=getNode(e.from), t=getNode(e.to);
    if(!f||!t) return;
    ctx.beginPath();
    const mx=(f.x+t.x)/2, my=(f.y+t.y)/2;
    // Slight curve
    ctx.moveTo(f.x,f.y);
    ctx.quadraticCurveTo(mx+(my-f.y)*0.15, my-(mx-f.x)*0.15, t.x, t.y);
    ctx.strokeStyle='#D8D4CC';
    ctx.lineWidth=1.5;
    ctx.setLineDash([]);
    ctx.stroke();
  });

  // Nodes
  nodes.forEach(n=>{
    const isHover=hoveredNode===n.id;
    const isSelected=selectedNode===n.id;
    const r=isHover?n.r+4:n.r;

    ctx.save();
    ctx.shadowColor='rgba(0,0,0,0.10)';
    ctx.shadowBlur=isHover?20:10;
    ctx.shadowOffsetY=3;

    ctx.beginPath();
    ctx.arc(n.x,n.y,r,0,Math.PI*2);
    ctx.fillStyle=n.color;
    ctx.fill();
    ctx.strokeStyle=isSelected?'#6C63FF':n.stroke;
    ctx.lineWidth=isSelected?2.5:1.5;
    ctx.stroke();
    ctx.restore();

    // Loading pulse
    if(n.isLoading){
      const pulse = 0.6 + 0.4*Math.sin(Date.now()/300 + n.id);
      ctx.globalAlpha = pulse;
      if(!rafId) requestAnimationFrame(()=>{ render(); });
    }

    // Text
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = n.isLoading ? '#AAAAAA' : '#2D2D2D';
    const fs=n.parentId===null?14:12;
    ctx.font=\`\${n.parentId===null?'700':'600'} \${fs}px 'PingFang SC',sans-serif\`;
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    const maxW=r*1.55;
    const words=splitText(ctx, n.word, maxW);
    if(words.length===1){
      ctx.fillText(words[0],n.x,n.y);
    } else {
      const lineH=fs+2;
      words.forEach((line,i)=>ctx.fillText(line,n.x,n.y+(i-(words.length-1)/2)*lineH));
    }
    ctx.restore();

    // Star badge
    if(favorites.find(f=>f.word===n.word)){
      ctx.font='10px serif';
      ctx.fillText('⭐',n.x+r*0.62,n.y-r*0.62);
    }
  });
}

function splitText(ctx, text, maxW){
  if(ctx.measureText(text).width<=maxW) return [text];
  // Try to split at a natural midpoint
  const mid=Math.ceil(text.length/2);
  return [text.slice(0,mid), text.slice(mid)];
}

// ── Mouse ─────────────────────────────────────────────────────────────────────
function getPos(e){
  const rect=canvas.getBoundingClientRect();
  return {x:e.clientX-rect.left, y:e.clientY-rect.top};
}
function hitTest(x,y){
  for(let i=nodes.length-1;i>=0;i--){
    const n=nodes[i];
    const dx=x-n.x,dy=y-n.y;
    if(dx*dx+dy*dy<=(n.r+4)*(n.r+4)) return n;
  }
  return null;
}
function onMouseDown(e){
  const {x,y}=getPos(e);
  const n=hitTest(x,y);
  if(n){ dragging=n; dragOffX=x-n.x; dragOffY=y-n.y; dragMoved=false; canvas.style.cursor='grabbing'; }
}
// 获取节点的所有子孙节点 id（按层级返回，带深度）
function getDescendants(nodeId){
  const result=[];
  const queue=[{id:nodeId, depth:0}];
  while(queue.length){
    const {id,depth}=queue.shift();
    nodes.filter(n=>n.parentId===id).forEach(c=>{
      result.push({id:c.id, depth:depth+1});
      queue.push({id:c.id, depth:depth+1});
    });
  }
  return result;
}

// 弹簧动画状态：每个节点有目标位置和速度
// 格式：{ nodeId: {tx, ty, vx, vy} }
let springTargets={};
let rafId=null;

function startSpringLoop(){
  if(rafId) return;
  function tick(){
    let anyActive=false;
    const stiffness=0.18, damping=0.72;
    for(const id in springTargets){
      const s=springTargets[id];
      const n=getNode(parseInt(id));
      if(!n){ delete springTargets[id]; continue; }
      const dx=s.tx-n.x, dy=s.ty-n.y;
      s.vx=(s.vx+dx*stiffness)*damping;
      s.vy=(s.vy+dy*stiffness)*damping;
      n.x+=s.vx; n.y+=s.vy;
      if(Math.abs(s.vx)<0.1 && Math.abs(s.vy)<0.1 && Math.abs(dx)<0.5 && Math.abs(dy)<0.5){
        n.x=s.tx; n.y=s.ty;
        delete springTargets[id];
      } else { anyActive=true; }
    }
    render();
    if(anyActive) rafId=requestAnimationFrame(tick);
    else rafId=null;
  }
  rafId=requestAnimationFrame(tick);
}

function setSpringTarget(nodeId, tx, ty){
  if(!springTargets[nodeId]) springTargets[nodeId]={tx,ty,vx:0,vy:0};
  else { springTargets[nodeId].tx=tx; springTargets[nodeId].ty=ty; }
}

function onMouseMove(e){
  const {x,y}=getPos(e);
  if(dragging){
    const newX=Math.max(dragging.r+4,Math.min(cw()-dragging.r-4,x-dragOffX));
    const newY=Math.max(dragging.r+4,Math.min(ch()-dragging.r-4,y-dragOffY));
    const dx=newX-dragging.x, dy=newY-dragging.y;
    if(Math.abs(dx)+Math.abs(dy)>0.5) dragMoved=true;
    // 直接移动被拖节点
    dragging.x=newX; dragging.y=newY;
    // 子孙节点弹性跟随（越深延迟越大）
    getDescendants(dragging.id).forEach(({id, depth})=>{
      const n=getNode(id);
      if(!n) return;
      const lag=1+depth*0.6; // 越深弹性越大
      const cur=springTargets[id]||{tx:n.x,ty:n.y,vx:0,vy:0};
      setSpringTarget(id, cur.tx+dx/lag, cur.ty+dy/lag);
    });
    startSpringLoop();
    render(); return;
  }
  const n=hitTest(x,y);
  const nh=n?n.id:null;
  if(nh!==hoveredNode){ hoveredNode=nh; canvas.style.cursor=n?'pointer':'default'; render(); }
}
function onMouseUp(){
  if(dragging){
    // 松手时让子孙弹性归位到精确目标
    getDescendants(dragging.id).forEach(({id})=>{
      const s=springTargets[id];
      if(s){ s.vx*=1.4; s.vy*=1.4; } // 松手时给一点额外弹力
    });
    startSpringLoop();
  }
  dragging=null;
  canvas.style.cursor=hoveredNode?'pointer':'default';
}
function onCanvasClick(e){
  if(dragMoved){ dragMoved=false; return; }
  const {x,y}=getPos(e);
  const n=hitTest(x,y);
  if(n){ selectedNode=n.id; showPopup(n,e.clientX,e.clientY); render(); }
  else { closePopup(); selectedNode=null; render(); }
}

// ── Popup ─────────────────────────────────────────────────────────────────────
function showPopup(node, cx, cy){
  currentPopupNode=node;
  document.getElementById('popupTitle').textContent=\`「\${node.word}」→ 选择维度发散\`;

  const grid=document.getElementById('dimGrid');
  grid.innerHTML='';
  DIMS.forEach(d=>{
    if(d.egg && stepCount<3) return;
    const btn=document.createElement('button');
    btn.className='dim-tag'+(d.egg?' egg-tag':'');
    btn.textContent=d.label;
    btn.onclick=()=>expandFrom(node,d.id,d.label);
    grid.appendChild(btn);
  });

  const starBtn=document.getElementById('popupStar');
  const starred=favorites.find(f=>f.word===node.word);
  starBtn.className='popup-btn'+(starred?' starred':'');
  starBtn.textContent=starred?'★ 已收藏':'⭐ 收藏';

  // 根节点不显示删除按钮
  const delBtn=document.getElementById('popupDelete');
  delBtn.style.display=node.parentId===null?'none':'block';

  document.getElementById('popupMenu').classList.add('show');
}

function closePopup(){
  document.getElementById('popupMenu').classList.remove('show');
  currentPopupNode=null;
}

function deleteCurrentNode(){
  if(!currentPopupNode) return;
  const n=currentPopupNode;
  // 不允许删根节点
  if(n.parentId===null){ closePopup(); return; }
  // 收集所有子孙 id
  const toDelete=new Set([n.id, ...getDescendants(n.id).map(d=>d.id)]);
  // 从收藏夹移除
  const deletedWords=nodes.filter(nd=>toDelete.has(nd.id)).map(nd=>nd.word);
  favorites=favorites.filter(f=>!deletedWords.includes(f.word));
  // 删节点和边
  nodes=nodes.filter(nd=>!toDelete.has(nd.id));
  edges=edges.filter(e=>!toDelete.has(e.to)&&!toDelete.has(e.from));
  // 清弹簧状态
  toDelete.forEach(id=>delete springTargets[id]);
  closePopup();
  selectedNode=null;
  updateFavUI();
  render();
}

function toggleFavCurrent(){
  if(!currentPopupNode) return;
  const n=currentPopupNode;
  const idx=favorites.findIndex(f=>f.word===n.word);
  const btn=document.getElementById('popupStar');
  if(idx>=0){
    favorites.splice(idx,1);
    btn.className='popup-btn'; btn.textContent='⭐ 收藏';
  } else {
    favorites.push({word:n.word, dimLabel:n.dimLabel||'根节点'});
    btn.className='popup-btn starred'; btn.textContent='★ 已收藏';
  }
  updateFavUI(); render();
}

// ── Expand ────────────────────────────────────────────────────────────────────
// Loading 节点占位
let loadingNodeIds = [];

function showLoadingNodes(parentNode, count=3) {
  let baseAngle = Math.random()*Math.PI*2;
  if(parentNode.parentId !== null) {
    const parent = getNode(parentNode.parentId);
    if(parent) baseAngle = Math.atan2(parentNode.y-parent.y, parentNode.x-parent.x);
  }
  const dist=130, spread=Math.PI*0.7;
  loadingNodeIds = [];
  for(let i=0; i<count; i++) {
    const angle = baseAngle + (i-(count-1)/2)*(spread/(Math.max(count-1,1)));
    const tx = parentNode.x + Math.cos(angle)*dist;
    const ty = parentNode.y + Math.sin(angle)*dist;
    const n = {
      id: newId(), word: '…', dimId: null, dimLabel: '', parentId: parentNode.id,
      x: tx, y: ty, r: 30,
      color: '#F0F0F0', stroke: '#C0C0C0',
      isLoading: true, expanded: false, lastWords: [],
    };
    n.x = Math.max(n.r+8, Math.min(cw()-n.r-8, n.x));
    n.y = Math.max(n.r+8, Math.min(ch()-n.r-8, n.y));
    nodes.push(n);
    edges.push({from: parentNode.id, to: n.id});
    loadingNodeIds.push(n.id);
  }
  render();
}

function removeLoadingNodes() {
  nodes = nodes.filter(n => !loadingNodeIds.includes(n.id));
  edges = edges.filter(e => !loadingNodeIds.includes(e.to));
  loadingNodeIds = [];
}

async function expandFrom(node, dimId, dimLabel){
  closePopup(); selectedNode=null;
  stepCount++;
  document.getElementById('stepCount').textContent=stepCount;
  node.expanded=true;

  // 先显示 loading 占位节点
  showLoadingNodes(node);

  // 尝试 AI，fallback 本地
  let words = await aiExpand(node.word, dimId, dimLabel, node.lastWords);
  if (!words) words = getWords(node.word, dimId, node.lastWords);
  node.lastWords = [...node.lastWords, ...words];

  // 移除 loading，放入真实节点
  removeLoadingNodes();

  let baseAngle = Math.random()*Math.PI*2;
  if(node.parentId !== null) {
    const parent = getNode(node.parentId);
    if(parent) baseAngle = Math.atan2(node.y-parent.y, node.x-parent.x);
  }
  const dist=130, spread=Math.PI*0.7;
  words.forEach((w,i)=>{
    const angle = baseAngle + (i-(words.length-1)/2)*(spread/(Math.max(words.length-1,1)));
    const tx = node.x + Math.cos(angle)*dist;
    const ty = node.y + Math.sin(angle)*dist;
    addNode(w, dimId, dimLabel, node.id, tx, ty);
  });
  render();
}

// ── Game ──────────────────────────────────────────────────────────────────────
function startGame(){
  const seed=document.getElementById('seedInput').value.trim();
  if(!seed){ alert('请输入关键词'); return; }
  resetGame(false);
  document.getElementById('emptyHint').style.display='none';
  const cx=cw()/2, cy=ch()/2;
  addNode(seed,null,'根节点',null,cx,cy);
  render();
}

function resetGame(showHint=true){
  nodes=[]; edges=[]; stepCount=0; favorites=[]; nodeIdCounter=0;
  selectedNode=null; hoveredNode=null; dragging=null;
  springTargets={}; if(rafId){cancelAnimationFrame(rafId);rafId=null;}
  document.getElementById('stepCount').textContent='0';
  document.getElementById('emptyHint').style.display=showHint?'flex':'none';
  closePopup(); updateFavUI(); render();
}

// ── Favorites ─────────────────────────────────────────────────────────────────
function updateFavUI(){
  const list=document.getElementById('favList');
  document.getElementById('favCount').textContent=favorites.length;
  document.getElementById('btnMindmap').disabled=favorites.length===0;
  list.innerHTML=favorites.map(f=>\`
    <div class="fav-chip">
      <span>\${f.dimLabel.split(' ')[0]||'💡'}</span>
      <span>\${f.word}</span>
      <span class="rm" onclick="removeFav('\${f.word.replace(/'/g,"\\\\'")}')">✕</span>
    </div>\`).join('');
}
function removeFav(word){
  favorites=favorites.filter(f=>f.word!==word);
  updateFavUI(); render();
}

// ── Mind Map ──────────────────────────────────────────────────────────────────
function showMindmap(){
  if(!favorites.length) return;
  document.getElementById('modalOverlay').classList.add('show');
  drawMindmap();
}
function closeModal(e){ if(e.target===document.getElementById('modalOverlay')) document.getElementById('modalOverlay').classList.remove('show'); }
function closeModalDirect(){ document.getElementById('modalOverlay').classList.remove('show'); }

function drawMindmap(){
  const mc=document.getElementById('mindmapCanvas');
  const W=Math.min(window.innerWidth*0.78,720), H=Math.min(window.innerHeight*0.68,520);
  mc.width=W; mc.height=H;
  const mctx=mc.getContext('2d');
  mctx.fillStyle='#FAF8F4'; mctx.fillRect(0,0,W,H);
  const cx=W/2, cy=H/2;
  const seed=document.getElementById('seedInput').value.trim()||'关键词';
  const groups={};
  favorites.forEach(f=>{if(!groups[f.dimLabel])groups[f.dimLabel]=[];groups[f.dimLabel].push(f.word);});
  const gKeys=Object.keys(groups);
  drawMBubble(mctx,cx,cy,seed,'#EEF2FF','#6C63FF','#2D2D2D',15,50,true);
  gKeys.forEach((dim,gi)=>{
    const angle=(gi/gKeys.length)*Math.PI*2-Math.PI/2;
    const bx=cx+Math.cos(angle)*150, by=cy+Math.sin(angle)*150;
    mctx.beginPath(); mctx.moveTo(cx,cy); mctx.lineTo(bx,by);
    mctx.strokeStyle='#D8D4CC'; mctx.lineWidth=1.5; mctx.stroke();
    drawMBubble(mctx,bx,by,dim,'#F5F5F5','#999','#666',10,34,false);
    groups[dim].forEach((word,wi)=>{
      const sa=angle+(wi-(groups[dim].length-1)/2)*0.55;
      const lx=bx+Math.cos(sa)*85, ly=by+Math.sin(sa)*85;
      mctx.beginPath(); mctx.moveTo(bx,by); mctx.lineTo(lx,ly);
      mctx.strokeStyle='#E8E4DC'; mctx.lineWidth=1; mctx.stroke();
      drawMBubble(mctx,lx,ly,word,'#FFFFFF','#6C63FF','#2D2D2D',12,28,false);
    });
  });
}
function drawMBubble(ctx,x,y,text,fill,stroke,textColor,fontSize,r,bold){
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.08)'; ctx.shadowBlur=8; ctx.shadowOffsetY=2;
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fillStyle=fill; ctx.fill();
  ctx.strokeStyle=stroke; ctx.lineWidth=1.5; ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.fillStyle=textColor;
  ctx.font=\`\${bold?'700 ':''}\${fontSize}px 'PingFang SC',sans-serif\`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  let t=text;
  while(ctx.measureText(t).width>r*1.7&&t.length>2) t=t.slice(0,-1);
  if(t!==text) t+='…';
  ctx.fillText(t,x,y);
  ctx.restore();
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.getElementById('seedInput').addEventListener('keydown',e=>{ if(e.key==='Enter') startGame(); });
window.addEventListener('load', initCanvas);
</script>
</body>
</html>
`;

Deno.serve(async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  if (url.pathname === "/api/proxy") {
    const target = url.searchParams.get("target");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    let apiUrl: string;

    if (target === "claude") {
      apiUrl = "https://api.anthropic.com/v1/messages";
      headers["x-api-key"] = req.headers.get("x-api-key") ?? "";
      headers["anthropic-version"] = "2023-06-01";
    } else {
      apiUrl = "https://api.moonshot.cn/v1/chat/completions";
      headers["Authorization"] = req.headers.get("authorization") ?? "";
    }

    try {
      const body = await req.text();
      const res = await fetch(apiUrl, { method: "POST", headers, body });
      const data = await res.text();
      return new Response(data, {
        status: res.status,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }
  }

  return new Response(INDEX_HTML, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});
