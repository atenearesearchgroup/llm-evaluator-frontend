

// example: {VALUE} 
const placeholderRegex = /<([a-zA-Z_\s0-9,]+)>/g; 

export const getPlaceholders = (text: string) => {
    const placeholders = []

    let match;
    while ((match = placeholderRegex.exec(text)) !== null) {
        placeholders.push(match[1]);
    }

    return placeholders;
}
