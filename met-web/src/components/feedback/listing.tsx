import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import SvgIcon from '@mui/material/SvgIcon';
import { MetPageGridContainer, PrimaryButton } from 'components/common';
import { Feedback } from './Feedback';
import { useAppDispatch } from 'hooks';
import { createDefaultPageInfo, HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { formatDate } from 'components/common/dateHelper';
import { ReactComponent as VeryDissatisfiedIcon } from 'assets/images/emojiVeryDissatisfied.svg';
import { ReactComponent as DissatisfiedIcon } from 'assets/images/emojiDissatisfied.svg';
import { ReactComponent as NeutralIcon } from 'assets/images/emojiNeutral.svg';
import { ReactComponent as SatisfiedIcon } from 'assets/images/emojiSatisfied.svg';
import { ReactComponent as VerySatisfiedIcon } from 'assets/images/emojiVerySatisfied.svg';
import { Link as MuiLink } from '@mui/material';
import Stack from '@mui/material/Stack';
import { openNotification } from 'services/notificationService/notificationSlice';
import MetTable from 'components/common/Table';

const feedbackData = [
    {
        id: 1,
        feedback_id: 1,
        published_date: '',
        feedback_type: 'Issue',
        message: '',
    },
    {
        id: 2,
        feedback_id: 2,
        published_date: '',
        feedback_type: 'Issue',
        message: '',
    },
    {
        id: 3,
        feedback_id: 3,
        published_date: '',
        feedback_type: 'Issue',
        message: '',
    },
    {
        id: 4,
        feedback_id: 4,
        published_date: '',
        feedback_type: 'Issue',
        message: '',
    },
    {
        id: 5,
        feedback_id: 5,
        published_date: '',
        feedback_type: 'Issue',
        message: '',
    },
];

const customRatings: {
    [index: number]: {
        icon: React.ReactElement;
        label: string;
    };
} = {
    5: {
        icon: <SvgIcon fontSize="large" component={VeryDissatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Very Dissatisfied',
    },
    4: {
        icon: <SvgIcon fontSize="large" component={DissatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SvgIcon fontSize="large" component={NeutralIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Neutral',
    },
    2: {
        icon: <SvgIcon fontSize="large" component={SatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Satisfied',
    },
    1: {
        icon: <SvgIcon fontSize="large" component={VerySatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Very Satisfied',
    },
    0: {
        icon: <></>,
        label: '',
    },
};

const FeedbackListing = () => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'name',
        value: '',
    });
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Feedback>>({
        page: 1,
        size: 10,
        sort_key: 'feedback_id',
        nested_sort_key: null,
        sort_order: 'asc',
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());
    const [tableLoading, setTableLoading] = useState(true);
    const dispatch = useAppDispatch();

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    useEffect(() => {
        loadFeedbacks();
    }, [paginationOptions, searchFilter]);

    const loadFeedbacks = async () => {
        try {
            setTableLoading(true);
            setFeedbacks(feedbackData);
            setPageInfo({
                total: feedbackData.length,
            });
            setTableLoading(false);
        } catch (error) {
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to fetch feedbacks, please refresh the page or try again at a later time',
                }),
            );
            setTableLoading(false);
        }
    };

    const headCells: HeadCell<Feedback>[] = [
        {
            key: 'feedback_id',
            numeric: true,
            disablePadding: true,
            label: 'Feedback',
            allowSort: true,
            getValue: (row: Feedback) => customRatings[row.feedback_id].icon,
        },
        {
            key: 'published_date',
            nestedSortKey: '',
            numeric: false,
            disablePadding: false,
            label: 'Date Published',
            allowSort: true,
            getValue: (row: Feedback) => formatDate(row.published_date),
        },
        {
            key: 'feedback_type',
            numeric: false,
            disablePadding: false,
            label: 'Feedback Type',
            allowSort: true,
            getValue: (row: Feedback) => row.feedback_type,
        },
        {
            key: 'message',
            numeric: true,
            disablePadding: false,
            label: 'Message',
            allowSort: true,
            getValue: (row: Feedback) => row.message,
        },
    ];

    return (
        <MetPageGridContainer
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            container
            columnSpacing={2}
            rowSpacing={1}
        >
            <Grid item xs={12} lg={10}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1}
                    width="100%"
                    justifyContent="flex-end"
                    sx={{ p: 2 }}
                >
                    <PrimaryButton component={Link} to="/feedback" data-testid="feedback">
                        View Report
                    </PrimaryButton>
                </Stack>
            </Grid>
            <Grid item xs={12} lg={10}>
                <MetTable
                    headCells={headCells}
                    rows={feedbacks}
                    noRowBorder={true}
                    handleChangePagination={(paginationOptions: PaginationOptions<Feedback>) =>
                        setPaginationOptions(paginationOptions)
                    }
                    paginationOptions={paginationOptions}
                    loading={tableLoading}
                    pageInfo={pageInfo}
                />
            </Grid>
        </MetPageGridContainer>
    );
};

export default FeedbackListing;