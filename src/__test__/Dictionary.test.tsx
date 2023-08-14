import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import Dictionary from "../components/Dictionary";
import axios from "axios";

// Mocking window.matchMedia directly in the test file
Object.defineProperty(window, "matchMedia", {
    value: jest.fn(() => ({
        matches: "dark",
    })),
});

jest.mock("axios"); // Mocking axios to prevent actual API calls

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockWordData = [
    {
        word: "apple",
        definition: "it is a fruit",
    },
];

const mockSearchWordData = [
    {
        word: "banana",
        meanings: [
            {
                partOfSpeech: "noun",
                definitions: [
                    {
                        definition:
                            "A loud burst of voice or voices; a violent and sudden outcry, especially that of a multitude expressing joy, triumph, exultation, anger, or animated courage.",
                        synonyms: [],
                        antonyms: [],
                    },
                    {
                        definition:
                            "A round of drinks in a pub; the turn to pay the shot or scot; an act of paying for a round of drinks.",
                        synonyms: [],
                        antonyms: [],
                    },
                    {
                        definition:
                            "A call-out for an emergency services team.",
                        synonyms: [],
                        antonyms: [],
                    },
                    {
                        definition:
                            "A greeting, name-check or other mention, for example on a radio or TV programme.",
                        synonyms: ["shout out"],
                        antonyms: [],
                        example:
                            "Next up the new single from Beyoncé, but first a shout to Barry Bloggins and his wife Belinda...",
                    },
                ],
                synonyms: ["shout out"],
                antonyms: [],
            },
            {
                partOfSpeech: "verb",
                definitions: [
                    {
                        definition:
                            "To utter a sudden and loud cry, as in joy, triumph, exultation or anger, or to attract attention, to animate others, etc.",
                        synonyms: [],
                        antonyms: [],
                    },
                    {
                        definition:
                            "To utter with a shout; to cry; to shout out",
                        synonyms: [],
                        antonyms: [],
                        example: "They shouted his name to get his attention.",
                    },
                    {
                        definition:
                            "To pay for food, drink or entertainment for others.",
                        synonyms: [],
                        antonyms: [],
                        example:
                            "He′s shouting us all to the opening night of the play.",
                    },
                    {
                        definition:
                            "To post a text message (for example, email) in upper case, regarded as the electronic messaging equivalent of oral shouting.",
                        synonyms: [],
                        antonyms: [],
                        example: "Please don't shout in the chat room.",
                    },
                    {
                        definition: "To treat with shouts or clamor.",
                        synonyms: [],
                        antonyms: [],
                    },
                ],
                synonyms: [],
                antonyms: [],
            },
        ],
        phonetics: [
            {
                audio: "https://api.dictionaryapi.dev/media/pronunciations/en/shout-au.mp3",
            },
            {
                text: "/ʃʌʊt/",
                audio: "",
            },
            {
                audio: "https://api.dictionaryapi.dev/media/pronunciations/en/shout-us.mp3",
            },
        ],
    },
];

test("Should load component correctly", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockWordData });

    await act(async () => {
        render(<Dictionary />);
    });

    const searchBox = screen.getByTestId("textbox");
    const searchBtn = screen.getByTestId("searchBtn");

    expect(searchBox).toBeInTheDocument();
    expect(searchBtn).toBeInTheDocument();
});

test("should send request and fetch random word data when initital application load", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockSearchWordData });

    await act(async () => {
        render(<Dictionary />);
    });

    const searchBox = screen.getByTestId("textbox");

    const searchBtn = screen.getByTestId("searchBtn");

    await act(async () => {
        fireEvent.change(searchBox, { target: { value: "apple" } });
        searchBtn.click();
    });
});

test("should reject the request for random word and show error on the page", async () => {
    mockedAxios.get.mockRejectedValueOnce({
        error: "Error while fetching word data",
    });

    await act(async () => {
        render(<Dictionary />);
    });

    const errorMessage = await screen.findByTestId("errortext");
    expect(errorMessage).toBeInTheDocument();
});

test("shoud reject the request when wrong word searched", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockWordData });

    await act(async () => {
        render(<Dictionary />);
    });

    const searchBox = screen.getByTestId("textbox");

    const searchBtn = screen.getByTestId("searchBtn");

    mockedAxios.get.mockRejectedValue({
        data: {
            error: "Error while fetching searched word.",
        },
    });

    await act(async () => {
        fireEvent.change(searchBox, { target: { value: "sachin" } });
        searchBtn.click();
    });

    await waitFor(() => {
        expect(screen.getByTestId("errortext")).toBeInTheDocument();
    });
});

test("should toggle dark and light mode", async () => {
    await act(async () => {
        render(<Dictionary />);
    });

    const toggleBtn = screen.getByTestId("toggleBtn");

    fireEvent.click(toggleBtn);
});

// Mock the icons
jest.mock("@mui/icons-material/DarkMode", () => {
    return () => <div data-testid="mockDarkModeIcon">Mock Dark Mode Icon</div>;
});

jest.mock("@mui/icons-material/WbSunny", () => {
    return () => <div data-testid="mockWbSunnyIcon">Mock Wb Sunny Icon</div>;
});

test("should toggle theme mode from light to dark", async () => {
    await act(async () => {
        render(<Dictionary />);
    });

    // Initial theme should be light
    const initialThemeBtn = screen.getByTestId("toggleBtn");
    expect(initialThemeBtn).toBeInTheDocument();
    expect(screen.getByTestId("mockWbSunnyIcon")).toBeInTheDocument(); // Mocked light icon

    // Toggle the theme
    fireEvent.click(initialThemeBtn);

    // After toggling, theme should become dark
    const darkThemeBtn = screen.getByTestId("toggleBtn");
    expect(darkThemeBtn).toBeInTheDocument();
    expect(screen.getByTestId("mockDarkModeIcon")).toBeInTheDocument(); // Mocked dark icon
});

test("should toggle theme mode from dark to light", async () => {
    await act(async () => {
        render(<Dictionary />);
    });

    // Initial theme should be light
    const initialThemeBtn = screen.getByTestId("toggleBtn");
    expect(initialThemeBtn).toBeInTheDocument();
    expect(screen.getByTestId("mockWbSunnyIcon")).toBeInTheDocument(); // Mocked light icon

    // Toggle the theme
    fireEvent.click(initialThemeBtn);

    // After toggling, theme should become dark
    const darkThemeBtn = screen.getByTestId("toggleBtn");
    expect(darkThemeBtn).toBeInTheDocument();
    expect(screen.getByTestId("mockDarkModeIcon")).toBeInTheDocument(); // Mocked dark icon

    // Toggle the theme back to light
    fireEvent.click(darkThemeBtn);

    // Theme should be light again
    const lightThemeBtn = screen.getByTestId("toggleBtn");
    expect(lightThemeBtn).toBeInTheDocument();
    expect(screen.getByTestId("mockWbSunnyIcon")).toBeInTheDocument(); // Mocked light icon
});
