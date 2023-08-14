import React, { createContext, useState, useEffect } from 'react';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { createDefaultPageInfo, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { User, createDefaultUser } from 'models/user';
import { getUserList } from 'services/userService/api';
import { RootState } from 'store';
import { setTablePagination } from 'services/listingService/listingSlice';
import { useSelector } from 'react-redux';
import { AllModels } from 'services/listingService/types';

export interface UserManagementContextProps {
    usersLoading: boolean;
    pageInfo: PageInfo;
    users: User[];
    paginationOptions: PaginationOptions<User>;
    setPaginationOptions: (value: PaginationOptions<User>) => void;
    addUserModalOpen: boolean;
    setAddUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    assignRoleModalOpen: boolean;
    setassignRoleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    loadUserListing: () => void;
}

export type EngagementParams = {
    engagementId: string;
};

export const UserManagementContext = createContext<UserManagementContextProps>({
    usersLoading: true,
    pageInfo: createDefaultPageInfo(),
    users: [],
    paginationOptions: {
        page: 0,
        size: 0,
    },
    setPaginationOptions: () => {
        throw new Error('Not implemented');
    },
    addUserModalOpen: false,
    setAddUserModalOpen: () => {
        throw new Error('Not implemented');
    },
    assignRoleModalOpen: false,
    setassignRoleModalOpen: () => {
        throw new Error('Not implemented');
    },
    user: createDefaultUser,
    setUser: () => {
        throw new Error('Not implemented');
    },
    loadUserListing: () => {
        throw new Error('Load user listing is not implemented');
    },
});

export const UserManagementContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const dispatch = useAppDispatch();
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User>(createDefaultUser);
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());
    const [usersLoading, setUsersLoading] = useState(true);
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);
    const [assignRoleModalOpen, setassignRoleModalOpen] = useState(false);
    const paginationOptions = useSelector((state: RootState) => state.table.user_management.pagination);

    useEffect(() => {
        loadUserListing();
    }, [paginationOptions]);

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const setPaginationOptions = (paginationOptions: PaginationOptions<User>) => {
        dispatch(
            setTablePagination({
                tableName: 'user_management',
                pagination: paginationOptions as PaginationOptions<AllModels>,
            }),
        );
    };

    const loadUserListing = async () => {
        try {
            setUsersLoading(true);
            const response = await getUserList({
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                include_groups: true,
            });
            setUsers(response.items);
            setPageInfo({
                total: response.total,
            });
            setUsersLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to fetch users, please refresh the page or try again at a later time',
                }),
            );
            setUsersLoading(false);
        }
    };

    return (
        <UserManagementContext.Provider
            value={{
                users,
                pageInfo,
                usersLoading,
                paginationOptions,
                setPaginationOptions,
                addUserModalOpen,
                setAddUserModalOpen,
                assignRoleModalOpen,
                setassignRoleModalOpen,
                user,
                setUser,
                loadUserListing,
            }}
        >
            {children}
        </UserManagementContext.Provider>
    );
};
