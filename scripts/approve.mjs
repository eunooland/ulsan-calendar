// 승인 대기(pending.json) 항목을 사이트 데이터로 옮긴다.
// 사용: node scripts/approve.mjs 101 102      (번호로 승인)
//       node scripts/approve.mjs --all        (대기 항목 전부 승인)
//       node scripts/approve.mjs --reject 103 (대기에서 삭제만)
// 승인된 항목은 kind가 experience면 experiences.json, 아니면 events.json에 들어간다.
import fs from "node:fs";
const dir = new URL("../docs/data/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const rd = (f) => JSON.parse(fs.readFileSync(dir + f, "utf8"));
const pdir = new URL("../pending/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const wr = (f, v) => fs.writeFileSync(dir + f, JSON.stringify(v, null, 1));

const args = process.argv.slice(2);
const reject = args[0] === "--reject";
const ids = (reject ? args.slice(1) : args).filter((a) => a !== "--all").map(Number);
const all = args.includes("--all");

const pending = JSON.parse(fs.readFileSync(pdir + "pending.json", "utf8"));
const events = rd("events.json");
const exps = rd("experiences.json");
const take = pending.filter((p) => all || ids.includes(p.id));
if (!take.length) { console.log("해당하는 대기 항목이 없습니다."); process.exit(0); }

const today = new Date().toISOString().slice(0, 10);
for (const p of take) {
  if (reject) { console.log("삭제:", p.id, p.title); continue; }
  const { kind, reason, ...item } = p;
  item.chk = today.slice(5).replace("-", ".") + " 승인";
  if (kind === "experience") {
    if (exps.some((x) => x.title === item.title && x.start === item.start)) { console.log("이미 있음(건너뜀):", p.title); continue; }
    exps.push(item);
  } else {
    if (events.some((x) => x.title === item.title && x.start === item.start)) { console.log("이미 있음(건너뜀):", p.title); continue; }
    events.push(item);
  }
  console.log("승인:", p.id, p.title);
}
const left = pending.filter((p) => !take.includes(p));
fs.writeFileSync(pdir + "pending.json", JSON.stringify(left, null, 1));
wr("events.json", events);
wr("experiences.json", exps);
console.log("대기 남음:", left.length);
