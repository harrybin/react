import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';

// function manualChunks(id: string) {
//     if (id.includes('node_modules')) {
//         // if (id.includes('@<companySpecific>')) {
//         //     return 'vendor_myVendorName';
//         // }

//         return 'vendor'; // all other package goes here
//     }
// }

export default defineConfig(({ command, mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    //const env = loadEnv(mode, process.cwd(), '');
    return {
        root: 'src',
        publicDir: '../public',
        base: '/', //command === 'serve' ? '/' : '/app/',
        build: {
            // Relative to the root
            outDir: '../dist',
            rollupOptions: {
                external: ['apiConfig.js'],
                //do not do manual chunking as the patterlib already implements lazy loading
                // output: {
                //     manualChunks: manualChunks,
                // },
                onwarn(warning, defaultHandler) {
                    // ignore for now (until newer vite version), see: https://github.com/vitejs/vite/issues/15012
                    if (warning.code === 'SOURCEMAP_ERROR') {
                        return;
                    }

                    defaultHandler(warning);
                },
            },
            sourcemap: true,
        },
        server: {
            port: 3000,
        },

        // Node.js global to browser globalThis
        define: {
            global: 'globalThis',
            'process.env': process.env,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        plugins: [
            react(),
            tsconfigPaths(),
            nodePolyfills({
                // To exclude specific polyfills, add them to this list.
                exclude: [
                    'fs', // Excludes the polyfill for `fs` and `node:fs`.
                ],
                // Whether to polyfill specific globals.
                globals: {
                    Buffer: true, // can also be 'build', 'dev', or false
                    global: true,
                    process: true,
                },
                // Whether to polyfill `node:` protocol imports.
                protocolImports: true,
            }),
        ],
    };
});
