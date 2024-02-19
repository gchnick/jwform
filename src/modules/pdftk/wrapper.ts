/* eslint-disable simple-import-sort/imports */
import { exec } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import { sep } from "node:path";

import { GeneratePDFFail, StringBase64Invalid } from "./errors";
import { isAvaliability } from "./is-avaliability";
import { Fields, asRecordFields, updateFdf } from "./record-fields";

const base64Regex =
  /^(?:[\d+/A-Za-z]{4})*(?:[\d+/A-Za-z]{4}|[\d+/A-Za-z]{3}=|[\d+/A-Za-z]{2}={2})$/;

async function isBase64AndWriteFile(file: string) {
  const randomName = generateRandomNameTo();
  if (!base64Regex.test(file))
    throw StringBase64Invalid("String base64 is invalid\n");
  await fs.writeFile(`./${randomName}`, file, { encoding: "base64" });
  return randomName;
}

async function generateTemporalDirectory() {
  const tmpDir = os.tmpdir();
  return await fs.mkdtemp(`${tmpDir}${sep}jwform`);
}

async function goToTemporalDirectory() {
  const directory = await generateTemporalDirectory();
  process.chdir(directory);
}

/**
 * @param extension Extension of random name file. By default is `.pdf`
 */
function generateRandomNameTo(extension = ".pdf") {
  return `${randomUUID()}${extension}`;
}

function existsFileValidate(file: string) {
  const exists = existsSync(`./${file}`);
  if (!exists) throw GeneratePDFFail("Generate pdf fail\n");
}

async function updateFdfWithData(fdfFile: string, data: Fields) {
  const rawFdf = await fs.readFile(`./${fdfFile}`, { encoding: "utf8" });
  const fdfData = updateFdf(rawFdf, data);
  await fs.writeFile(`./${fdfFile}`, fdfData);
}

function execute(command: string): Promise<string> {
  isAvaliability();
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error != undefined) reject(`Pdftk error: ${error.message}\n`);
      resolve(stdout);
    });
  });
}

async function executeAndCheck(command: string, fileGenerate: string) {
  await execute(command);
  existsFileValidate(fileGenerate);
}

async function asBase64(file: string) {
  return fs.readFile(`./${file}`, { encoding: "base64" });
}

/**
 * Get data of form wrapper into `Record<Fields>`
 * @param pdf string base64 of `form .pdf` to get data fields
 * @returns data as `Record<Fields>` with field names and values
 */
export async function getFields(pdf: string) {
  await goToTemporalDirectory();
  const ORIGIN_FILE = await isBase64AndWriteFile(pdf);
  const COMMAND = `pdftk ${ORIGIN_FILE} dump_data_fields_utf8`;
  const fields = await execute(COMMAND);
  return asRecordFields(fields);
}

/**
 *
 * @param pdf string base64 of `form .pdf` to fill
 * @param data `Fields` with data to insert into form
 * @param flatten for default is false. Set true to get a form flattened
 * @returns form filled in string base64
 */
export async function fillForm(pdf: string, data: Fields, flatten = false) {
  await goToTemporalDirectory();
  const ORIGIN_FILE = await isBase64AndWriteFile(pdf);
  const GENERATE_FILE = generateRandomNameTo();
  const FDF_FILE = generateRandomNameTo(".fdf");

  let COMMAND = `pdftk ${ORIGIN_FILE} generate_fdf output ${FDF_FILE}`;

  await executeAndCheck(COMMAND, FDF_FILE);
  await updateFdfWithData(FDF_FILE, data);

  COMMAND = flatten
    ? `pdftk ${ORIGIN_FILE} fill_form ${FDF_FILE} output ${GENERATE_FILE} flatten`
    : `pdftk ${ORIGIN_FILE} fill_form ${FDF_FILE} output ${GENERATE_FILE}`;
  await executeAndCheck(COMMAND, GENERATE_FILE);

  return asBase64(GENERATE_FILE);
}

/**
 * Encrypt a PDF using AES-128, withhold all permissions
 * @param pdf string base64 of `form .pdf` to encrypt
 * @param password password use to encrypt
 * @param userPassword if use, must also be used to open form
 * @returns form encrypted in string base64
 */
export async function encryptForm(
  pdf: string,
  password: string,
  userPassword?: string,
) {
  await goToTemporalDirectory();
  const ORIGIN_FILE = await isBase64AndWriteFile(pdf);
  const GENERATE_FILE = generateRandomNameTo();
  const COMMAND = userPassword
    ? `pdftk ${ORIGIN_FILE} output ${GENERATE_FILE} owner_pw ${password} user_pw ${userPassword}`
    : `pdftk ${ORIGIN_FILE} output ${GENERATE_FILE} owner_pw ${password}`;

  await executeAndCheck(COMMAND, GENERATE_FILE);
  return asBase64(GENERATE_FILE);
}

/**
 *
 * @param pdf string base64 of `form .pdf` encrypted
 * @param password password to dencrypt form
 * @returns form decrypted in string base64
 */
export async function decryptForm(pdf: string, password: string) {
  await goToTemporalDirectory();
  const ORIGIN_FILE = await isBase64AndWriteFile(pdf);
  const GENERATE_FILE = generateRandomNameTo();
  const COMMAND = `pdftk ${ORIGIN_FILE} input_pw ${password} output ${GENERATE_FILE}`;

  await executeAndCheck(COMMAND, GENERATE_FILE);
  return asBase64(GENERATE_FILE);
}
