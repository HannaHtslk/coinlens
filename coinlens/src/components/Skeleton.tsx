import { Skeleton, Stack, TableCell, TableRow } from "@mui/material";

export const SkeletonLoader = () => {
    return (
        <>
            {[...Array(8)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell padding="checkbox">
                        <Skeleton variant="circular" width={20} height={20} />
                    </TableCell>

                    <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Skeleton variant="circular" width={28} height={28} />
                            <Skeleton width={120} />
                        </Stack>
                    </TableCell>

                    <TableCell align="right">
                        <Skeleton width={80} />
                    </TableCell>

                    <TableCell align="right">
                        <Skeleton width={60} />
                    </TableCell>

                    <TableCell align="right">
                        <Skeleton width={90} />
                    </TableCell>

                    <TableCell align="right">
                        <Skeleton width={90} />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
};