# GitHub Pages 部署指南

## 📋 准备工作

### 你需要：
1. GitHub 账号
2. 已购买域名 www.mackiaatlas.com（或准备购买）
3. 访问域名注册商的 DNS 设置权限

---

## 🚀 步骤 1: 创建 GitHub 仓库并上传文件

### 1.1 在 GitHub 上创建新仓库
1. 访问 https://github.com/new
2. 仓库名称输入：`mackiaatlas` 或 `portfolio`（名称不影响最终域名）
3. 设置为 **Public**（公开）
4. **不要**勾选 "Add a README file"（我们已经有了）
5. 点击 "Create repository"

### 1.2 在本地初始化 Git 并上传
打开终端（Terminal），进入项目文件夹：

```bash
cd /Users/zhuyuchen/Desktop/kiro/mackiaatlas

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建第一次提交
git commit -m "Initial commit: Add portfolio website"

# 连接到 GitHub 仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/mackiaatlas.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

---

## 🌐 步骤 2: 启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 **Settings**（设置）
2. 在左侧菜单找到 **Pages**
3. 在 "Source" 下：
   - Branch: 选择 `main`
   - Folder: 选择 `/ (root)`
4. 点击 **Save**
5. 等待几分钟，页面会显示：  
   ✅ "Your site is live at https://YOUR_USERNAME.github.io/mackiaatlas/"

---

## 🔗 步骤 3: 配置自定义域名

### 3.1 在 GitHub Pages 设置
1. 还是在 **Settings > Pages** 页面
2. 在 "Custom domain" 输入框中输入：`www.mackiaatlas.com`
3. 点击 **Save**
4. 勾选 **Enforce HTTPS**（强制使用 HTTPS）

⚠️ **注意**：GitHub 会自动检测 CNAME 文件（我已经为你创建了）

---

## 📡 步骤 4: 在域名注册商设置 DNS 记录

### 4.1 登录你的域名注册商
（如 GoDaddy、Namecheap、阿里云、腾讯云等）

### 4.2 找到 DNS 管理或域名解析设置

### 4.3 添加以下 DNS 记录：

#### 记录 1：CNAME 记录（用于 www.mackiaatlas.com）
- **类型**：CNAME
- **主机记录/名称**：`www`
- **记录值/目标**：`YOUR_USERNAME.github.io`（替换为你的 GitHub 用户名）
- **TTL**：3600 或默认值

#### 记录 2：A 记录（用于 mackiaatlas.com，可选但推荐）
添加以下 4 条 A 记录（指向 GitHub Pages 的 IP）：

- **类型**：A，**主机记录**：`@`，**记录值**：`185.199.108.153`
- **类型**：A，**主机记录**：`@`，**记录值**：`185.199.109.153`
- **类型**：A，**主机记录**：`@`，**记录值**：`185.199.110.153`
- **类型**：A，**主机记录**：`@`，**记录值**：`185.199.111.153`

### 4.4 保存 DNS 设置

---

## ⏰ 步骤 5: 等待 DNS 生效

- DNS 更改通常需要 **几分钟到 48 小时**生效
- 大多数情况下 15-30 分钟就能访问

### 检查 DNS 是否生效：
打开终端，运行：
```bash
# 检查 CNAME 记录
dig www.mackiaatlas.com

# 检查 A 记录
dig mackiaatlas.com
```

---

## ✅ 步骤 6: 验证网站

1. 访问 https://www.mackiaatlas.com
2. 检查 HTTPS 是否启用（浏览器地址栏有锁图标）
3. 确认网站内容正确显示

---

## 🔧 常见问题

### Q: DNS 设置后显示 "404 - There isn't a GitHub Pages site here"
**A:** 
- 确认 CNAME 文件内容是 `www.mackiaatlas.com`（已包含）
- 在 GitHub Settings > Pages 中重新保存一次自定义域名
- 等待几分钟再试

### Q: 网站显示但没有 HTTPS
**A:** 
- 在 GitHub Settings > Pages 中勾选 "Enforce HTTPS"
- 如果选项是灰色的，等待几小时让 GitHub 配置 SSL 证书

### Q: www.mackiaatlas.com 可以访问，但 mackiaatlas.com 不行
**A:** 
- 确认添加了 4 条 A 记录（步骤 4.3）
- 等待 DNS 生效

### Q: 修改网站内容后如何更新？
**A:** 
```bash
cd /Users/zhuyuchen/Desktop/kiro/mackiaatlas
# 修改文件后
git add .
git commit -m "Update content"
git push
```
等待 1-2 分钟，网站会自动更新。

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 检查 GitHub Pages 官方文档：https://docs.github.com/pages
2. 查看你的域名注册商的 DNS 设置指南
3. 在 GitHub 仓库的 Settings > Pages 页面查看错误提示

---

## 📝 文件说明

- `index.html` - 主页面（Architecture Design 页面）
- `CNAME` - 自定义域名配置文件（告诉 GitHub 你的域名）
- `README.md` - 项目说明
- `.gitignore` - Git 忽略文件配置

---

**祝部署顺利！🎉**

如有问题，随时询问。
