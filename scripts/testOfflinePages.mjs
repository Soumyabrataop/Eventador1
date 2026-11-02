import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const pages = ['#home', '#explore', '#hackathons', '#meetups', '#nearme', '#osint', '#bots'];

async function testPages() {
  for (const page of pages) {
    const url = `http://127.0.0.1:4123/${page}`;
    try {
      const { stdout, stderr } = await execFileAsync(edgePath, [
        '--headless=new',
        '--virtual-time-budget=2000',
        '--dump-dom',
        url
      ], { maxBuffer: 10 * 1024 * 1024 });

      const hasEventador = stdout.includes('Eventador');
      const hasRootContent = !stdout.includes('<div id="root"></div>');
      const hasTrending = stdout.includes('Trending This Week') || stdout.includes('verified events') || stdout.includes('Discord Bot') || stdout.includes('Hackathons');
      console.log(`[PASS] ${page.padEnd(12)} -> HTML length: ${stdout.length}, hasEventador: ${hasEventador}, mounted: ${hasRootContent}`);
      
      if (!hasRootContent) {
        console.error(`WARNING: ${page} did not mount React!`);
      }
    } catch (e) {
      console.error(`[FAIL] ${page}:`, e.message);
    }
  }
}

testPages();
