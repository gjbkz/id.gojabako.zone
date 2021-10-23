import {Error} from '../es/global';
import {rootDirectoryUrl} from './constants';

export const getPathToAsset = ({pathname}: URL): string => {
    const {pathname: rootDirectoryPathname} = rootDirectoryUrl;
    if (pathname.startsWith(rootDirectoryPathname)) {
        return pathname.slice(rootDirectoryPathname.length);
    }
    throw new Error(`UnexpectedExternalPathname: ${pathname}`);
};
