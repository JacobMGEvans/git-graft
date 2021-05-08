import * as fsp from "fs/promises";
import { constants, PathLike } from "fs";
const { X_OK } = constants;

type permissions = "Access Granted" | "Access Denied";
export async function accessCheck(outDir: PathLike): Promise<permissions> {
  let permission: permissions;
  try {
    await fsp.access(outDir, X_OK);
    permission = "Access Granted";
  } catch (error) {
    permission = "Access Denied";
  }

  return permission;
}
