import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as widgetService from 'services/widgetService';
import * as documentService from 'services/widgetService/DocumentService.tsx';
import * as notificationSlice from 'services/notificationService/notificationSlice';
import { createDefaultEngagement, Engagement } from 'models/engagement';
import { EngagementStatus } from 'constants/engagementStatus';
import { Widget, WidgetType } from 'models/widget';
import { DocumentItem } from 'models/document';

const engagement: Engagement = {
    ...createDefaultEngagement(),
    id: 1,
    name: 'Test Engagement',
    created_date: '2022-09-14 20:16:29.846877',
    rich_content:
        '{"blocks":[{"key":"29p4m","text":"Test content","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    content: 'Test content',
    rich_description:
        '{"blocks":[{"key":"bqupg","text":"Test description","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    description: 'Test description',
    start_date: '2022-09-01',
    end_date: '2022-09-30',
    engagement_status: {
        id: EngagementStatus.Draft,
        status_name: 'Draft',
    },
};

const mockFile: DocumentItem = {
    id: 1,
    title: 'Test file',
    type: 'file',
    url: 'https://random-s3-url/new-bucket-048a62a2/test.jpg',
};

const mockFolder: DocumentItem = {
    id: 2,
    title: 'Test folder',
    type: 'folder',
    children: [mockFile],
};

const documentWidget: Widget = {
    id: 1,
    widget_type_id: WidgetType.Document,
    engagement_id: 1,
    items: [],
};

jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
}));

const mockWidgetsRtkUnwrap = jest.fn(() => Promise.resolve([documentWidget]));
const mockWidgetsRtkTrigger = () => {
    return {
        unwrap: mockWidgetsRtkUnwrap,
    };
};
export const mockWidgetsRtkQuery = () => [mockWidgetsRtkTrigger];

const mockLazyGetWidgetsQuery = jest.fn(mockWidgetsRtkQuery);
jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useLazyGetWidgetsQuery: () => [...mockLazyGetWidgetsQuery()],
}));

describe('Document widget in engagement page tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    jest.spyOn(notificationSlice, 'openNotification').mockImplementation(jest.fn());
    jest.spyOn(engagementService, 'getEngagement').mockReturnValue(Promise.resolve(engagement));
    jest.spyOn(documentService, 'fetchDocuments').mockReturnValue(Promise.resolve([mockFolder]));
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const postWidgetMock = jest.spyOn(widgetService, 'postWidget').mockReturnValue(Promise.resolve(documentWidget));

    beforeEach(() => {
        setupEnv();
        setupMock();
    });

    function setupMock() {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([]));
        postWidgetMock.mockReturnValue(Promise.resolve(documentWidget));
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([documentWidget]));
    }

    async function openAddWidgetDrawer(container: HTMLElement) {
        await waitFor(() => {
            expect(screen.getByText('Add Widget')).toBeInTheDocument();
        });

        const addWidgetButton = screen.getByText('Add Widget');
        fireEvent.click(addWidgetButton);

        await waitFor(() => {
            expect(screen.getByText('Select Widget')).toBeVisible();
        });
    }

    async function openAddDocumentWidgetDrawer() {
        const documentOption = screen.getByTestId(`widget-drawer-option/${WidgetType.Document}`);
        fireEvent.click(documentOption);

        await waitFor(() => {
            expect(screen.getByText('Test file')).toBeVisible();
            expect(screen.getByText('Test folder')).toBeVisible();
        });
    }

    test('Document widget is created when option is clicked', async () => {
        const { container } = render(<EngagementForm />);

        await openAddWidgetDrawer(container);
        await openAddDocumentWidgetDrawer();

        expect(postWidgetMock).toHaveBeenNthCalledWith(1, engagement.id, {
            widget_type_id: WidgetType.Document,
            engagement_id: engagement.id,
        });
        expect(mockWidgetsRtkUnwrap).toHaveBeenCalledTimes(2);
        expect(screen.getByText('Create Folder')).toBeVisible();
        expect(screen.getByText('Add Document')).toBeVisible();
    });

    test('Creat folder appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([]));
        postWidgetMock.mockReturnValue(Promise.resolve(documentWidget));
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([documentWidget]));
        const { container } = render(<EngagementForm />);

        await openAddWidgetDrawer(container);
        await openAddDocumentWidgetDrawer();

        const createFolderButton = screen.getByText('Create Folder');
        fireEvent.click(createFolderButton);

        await waitFor(() => {
            expect(screen.getByText('Folder name')).toBeVisible();
            expect(screen.getByTestId('create-folder-form/save-button')).toBeVisible();
        });
    });

    test('Creat file appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([]));
        postWidgetMock.mockReturnValue(Promise.resolve(documentWidget));
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([documentWidget]));
        const { container } = render(<EngagementForm />);

        await openAddWidgetDrawer(container);
        await openAddDocumentWidgetDrawer();

        const addDocumentButton = screen.getByText('Add Document');
        fireEvent.click(addDocumentButton);

        await waitFor(() => {
            expect(screen.getByText('Link')).toBeVisible();
            expect(screen.getByText('Name')).toBeVisible();
            expect(screen.getByText('Folder')).toBeVisible();
        });
    });
});
