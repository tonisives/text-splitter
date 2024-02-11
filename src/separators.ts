const baseSeparators = [
  // split on \n and keep the \n separator
  /(?<=\n)/,
  /(?<=\s)/,
]

// this does not include the \n. It can be used to join lines later with included \n
const newLineRegex = (regex: string) => {
  return new RegExp(`(?<=\n)(?=(\s+|)${regex})`, "g")
}

export const solSeparators = [
  // Split along compiler informations definitions
  newLineRegex("pragma "),
  newLineRegex("using "),

  // Split along contract definitions
  newLineRegex("contract "),
  newLineRegex("interface "),
  newLineRegex("library "),
  // Split along method definitions
  newLineRegex("constructor "),
  newLineRegex("type "),
  newLineRegex("function "),
  newLineRegex("event "),
  newLineRegex("modifier "),
  newLineRegex("error "),
  newLineRegex("struct "),
  newLineRegex("enum "),
  // Split along control flow statements
  newLineRegex("if "),
  newLineRegex("for "),
  newLineRegex("while "),
  newLineRegex("do "),
  newLineRegex("assembly "),
  // Split by the normal type of lines
  ...baseSeparators,
]

export const mdSeparators = [
  // First, try to split along Markdown headings
  newLineRegex("# "),
  newLineRegex("## "),
  newLineRegex("### "),
  newLineRegex("#### "),
  newLineRegex("##### "),
  newLineRegex("###### "),
  // Note the alternative syntax for headings (below) is not handled here
  // Heading level 2
  // ---------------
  // End of code block
  newLineRegex("```\n\n"),
  // Horizontal lines
  newLineRegex("\\*{3}\n\n"),
  newLineRegex("---\n\n"),
  newLineRegex("___\n\n"),
  // Note that this splitter doesn't handle horizontal lines defined
  // by *three or more* of ***, ---, or ___, but this is not handled
  ...baseSeparators,
]
