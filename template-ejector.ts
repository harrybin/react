import fs from 'fs';
import { TEMPLATE_MODE } from './template-generator';
import { exec } from 'child_process';
/**
 * This function performs a cleanup after generating the template.
 * This involves removing any dependencies that will no longer be needed after generating the template.
 *  Additionally, the generator and ejector scripts will also be removed.
 */
export async function ejectGenerator(templateMode: TEMPLATE_MODE) {
    try {
        const packageJsonPath = './package.json';
        const packageJsonContent = await fs.promises.readFile(packageJsonPath, 'utf8');
        const packageJson: Record<string, any> = await JSON.parse(packageJsonContent);

        // Delete scripts/dependencies from package json

        const exampleDevDependencies = ['prompts', '@types/prompts'];

        if (templateMode === TEMPLATE_MODE.Cleared) {
            (await packageJson['scripts']['tye']) && delete packageJson['scripts']['tye'];
        }
        (await packageJson['scripts']['postinstall']) && delete packageJson['scripts']['postinstall'];

        exampleDevDependencies.forEach(async (devDependency) => {
            (await packageJson['devDependencies'][devDependency]) && delete packageJson['scripts'][devDependency];
        });

        // Write the updated package.json filex
        await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

        // delete scripts
        try {
            await fs.promises.unlink('./template-generator.ts');
            await fs.promises.unlink('./template-ejector.ts');
        } catch (error) {
            console.log(
                'Failed to unlink template-generator.ts or template-ejector.ts. This is no big deal. But you may remove those two files yourself.'
            );
        }

        // exec('npm run lint:fix', (err, stdout) => {
        //     if (err) throw new Error(err.message);
        //     console.log(stdout);
        //     console.log(
        //         `Template has been successfully ejected! To complete the setup please follow these steps:
        //     1. Rename the root folder(currently react) to match your project name
        //     2. Run npm install to install packages
        //     3. Commit all changes. Now you are ready to start 🚀`
        //     );
        // });
    } catch (error: any) {
        console.error(`An error occurred while ejecting the template: \n ${error.message} \n
        please try to clone the template again and run the npm install command.
        If it is still not working please the template support`);
    }
}
