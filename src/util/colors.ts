
export function color(string: string, code: string): string {
    return `${code}${string}${codes.reset}`;
}
export function colorBasic(string: string, color: string): string {
    return `${basic[color]}${string}${codes.reset}`;
}
/**
 * Returns a color code from a SGR parameter.
 * @param code The SGR parameter to use. Explanation: https://en.wikipedia.org/wiki/ANSI_escape_code
 */
export function fromSGR(code: number | string): string {
    return `\x1b[${code}m`;
}

/**
 * Generates a color code that changes the font to an alternative font.
 * @param code The code.
 */
export function alternativeFont(code: number): string {
    return fromSGR(10 + code);
}
/**
 * Gets a color code that changes the foreground color of console output to a certain RGB value.
 * @param r The red value of the color.
 * @param g The green value of the color.
 * @param b The blue value of the color.
 */
export function foregroundColor(r: number, g: number, b: number): string {
    return fromSGR(`38;2;${r};${g};${b}`);
}
/**
 * Gets a color code that changes the background color of console output to a certain RGB value.
 * @param r The red value of the color.
 * @param g The green value of the color.
 * @param b The blue value of the color.
 */
export function backgroundColor(r: number, g: number, b: number): string {
    return fromSGR(`48;2;${r};${g};${b}`);
}
/**
 * Gets a color code that changes the underline color of console output to a certain RGB value.
 * @param r The red value of the color.
 * @param g The green value of the color.
 * @param b The blue value of the color.
 */
export function underlineColor(r: number, g: number, b: number): string {
    return fromSGR(`58;2;${r};${g};${b}`);
}

export const codes = {
    /** All attributes off */
    reset: fromSGR(0),
    /** As with faint, the color change is a PC (SCO / CGA) invention. */
    bold: fromSGR(1),
    /** May be implemented as a light font weight like bold. */
    faint: fromSGR(2),
    /** Not widely supported. Sometimes treated as inverse or blink. */
    italic: fromSGR(3),
    /** Style extensions exist for Kitty, VTE, mintty and iTerm2. */
    underline: fromSGR(4),
    /** Sets blinking to less than 150 times per minute. */
    blinkSlow: fromSGR(5),
    /** MS-DOS ANSI.SYS, 150+ per minute; not widely supported */
    blinkFast: fromSGR(6),
    /** Swap foreground and background colors; inconsistent emulation. */
    invert: fromSGR(7),
    /** Not widely supported. */
    conceal: fromSGR(8),
    /** Characters legible but marked as if for deletion. Not supported in Terminal.app. */
    strikethrough: fromSGR(9),
    /** Use the default font. */
    fontDefault: fromSGR(10),
    /** Double-underline per ECMA-48, but instead disables bold intensity on several terminals, including in the Linux kernel's console before version 4.17. */
    underlineDouble: fromSGR(21),
    /** Neither bold nor faint; color changes where intensity is implemented as such. */
    intensityReset: fromSGR(22),
    italicReset: fromSGR(23),
    /** Neither singly nor doubly underlined. */
    underlineReset: fromSGR(24),
    /** Turn blinking off. */
    blinkReset: fromSGR(25),
    /** ITU T.61 and T.416, not known to be used on terminals */
    proportionalSpacing: fromSGR(26),
    invertReset: fromSGR(27),
    /** Not concealed. */
    concealReset: fromSGR(28),
    strikethroughReset: fromSGR(29),
    /** Implementation defined (according to standard). */
    foregroundColorReset: fromSGR(39),
    /** Implementation defined (according to standard). */
    backgroundColorReset: fromSGR(49),
    /** T.61 and T.416. */
    proportionalSpacingReset: fromSGR(50),
    /** Implemented as "emoji variation selector" in mintty. */
    framed: fromSGR(51),
    /** Implemented as "emoji variation selector" in mintty. */
    encircled: fromSGR(52),
    /** Not supported in Terminal.app. */
    overlined: fromSGR(53),
    /** Neither framed or encircled. */
    encircledReset: fromSGR(54),
    overlinedReset: fromSGR(55),
    underlineColorReset: fromSGR(59),
    /** Right side line. Rarely supported. */
    ideogramUnderline: fromSGR(60),
    /** Double right side line. Rarely supported. */
    ideogramUnderlineDouble: fromSGR(61),
    /** Left side line. Rarely supported. */
    ideogramOverline: fromSGR(62),
    /** Double left side line. Rarely supported. */
    ideogramOverlineDouble: fromSGR(63),
    ideogramStressMarking: fromSGR(64),
    ideogramReset: fromSGR(65),
    /** Only implemented in minty. */
    superscript: fromSGR(73),
    /** Only implemented in minty. */
    subscript: fromSGR(74),
    /** Only implemented in minty. */
    superscriptSubscriptReset: fromSGR(75)
};
/**
 * Converts a RGB color to a map of foreground, background, and underline console color codes.
 * @param red The red value of the color.
 * @param green The green value of the color.
 * @param blue The blue value of the color.
 */
export const generateBasic = (red: number, green: number, blue: number) => {
    return { fore: foregroundColor(red, green, blue), back: backgroundColor(red, green, blue), under: underlineColor(red, green, blue) };
};
export const basic: { [key: string]: { fore: string, back: string, under: string } } = {
    red: generateBasic(255, 0, 0),
    blue: generateBasic(0, 255, 0),
    cyan: generateBasic(102, 235, 244),
    white: generateBasic(255, 255, 255),
    black: generateBasic(0, 0, 0),
    green: generateBasic(0, 255, 0),
    yellow: generateBasic(255, 255, 0),
    magenta: generateBasic(255, 0, 255),
    orange: generateBasic(255, 165, 0),
    purple: generateBasic(128, 0, 128),
    brown: generateBasic(165, 42, 42),
    pink: generateBasic(255, 192, 203),
    gray: generateBasic(128, 128, 12)
};
