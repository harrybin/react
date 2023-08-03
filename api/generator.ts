'use strict';

import * as fs from 'fs';
import * as readline from 'readline';
import * as http from 'http';
import * as https from 'https';
import { execSync } from 'child_process';

const workDir = './work';
const swaggerDefinitionFile = './swagger.json';
//TODO: here you need to set your default API base URL
let urlBase = `http://localhost:8080`;
//TODO: here you need to set your default service name
let service = 'swagger';
let serviceVersion = 'v1';
const defaultUrlSheme = `${urlBase}/${service}/${serviceVersion}/${swaggerDefinitionFile}`;

type HttpIncomingMessageCallback = (res: http.IncomingMessage) => void;

async function downloadApiDefinition(swaggerFileUrl: URL, targetPath: string, useTLS = true) {
    console.log(`Downloading api definition from '${swaggerFileUrl}' ...`);

    let response: http.ClientRequest;
    if (useTLS)
        response = await new Promise<http.ClientRequest>((resolve) =>
            https.get(swaggerFileUrl, resolve as unknown as HttpIncomingMessageCallback)
        );
    else
        response = await new Promise<http.ClientRequest>((resolve) =>
            http.get(swaggerFileUrl, resolve as unknown as HttpIncomingMessageCallback)
        );
    console.warn(`Saving api definition to '${targetPath}' ...`);
    return await new Promise((resolve) => {
        const stream = fs.createWriteStream(targetPath);
        response.pipe(stream);
        stream.on('finish', () => resolve(null));
    });
}

function createFolder(path: string) {
    fs.mkdirSync(path);
}

function deleteFolderRecursive(path: string) {
    if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true });
    }
}

function deleteFile(path: string) {
    if (fs.existsSync(path)) {
        fs.rmSync(path);
    }
}

function copyFiles(fromPath: string, toPath: string) {
    fs.readdirSync(fromPath).forEach((file) => {
        const from = `${fromPath}/${file}`;
        const to = `${toPath}/${file}`;

        if (fs.lstatSync(from).isDirectory()) {
            createFolder(to);
            copyFiles(from, to);
        } else {
            fs.copyFileSync(from, to);
        }
    });
}

function runOpenApiGenerator(tempPath = workDir, tempSwaggerFile = swaggerDefinitionFile) {
    console.log('Running open-api-generator ...');

    const generatorArgs = [
        'generate',
        '-i',
        tempSwaggerFile,
        '-g',
        'typescript-angular',
        '-o',
        tempPath,
        '-c',
        'generatorConfig.json',
    ];

    execSync(`openapi-generator-cli ${generatorArgs.join(' ')}`, {
        stdio: 'inherit',
    });
    console.log('open-api-generator DONE!');
}

/**
 * examines a diff/patch file line by line for real changes.
 * Empty patch files tke the original file as new added.
 * Comment changes regarding to the version of the 'OpenAPI document' are ignored.
 *
 * @param {string} file original file
 * @param {string} patchFile diff/patch file of the original file
 * @return {*}  {Promise<boolean>}
 */
async function hasPatchFileAnApiChange(file: string, patchFile: string): Promise<boolean> {
    const apiVersionComment = 'The version of the OpenAPI document';
    const fileStats = fs.statSync(patchFile);
    if (fileStats.size === 0) {
        //a diff on a new file creates an empty patch fiole
        console.info(`"${file}" is a new API file API`);
        return true;
    }
    const lineReader = readline.createInterface({
        input: fs.createReadStream(patchFile),
    });

    let apiChange = false;

    await new Promise((resolve) => {
        lineReader.on('line', function (line) {
            // search for any other change (line starting with "+" or "-")
            if (line[0] === '+' || line[0] === '-') {
                if (line.startsWith('+++') || line.startsWith('---') || line.includes(apiVersionComment)) return; //ignore file state in patch file as well as version changes in the two occurrences of "The version of the OpenAPI document"
                apiChange = true;
                resolve(true);
            }
        });
        lineReader.on('close', () => resolve(apiChange));
    }).catch((e) => {
        console.error(e);
    });

    return apiChange;
}

/**
 * create a git diff/patch file and return it path
 *
 * @param {string} file file to diff
 * @return {*}  {string} path to patch file
 */
function createGitDiffFile(file: string): string {
    const tempPatchFile = `${file}.patch`;
    console.log(`creating git diff/patch file "${tempPatchFile}"...`);
    execSync(`git diff ${file} > ${tempPatchFile}`, {
        stdio: 'inherit',
    });
    return tempPatchFile;
}

/**
 * Create a git diff/patch file calls {@link hasPatchFileAnApiChange} to check for changes
 *
 * @param {string} file api/model file to examine
 * @return {*}  {Promise<boolean>}
 */
async function apiInFileChanged(file: string): Promise<boolean> {
    console.warn(`Checking for api changes in "${file}"...`);
    const tempPatchFile = createGitDiffFile(file);
    let apiChange = false;
    try {
        apiChange = await hasPatchFileAnApiChange(file, tempPatchFile);
    } catch (e) {
        console.error(e);
    } finally {
        deleteFile(tempPatchFile);
    }

    if (apiChange) console.info(`"${file}" has API changes.`);
    else console.log(`"${file}" has NO api changes.`);
    return apiChange;
}

/**
 * reverts file changes by calling git restore
 *
 * @param {string} file file to be reverted/restored by git
 */
function gitRestoreFile(file: string) {
    execSync(`git restore ${file}`, {
        stdio: 'inherit',
    });
    console.log(`restored "${file}".`);
}

/**
 * validates all files in a folder to have real (see: {@link hasPatchFileAnApiChange}) changes regarding to their originals in git.
 *
 * @param {string} folder folder to examine all files in
 */
async function validateApiFilesForChanges(folder: string) {
    console.warn(`validating files for real api changes...`);
    const folderItems = fs.readdirSync(folder);
    for (let index = 0; index < folderItems.length; index++) {
        const file = folderItems[index];
        const filePath = `${folder}/${file}`;
        if (fs.lstatSync(filePath).isDirectory()) continue; //ignore subfolders
        const apiChanged = await apiInFileChanged(filePath);
        if (!apiChanged) gitRestoreFile(filePath);
    }
    console.log(`validating DONE! (you can now commit new and changed api files)`);
}

async function main(url: string, serviceName: string) {
    console.warn('Starting api interface generation...');
    // Cleanup old files
    deleteFolderRecursive(serviceName);
    deleteFolderRecursive(workDir);
    deleteFile(swaggerDefinitionFile);
    createFolder(workDir);
    createFolder(serviceName);
    const parsedUrl = new URL(url);
    // Download api definition
    await downloadApiDefinition(parsedUrl, swaggerDefinitionFile, parsedUrl.protocol === 'https:');
    // Run open-api-generator
    runOpenApiGenerator();
    // Copy new files
    copyFiles(`${workDir}/model`, serviceName);
    console.log('cleaning up temp files...');
    // Cleanup generator output
    deleteFolderRecursive(workDir);
    deleteFile(swaggerDefinitionFile);
    console.log(`!!! api interface generation for service "${serviceName}" DONE !!!`);
    //eleminate generated api file with no api change
    validateApiFilesForChanges(serviceName);
    //after this you can commit new and changed api files
}

let generatorArgs = process.argv.slice(2);
switch (generatorArgs.length) {
    case 0:
        break;
    case 1:
        service = generatorArgs[0];
        break;
    case 2:
        service = generatorArgs[0];
        urlBase = generatorArgs[1];
        break;
    case 3:
        service = generatorArgs[0];
        urlBase = generatorArgs[1];
        serviceVersion = generatorArgs[2];
        break;

    default:
        console.log(
            'Usage: node generator <api-url> <service/target-directory>' +
                `\n- Pass no args to use default service name (${service}) and url (${urlBase})` +
                '\n- Pass a single string argument for a differnt service name' +
                '\n- Pass a two args for a differnt service name and base URL' +
                '\n- Pass a tree args for a differnt service name, base URL and service version'
        );
        break;
}

// Do the work
main(defaultUrlSheme, service);
