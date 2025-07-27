export interface Data {
    questions: Question[];
}

export interface Question {
    question: string;
    answers: string[];
    correct_answer: string;
}

export interface QuizType {
    quiz: Quiz;
}

export interface Quiz {
    candidates: Candidate[];
}

export interface Candidate {
    content: Content;
}

export interface Content {
    parts: Part[];
}

export interface Part {
    text: string
}

export interface MapsData {
    locations: Location[];
}

export interface Location {
    location: string[];
    explanation: string;
    fact: string;
}
