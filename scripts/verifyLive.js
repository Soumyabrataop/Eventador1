import { execFile } from 'node:child_process';

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

execFile(edgePath, [
  "--headless",
  "--disable-gpu",
  "--dump-dom",
  "--virtual-time-budget=4000",
  "https://eventadorapp.pages.dev/"
], (err, stdout, stderr) => {
  if (err) {
    console.error("Error:", err);
    process.exit(1);
  }
  const rIdx = stdout.indexOf('<div id="root">');
  console.log("Root index:", rIdx);
  console.log("Root snippet:", stdout.substring(rIdx, rIdx + 500));
  process.exit(0);
});
