import React from 'react';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import { MetWidgetPaper } from 'components/common';
import { DocumentItem } from 'models/document';
import FolderIcon from '@mui/icons-material/Folder';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { When } from 'react-if';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import DocumentSwitch from './DocumentSwitch';
import { useAppDispatch } from 'hooks';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { deleteDocument } from 'services/widgetService/DocumentService.tsx';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType, Widget } from 'models/widget';
import { useContext } from 'react';

const DocumentFolder = ({ documentItem }: { documentItem: DocumentItem }) => {
    const dispatch = useAppDispatch();
    const { widgets } = useContext(WidgetDrawerContext);
    const documentWidget = widgets.find((widget: Widget) => widget.widget_type_id === WidgetType.Document);

    return (
        <Grid item xs={12} container justifyContent={'flex-start'} spacing={2} mb={2}>
            <MetWidgetPaper elevation={2} sx={{ width: '100%' }}>
                <Grid container direction="row" alignItems={'center'} justifyContent="flex-start">
                    <Grid item xs>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <FolderIcon color="info" />
                            <Typography>{documentItem.title}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs container justifyContent={'flex-end'}>
                        <IconButton
                            onClick={() =>
                                dispatch(
                                    openNotificationModal({
                                        open: true,
                                        data: {
                                            header: 'Remove Folder',
                                            subText: [
                                                'You will be removing this folder from the engagement.',
                                                'Do you want to remove this folder?',
                                            ],
                                            handleConfirm: () => {
                                                deleteDocument(documentWidget.id, documentItem.id);
                                            },
                                        },
                                        type: 'confirm',
                                    }),
                                )
                            }
                            sx={{ padding: 0, margin: 0 }}
                            color="inherit"
                            aria-label="Remove Folder"
                        >
                            <HighlightOffIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </MetWidgetPaper>
            <When condition={documentItem.children && documentItem.children.length > 0}>
                <Grid item xs={12} container justifyContent={'flex-end'} spacing={2}>
                    {documentItem.children?.map((item) => {
                        return (
                            <Grid key={`child-document-${item.id}`} item xs={12}>
                                <Stack direction="row" spacing={1} alignItems="flex-start">
                                    <IconButton
                                        sx={{ padding: 0, margin: 0, height: '2em' }}
                                        style={{ color: 'inherit' }}
                                        color="inherit"
                                        aria-label="drag-indicator"
                                        disabled={true}
                                    >
                                        <SubdirectoryArrowRightIcon />
                                    </IconButton>
                                    <DocumentSwitch documentItem={item} />
                                </Stack>
                            </Grid>
                        );
                    })}
                </Grid>
            </When>
        </Grid>
    );
};

export default DocumentFolder;
