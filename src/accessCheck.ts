import * as fsp from "fs/promises";
import { constants, PathLike } from "fs";
const { X_OK } = constants;

export async function accessCheck(
  outDir: PathLike
): Promise<"Access Granted" | "Access Denied"> {
  let permission: "Access Granted" | "Access Denied";
  try {
    await fsp.access(outDir, X_OK);
    permission = "Access Granted";
  } catch (error) {
    permission = "Access Denied";
  }

  return permission;
}
