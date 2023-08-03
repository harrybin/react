import { createContext, useContext, ReactNode, useState } from 'react';
import { DataContextType } from '@harrybin/react-common';

export interface UserData {
    Firstname: string;
    Lastname: string;
}

const stateUserDataInitial: UserData = { Firstname: '', Lastname: '' };

export const UserDataContext = createContext<DataContextType<UserData>>([
    stateUserDataInitial,
    undefined,
] as unknown as DataContextType<UserData>);

export function UserDataProvider(props: { children: ReactNode }) {
    //TODO: here set/fetch your user data
    const [data, setData] = useState(stateUserDataInitial);

    return <UserDataContext.Provider value={[data, setData]}>{props.children}</UserDataContext.Provider>;
}

export function useUserData() {
    const [userData, setUserData] = useContext(UserDataContext);
    //compared to the ususal setUserData this function allows to set only partially new values
    function setUserDataEx(data: Partial<UserData>) {
        const newData = { ...userData, ...data };
        setUserData(newData);
    }
    return { userData, setUserData: setUserDataEx };
}
