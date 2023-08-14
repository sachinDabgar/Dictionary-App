export interface Phonetic {
    audio: string;
}

export interface Definitions {
    definition: string;
}

export interface Meanings {
    partOfSpeech: string;
    definitions: Definitions[];
}

export interface DataObject {
    word: string;
    definition: string;
    phonetics?: Phonetic[];
    meanings?: Meanings[];
}

export interface ResultProps {
    result: DataObject;
    themeMode: "dark" | "light";
}
