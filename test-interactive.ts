// test-interactive.ts - 交互式测试文件
import { mastra } from './src/mastra';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chatLoop() {
  console.log('🌤️ 正在启动天气助手...');
  
  try {
    const agent = await mastra.getAgent('weatherAgent');
    console.log('✅ 天气助手已启动！');
    console.log('💡 你可以问我任何关于天气的问题，比如：');
    console.log('   - "北京今天天气怎么样？"');
    console.log('   - "上海现在的温度是多少？"');
    console.log('   - "深圳适合穿什么衣服？"');
    console.log('   - 输入 "exit" 退出\n');
    
    const askQuestion = () => {
      rl.question('🙋 您: ', async (input) => {
        if (input.toLowerCase() === 'exit' || input === '退出') {
          console.log('👋 再见！感谢使用天气助手！');
          rl.close();
          return;
        }
        
        if (!input.trim()) {
          console.log('🤔 请输入你想查询的内容...');
          askQuestion();
          return;
        }
        
        try {
          console.log('🔍 正在查询中...');
          const result = await agent.generate(input);
          console.log('🤖 助手:', result.text);
          console.log('\n' + '-'.repeat(50) + '\n');
        } catch (error) {
          console.error('❌ 查询失败:', (error as Error).message);
          console.log('💡 请检查网络连接或API密钥配置\n');
        }
        
        askQuestion();
      });
    };
    
    askQuestion();
  } catch (error) {
    console.error('❌ 启动失败:', error);
    console.log('💡 请检查：');
    console.log('   1. .env 文件中的 OPENAI_API_KEY 是否正确');
    console.log('   2. 网络连接是否正常');
    console.log('   3. 依赖包是否完整安装 (npm install)');
    rl.close();
  }
}

chatLoop();