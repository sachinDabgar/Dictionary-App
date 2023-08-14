import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Results from "../components/Results";

describe("Results Component", () => {
    const mockResult = {
        word: "test",
        definition: "This is a test definition.",
        phonetics: [{ audio: "test-audio.mp3" }],
        meanings: [
            {
                partOfSpeech: "noun",
                definitions: [
                    { definition: "Definition 1" },
                    { definition: "Definition 2" },
                ],
            },
        ],
    };

    it("should open and close the modal when 'More Details' button is clicked", () => {
        render(
            <Results
                result={mockResult}
                themeMode="light"
            />
        );

        // Modal should not be initially visible
        expect(screen.queryByTestId("partofspeech")).toBeNull();

        // Click the 'More Details' button
        const moreDetailsButton = screen.getByText("More Details");
        fireEvent.click(moreDetailsButton);

        // Modal should be visible
        expect(screen.getByTestId("partofspeech")).toBeInTheDocument();
    });
});
