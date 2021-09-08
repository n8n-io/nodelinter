#!/usr/bin/env node

import fs from "fs";
import { lintAll } from "./scripts/lintAll";
import { lintOne } from "./scripts/lintOne";
import { terminate } from "./utils";
import { ERRORS } from "./constants";
import { ConfigManager } from "./services/ConfigManager";

export const isNotTestRun = process.argv[1].split("/").pop() !== "jest";

const configManager = new ConfigManager(process.argv.slice(2));

const { masterConfig, printLogs } = configManager;

export { masterConfig };

if (isNotTestRun) {
  let symlink;

  try {
    symlink = fs.lstatSync(masterConfig.target);
  } catch (error) {
    terminate(ERRORS.FAILED_TO_FIND_TARGET_AT_PATH);
  }

  symlink.isDirectory()
    ? lintAll(masterConfig, { printLogs })
    : lintOne(masterConfig, { printLogs });
}
