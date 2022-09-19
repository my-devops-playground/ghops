import { writeFileSync, readFileSync } from "fs";

const REF_FILE = "package.json";
const TGT_FILE = "index.js";

const json = JSON.parse(readFileSync(REF_FILE).toString());
const content = readFileSync(TGT_FILE).toString();
const newContent = content.replaceAll(
  /(.version\(")[\d.]+("\))/g,
  `$1${json.version}$2`
);

writeFileSync(TGT_FILE, newContent);
