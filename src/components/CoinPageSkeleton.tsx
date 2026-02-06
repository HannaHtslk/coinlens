import { Box, Paper, Stack, Skeleton } from "@mui/material";

export const CoinPageSkeleton = () => {
    return (
        <Paper
            sx={{
                p: 3,
                background:
                    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
                backdropFilter: "blur(8px)",
            }}
        >
            <Stack direction="row" spacing={4}>
                <Box sx={{ flex: "0 0 35%", pr: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                        <Skeleton variant="circular" width={48} height={48} />
                        <Box>
                            <Skeleton variant="text" width={140} height={32} />
                            <Skeleton variant="text" width={60} />
                        </Box>
                    </Stack>

                    <Stack spacing={1.2} mb={4}>
                        <Skeleton variant="text" width="70%" />
                        <Skeleton variant="text" width="85%" />
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton variant="rounded" width={220} height={40} />
                        <Skeleton variant="rounded" width={160} height={40} />
                    </Stack>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={2} mb={2}>
                        <Skeleton variant="rounded" width={48} height={32} />
                        <Skeleton variant="rounded" width={56} height={32} />
                    </Stack>

                    <Skeleton variant="rounded" width="100%" height={320} />
                </Box>
            </Stack>
        </Paper>
    );
};


