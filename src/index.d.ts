import 'react';
declare module '*.svg' {
    const content: any;
    export default content;
}

//support generic memo components, https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087
declare module 'react' {
    function forwardRef<T, P = {}>(
        render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
    ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;

    function memo<T extends ComponentType<any>>(
        Component: T,
        propsAreEqual?: (prevProps: Readonly<ComponentProps<T>>, nextProps: Readonly<ComponentProps<T>>) => boolean
    ): T & { displayName?: string };
}


/** 
 * Typescript 'registration' of Buffer polyfill.
 * You also need 'vite-plugin-node-polyfills' properly installed.
 * 
 * usage: 
 *      import { Buffer } from 'buffer/';
 *      console.log(Buffer.from("hash me"));
**/
declare const Buffer;