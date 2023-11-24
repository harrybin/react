import path from 'path';
import fs from 'fs';
import prompts, { PromptObject, Choice } from 'prompts';
import { ejectGenerator } from './template-ejector';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export enum TEMPLATE_MODE {
    Cleared = 'Cleared',
    Intermediate = 'Intermediate',
    Full = 'Full',
    None = 'None',
}

const TEST_COMPONENT = /\/\/ ?EXAMPLE_COMPONENT/;
const HASH_COMPONENT = /# EXAMPLE_COMPONENT[\s\S]*?\n/g;

const HASH_COMMENT_REPLACE = /# EXAMPLE_START([\s\S]*?)# EXAMPLE_END/;
const TS_COMMENT_REPLACE = /\s*\/\/\s*EXAMPLE_START[\s\S]*?\/\/\s*EXAMPLE_END/gm;
const TSX_COMMENT_REPLACE = /(?:\{\/\*|\/\/) EXAMPLE_START \*\/\}[\s\S]*?(?:\{\/\*|\/\/) EXAMPLE_END \*\/\}/g;

//Comment types depend on file extensions
const fileRegexMap: Record<string, RegExp[]> = {
    ['.ts']: [TS_COMMENT_REPLACE],
    ['.tsx']: [TSX_COMMENT_REPLACE, TS_COMMENT_REPLACE],
    ['.cfignore']: [HASH_COMMENT_REPLACE],
    ['.yaml']: [HASH_COMMENT_REPLACE],
    ['.yml']: [HASH_COMMENT_REPLACE],
    ['']: [HASH_COMPONENT], // files like cf Staticfile dont have file extensions
};

let changedCount = 0;
let deletedCount = 0;

const validFileExt: string[] = ['.ts', '.tsx', '.cfignore', '.yml', '.yaml', '.html', '.conf', ''];

async function getSearchDirs() {
    const rootPath = path.resolve(__dirname, '../');
    const srcPath = path.resolve(__dirname, '../src');
    const nginxPath = path.resolve(__dirname, '../nginx');
    const playwrightPath = path.resolve(__dirname, '../playwrightTests');
    const publicPath = path.resolve(__dirname, '../public');
    const paths = [srcPath, nginxPath, playwrightPath, publicPath];
    let files: string[] = [];
    for (const path of paths) {
        const recursiveFiles = await getFilesRecursive(path, validFileExt);
        files.push(...recursiveFiles);
    }
    const rootFiles = await getFiles(rootPath, validFileExt);
    return [...rootFiles, ...files];
}
async function handleClearedMode({ fileContents, fileExt, fileName }: ModeHandlerParams): Promise<string> {
    // delete test components
    if (TEST_COMPONENT.test(fileContents) || HASH_COMPONENT.test(fileContents)) {
        fileName && (await fs.promises.unlink(fileName));
        deletedCount++;

        return fileContents;
    }
    const replaceRegex: RegExp[] = fileRegexMap[fileExt as string] || [];
    return replaceRegex.reduce((updatedContent, regex) => updatedContent.replace(regex, ''), fileContents);
}

// Everything will be commented with a block comment
function handleIntermediateMode({ fileContents }: ModeHandlerParams): string {
    const reg = new RegExp(/\{\/\* EXAMPLE_START \*\/\}/g);
    const firstReplaced = fileContents.replace(reg, `{ /* EXAMPLE_START }`);
    const replaceResult = firstReplaced.replace(TS_COMMENT_REPLACE, (match) => {
        return `/* ${match} */`;
    });
    return replaceResult.replace(HASH_COMMENT_REPLACE, (match) => {
        const lines = match.split('\n').map((line, index) => {
            if (index === 0) return line;
            return ` # ${line}`;
        });
        return lines.join('\n');
    });
}
function handleFullMode({ fileContents }: ModeHandlerParams): string {
    return fileContents;
}

interface ModeHandlerParams {
    fileContents: string;
    fileExt: string;
    fileName?: string;
}
type ModeHandlerFunction = (modeHandlerOptions: ModeHandlerParams) => Promise<string> | string;
const modeToHandler = new Map<TEMPLATE_MODE, ModeHandlerFunction>([
    [TEMPLATE_MODE.Cleared, handleClearedMode],
    [TEMPLATE_MODE.Intermediate, handleIntermediateMode],
    [TEMPLATE_MODE.Full, handleFullMode], // Nothing to remove if mode is full
]);

/**
 * Function that searchs recursively for files in a directory. Using custom function because there are
 * problems with the glob module
 * @param directoryPath directory to read from
 * @param fileArray files that are located in the given directory
 * @param fileExt an array of file ext that should be included in the search
 * @returns Promise<string[]> (Array of filePaths)
 */
async function getFilesRecursive(
    directoryPath: string,
    fileExt: string[] = validFileExt,
    fileArray: string[] = []
): Promise<string[]> {
    const files = await fs.promises.readdir(directoryPath);
    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stats = await fs.promises.stat(filePath);

        if (stats.isDirectory()) {
            await getFilesRecursive(filePath, fileExt, fileArray);
        } else {
            if (fileExt.includes(path.extname(filePath))) {
                fileArray.push(filePath);
            }
        }
    }

    return fileArray;
}

/**
 * Function that returns all files in a directory(! not recursive). Used to prevent scanning
 * all files in the root directory
 * @param directoryPath
 * @param fileExt
 * @returns string[] (filepaths)
 */
async function getFiles(directoryPath: string, fileExtensions: string[] = []): Promise<string[]> {
    const files = await fs.promises.readdir(directoryPath);

    const filePaths: string[] = [];
    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stat = await fs.promises.stat(filePath);
        if (stat.isFile() && fileExtensions.includes(path.extname(file))) {
            filePaths.push(filePath);
        }
    }

    return filePaths;
}

/**
 * adjust project name after prompt
 * @param projectName
 * @param projectDescription
 */
async function renameTemplate(projectName: string, projectDescription: string) {
    console.log('Renaming template based on your project name...');
    const packageJsonPath = './package.json';
    const packageJsonContent = await fs.promises.readFile(packageJsonPath, 'utf8');
    const packageJson: Record<string, any> = await JSON.parse(packageJsonContent);
    packageJson.name = projectName;
    packageJson.description = projectDescription;
    await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    const appTitleRegex = /react/g;
    const filePaths: string[] = await getSearchDirs();
    let occurences = 0;
    await Promise.all(
        filePaths.map(async (file) => {
            const fileContents = await fs.promises.readFile(file, 'utf8');
            const renamedFileContents = fileContents.replace(appTitleRegex, projectName);
            const fileChanged = fileContents !== renamedFileContents;
            if (fileChanged) {
                await fs.promises.writeFile(file, renamedFileContents, 'utf8');
                occurences++;
            }
        })
    );
    console.log(`Renamed ${occurences} occurences.`);
}

async function generateTemplate(mode: TEMPLATE_MODE) {
    console.log(`Running template generator script in ${mode} mode...`);

    const files: string[] = await getSearchDirs();
    const handleTemplateMode = modeToHandler.get(mode);
    if (handleTemplateMode) {
        await Promise.all(
            files.map(async (file) => {
                const fileExt = path.extname(file);
                const fileContents = await fs.promises.readFile(file, 'utf8');
                const generatorPayload: ModeHandlerParams = { fileContents, fileExt, fileName: file };
                const updatedContents = await handleTemplateMode(generatorPayload);
                const fileChanged = fileContents !== updatedContents;
                if (fileChanged) {
                    await fs.promises.writeFile(file, updatedContents, 'utf8');
                    changedCount++;
                }
            })
        );
        console.log(`Template generated, ${changedCount} file(s) changed, ${deletedCount} file(s) deleted`);
    }
}
async function templateGeneratorPrompt() {
    const templateChoices: Choice[] = [
        {
            title: `⚡ ${TEMPLATE_MODE.Cleared} -> Lightweight boilerplate`,
            value: TEMPLATE_MODE.Cleared,
        },
        {
            title: `🛠️  ${TEMPLATE_MODE.Intermediate} -> Commented Examples and best-practices`,
            value: TEMPLATE_MODE.Intermediate,
        },
        {
            title: `🚀 ${TEMPLATE_MODE.Full} -> Additional examples and best-practices`,
            value: TEMPLATE_MODE.Full,
        },
        {
            title: `🔥 ${TEMPLATE_MODE.None} -> Leave everything as it is, I know what I am doing!`,
            value: TEMPLATE_MODE.None,
        },
    ];

    const { mode } = await prompts(
        {
            type: 'select',
            name: 'mode',
            message: 'Choose a template',
            choices: templateChoices,
            format: (value) => value,
        },
        { onCancel }
    );
    if (mode === TEMPLATE_MODE.None) {
        return;
    }

    const questions: PromptObject[] = [
        {
            type: 'text',
            name: 'project',
            message: 'Enter project name',
            validate: (value) => value.trim() !== '' || 'Please enter a valid project name',
        },
        {
            type: 'text',
            name: 'description',
            message: 'Provide short description of your project',
            validate: (value) => value.trim() !== '' || 'Please provide a short description of your project',
        },
    ];
    async function onCancel() {
        console.log(
            `You canceled the generator prompt. Please discard all changes that are made by the generator and run the 
        npm install command again to make sure the template is generated correctly.`
        );
        throw new Error('Failed to generate template');
    }
    const { project, description } = await prompts(questions, { onCancel });
    await renameTemplate(project, description);
    await generateTemplate(mode);
    await ejectGenerator(mode);
}

try {
    templateGeneratorPrompt();
} catch (error: any) {
    console.error(error);
    console.log(`
      Error: Failed to generate template. There are multiple possible reasons for this:\n 
      1. You may have modified the template files or configuration before running the npm install command.
      Please clone the repository again and ensure that you run npm install first.\n
      2. You have run npm install before modifying any files (the correct way). In this case, please contact the 
      react template support for further assistance.`);
}
