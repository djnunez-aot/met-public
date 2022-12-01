import React from 'react';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import { MetWidgetPaper } from 'components/common';
import { DocumentItem } from 'models/document';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import LinkIcon from '@mui/icons-material/Link';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { useAppDispatch } from 'hooks';
import { deleteDocument } from 'services/widgetService/DocumentService.tsx';

const DocumentFile = ({ documentItem }: { documentItem: DocumentItem }) => {
    const dispatch = useAppDispatch();

    const removeFile = (documentId: number, documentName: string) => {
        dispatch(
            openNotificationModal({
                open: true,
                data: {
                    header: `Remove ${documentName}`,
                    subText: [
                        `You will be removing ${documentName} from this engagement.`,
                        'Do you want to remove this widget?',
                    ],
                    handleConfirm: () => {
                        deleteDocument(documentId);
                    },
                },
                type: 'confirm',
            }),
        );
    };

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={2} mb={2}>
            <MetWidgetPaper elevation={1} sx={{ width: '100%' }}>
                <Grid container direction="row" alignItems={'center'} justifyContent="flex-start">
                    <Grid item xs>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <LinkIcon color="info" />
                            <Typography>{documentItem.title}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs container justifyContent={'flex-end'}>
                        <IconButton
                            onClick={() => removeFile(documentItem.id, documentItem.title)}
                            sx={{ padding: 0, margin: 0 }}
                            color="inherit"
                            aria-label="Remove File"
                        >
                            <HighlightOffIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </MetWidgetPaper>
        </Grid>
    );
};

export default DocumentFile;
