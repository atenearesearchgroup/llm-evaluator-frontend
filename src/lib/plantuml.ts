import { deflate } from "@/utils/deflate";


export const generatePlantUMLLink = (content: string) => {
    let transformed = getPlantUML(content);

    const deflatedResult = deflate(transformed, 9)
    deflatedResult
    transformed = unescape(encodeURIComponent(transformed));
    let url = "http://www.plantuml.com/plantuml/uml/" +
        encode64(deflatedResult);

    return url
}


// Define the regular expression for PlantUML content
const PLANTUML_REGEX = /```plantuml([\s\S]*?)\n```/;
const PLANTUML_PATTERN = new RegExp(PLANTUML_REGEX);

/**
 * Get the PlantUML from the content
 *
 * @param {string} content - The content to search for PlantUML
 * @returns {string} - PlantUML diagram content
 * @throws {Error} - If the PlantUML is not found in the content
 */
export function getPlantUML(content: string) {
    let plantUML = getByUmlBracket(content);

    if (!plantUML) {
        plantUML = getByMarkdownRegex(content);
    }

    if (!plantUML) {
        throw new Error("PlantUML not found in content");
    }

    plantUML = plantUML.trim();

    if (plantUML === "") {
        return plantUML;
    }

    let lines = plantUML.split("\n");

    if (lines[0] !== "@startuml") {
        if (lines[0].startsWith("@")) {
            lines[0] = "@startuml";
            plantUML = lines.join("\n");
        } else {
            plantUML = "@startuml\n" + plantUML;
            lines = plantUML.split("\n");
        }
    }

    if (lines[lines.length - 1] !== "@enduml") {
        if (lines[lines.length - 1].startsWith("@")) {
            lines[lines.length - 1] = "@enduml";
            plantUML = lines.join("\n");
        } else {
            plantUML += "\n@enduml";
        }
    }

    return plantUML;
}

/**
 * Get PlantUML content using markdown-style regex
 *
 * @param {string} content - The content to search
 * @returns {string|null} - The extracted PlantUML content or null if not found
 */
function getByMarkdownRegex(content: string) {
    const matcher = PLANTUML_PATTERN.exec(content);
    if (matcher) {
        return matcher[1];
    }
    return null;
}

/**
 * Get PlantUML content using @startuml and @enduml tags
 *
 * @param {string} content - The content to search
 * @returns {string|null} - The extracted PlantUML content or null if not found
 */
function getByUmlBracket(content: string) {
    const start = content.indexOf("@startuml");
    const end = content.indexOf("@enduml");

    if (start === -1 || end === -1) {
        return null;
    }

    return content.substring(start, end + 7);
}


// declare var deflate: any;

function encode64(data: any) {
    let r = "";
    for (let i = 0; i < data.length; i += 3) {
        if (i + 2 == data.length) {
            r += append3bytes(
                data.charCodeAt(i),
                data.charCodeAt(i + 1),
                0,
            );
        } else if (i + 1 == data.length) {
            r += append3bytes(data.charCodeAt(i), 0, 0);
        } else {
            r += append3bytes(
                data.charCodeAt(i),
                data.charCodeAt(i + 1),
                data.charCodeAt(i + 2),
            );
        }
    }
    return r;
}

function append3bytes(b1: any, b2: any, b3: any) {
    let c1 = b1 >> 2;
    let c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    let c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
    let c4 = b3 & 0x3f;
    let r = "";
    r += encode6bit(c1 & 0x3f);
    r += encode6bit(c2 & 0x3f);
    r += encode6bit(c3 & 0x3f);
    r += encode6bit(c4 & 0x3f);
    return r;
}

function encode6bit(b: any) {
    if (b < 10) {
        return String.fromCharCode(48 + b);
    }
    b -= 10;
    if (b < 26) {
        return String.fromCharCode(65 + b);
    }
    b -= 26;
    if (b < 26) {
        return String.fromCharCode(97 + b);
    }
    b -= 26;
    if (b == 0) {
        return "-";
    }
    if (b == 1) {
        return "_";
    }
    return "?";
}
