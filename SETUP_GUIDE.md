# 📦 尘白跑团项目 - 本地安装指南

## 🚀 快速开始

### 前置要求
- Node.js 18+ (https://nodejs.org)
- Git (https://git-scm.com)

### 安装步骤

```bash
# 1. 打开命令行，进入你想放项目的文件夹
cd Desktop

# 2. 克隆/创建项目（二选一）

# 方式A：如果你已经把代码上传到GitHub，直接克隆
git clone https://github.com/你的用户名/dust-zone-trpg.git
cd dust-zone-trpg

# 方式B：创建新项目
mkdir dust-zone-trpg
cd dust-zone-trpg

# 3. 初始化 npm 并安装依赖
npm init -y
npm install react react-dom zustand lucide-react clsx tailwind-merge
npm install -D vite @vitejs/plugin-react typescript tailwindcss @tailwindcss/vite @types/react @types/react-dom @types/node

# 4. 复制项目文件（见下方文件清单）

# 5. 运行项目
npm run dev
```

---

## 📁 项目文件结构

```
dust-zone-trpg/
├── public/
│   └── images/
│       ├── avatars/       ← 角色头像
│       ├── covers/        ← 封面图片
│       ├── expressions/   ← 表情差分
│       └── refs/          ← 角色立绘
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   └── Modal.tsx
│   ├── data/
│   │   ├── characters.ts  ← 【编辑角色】
│   │   ├── scripts.ts     ← 【编辑剧本】
│   │   └── aiRules.ts     ← 【编辑AI规则】
│   ├── pages/
│   │   ├── ChatPage.tsx
│   │   ├── CharactersPage.tsx
│   │   ├── ScriptsPage.tsx
│   │   ├── SavesPage.tsx
│   │   ├── AIRulesPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── HelpPage.tsx
│   ├── store/
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── cn.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 📄 核心配置文件

### package.json
```json
{
  "name": "dust-zone-trpg",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.577.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.4.0",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^5.1.0",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.9.0",
    "vite": "^7.0.0"
  }
}
```

### vite.config.ts
```typescript
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "types": ["node"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "vite.config.ts"]
}
```

### index.html
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>尘白跑团 - 二创跑团游戏</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 🔄 发布更新流程

```bash
# 修改代码后
git add .
git commit -m "更新说明"
git push

# Vercel 会自动部署，约1-2分钟后生效
```

---

## ❓ 常见问题

### Q: npm 命令找不到
A: 确保已安装 Node.js 并重启命令行

### Q: 图片不显示
A: 检查图片路径是否以 `/` 开头，如 `/images/avatars/xxx.png`

### Q: 部署后页面空白
A: 检查 Vercel 部署日志是否有报错
