# 使用官方Node.js运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json（如果存在）
COPY package*.json ./

# 安装项目依赖
RUN npm ci --only=production && npm cache clean --force

# 复制项目文件
COPY . .

# 构建TypeScript项目
RUN npm run build 2>/dev/null || echo "No build script found"

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S weather -u 1001

# 更改文件所有权
RUN chown -R weather:nodejs /app
USER weather

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 启动应用
CMD ["npm", "start"]