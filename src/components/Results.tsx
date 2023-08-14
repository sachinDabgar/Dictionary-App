import React from "react";
import { Typography, Box, Paper, Modal, Button } from "@mui/material";
import { Definitions, Meanings, Phonetic, ResultProps } from "../types";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: 300,
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    overflowY: "auto",
};

const Results: React.FC<ResultProps> = ({ result, themeMode }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Paper
            key={result.definition}
            elevation={3}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 3,
                border: "1px solid #2196f3",
                borderRadius: 8,
                marginBottom: 3,
                // backgroundColor: "#241e22",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    color: (theme: any) =>
                        themeMode === "dark" ? "#fff" : "#333",
                    marginBottom: 1,
                }}
            >
                {result.word}
            </Typography>
            <Typography
                sx={{
                    color: (theme: any) =>
                        themeMode === "dark" ? "#999" : "#666",
                    fontSize: 16,
                    lineHeight: 1.4,
                    mb: 2,
                }}
            >
                {result.definition}
            </Typography>

            {result.phonetics && (
                <Button
                    variant="contained"
                    sx={{
                        mt: 3,
                    }}
                    onClick={handleOpen}
                >
                    More Details
                </Button>
            )}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    {result.phonetics &&
                        result.phonetics.map(
                            (phonetic: Phonetic, index: number) =>
                                phonetic.audio && (
                                    <audio
                                        key={index}
                                        controls
                                        // sx={{ width: "100%", marginTop: 2 }}
                                    >
                                        <source src={phonetic?.audio}></source>
                                    </audio>
                                )
                        )}
                    {result.meanings &&
                        result.meanings.map(
                            (meaning: Meanings, index: number) => (
                                <Box key={index}>
                                    <hr />
                                    <h4 data-testid="partofspeech">
                                        Part Of Speech :{meaning.partOfSpeech}
                                    </h4>
                                    <h5>Definitions</h5>
                                    {meaning.definitions.map(
                                        (
                                            definition: Definitions,
                                            index: number
                                        ) => (
                                            <p key={index}>
                                                {definition.definition}
                                            </p>
                                        )
                                    )}
                                </Box>
                            )
                        )}
                </Box>
            </Modal>
        </Paper>
    );
};

export default Results;
