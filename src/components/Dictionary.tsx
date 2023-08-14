import React, { useEffect, useState } from "react";
import {
    TextField,
    Typography,
    Box,
    Container,
    Button,
    Paper,
    ThemeProvider,
    createTheme,
    CssBaseline,
} from "@mui/material";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import Results from "../components/Results";
import { DataObject } from "../types";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
// themes
const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const lightTheme = createTheme({
    palette: {
        mode: "light",
    },
});

const Dictionary: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [results, setResults] = useState<DataObject[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [themeMode, setThemeMode] = useState<"dark" | "light">(
        window?.matchMedia("(prefers-color-scheme: dark)")?.matches
            ? "dark"
            : "light"
    );

    const toggleTheme = () => {
        setThemeMode((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
    };

    // method to fetch data for user entered word
    const fetchDataForWord = async () => {
        if (searchTerm.trim() !== "") {
            try {
                const response = await axios.get(
                    `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
                );
                console.log("search word data", response.data);
                const data: any = response?.data[0];
                const dataObject: DataObject = {
                    word: data?.word,
                    definition: data?.meanings[0].definitions[0].definition,
                    phonetics: data?.phonetics,
                    meanings: data?.meanings,
                };
                console.log(dataObject);
                setResults([dataObject]);
            } catch (err) {
                console.log("error while fetching searched word data", err);
                console.log("Error while fetching data for word", searchTerm);
                setError(`Error while fetching details for word ${searchTerm}`);
                setResults([]);
            }
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        setError(null);
        e.preventDefault();
        fetchDataForWord();
    };

    // method which fetch random word whenever app opens up for the first time
    const fetchRandomWord = async () => {
        try {
            const response = await axios.get(
                "https://random-words-api.vercel.app/word/"
            );
            const data = response?.data[0];
            console.log("intial request data", data?.word);
            setResults([{ word: data?.word, definition: data?.definition }]);
        } catch (err) {
            console.log("Error while fetching random word data", err);
            setError("Error while fetching random word data");
        }
    };

    useEffect(() => {
        fetchRandomWord();
    }, []);

    return (
        <ThemeProvider theme={themeMode === "dark" ? darkTheme : lightTheme}>
            <CssBaseline />
            <Container
                maxWidth="md"
                sx={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyItems: "center",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        padding: 4,
                        borderRadius: 8,
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                        textAlign: "center",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h4">Dictionary App</Typography>
                        <Button
                            data-testid="toggleBtn"
                            onClick={toggleTheme}
                        >
                            {themeMode === "dark" ? (
                                <DarkModeIcon />
                            ) : (
                                <WbSunnyIcon />
                            )}
                        </Button>
                    </Box>
                    <form onSubmit={handleSearch}>
                        <Box
                            sx={{
                                mt: 5,
                                height: "50px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 2,
                                gap: 1,
                            }}
                        >
                            <TextField
                                label="Search a word"
                                variant="outlined"
                                size="medium"
                                value={searchTerm}
                                onChange={handleChange}
                                inputProps={{ "data-testid": "textbox" }}
                            />
                            <Button
                                data-testid="searchBtn"
                                type="submit"
                                variant="contained"
                                sx={{
                                    height: "100%",
                                    backgroundColor: "#4caf50",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "#45a049",
                                    },
                                }}
                            >
                                <SearchIcon sx={{ marginRight: 1 }} />
                                Search
                            </Button>
                        </Box>
                    </form>
                    {error && (
                        <Box
                            sx={{
                                backgroundColor: "#ffeeee",
                                border: "1px solid #ff4136",
                                padding: 2,
                                marginBottom: 2,
                                borderRadius: 4,
                            }}
                        >
                            <Typography
                                data-testid="errortext"
                                color="error"
                            >
                                {error}
                            </Typography>
                        </Box>
                    )}
                    {results.length > 0 &&
                        results.map((result: DataObject, index: number) => (
                            <Results
                                key={index}
                                result={result}
                                themeMode={themeMode}
                            />
                        ))}
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default Dictionary;
