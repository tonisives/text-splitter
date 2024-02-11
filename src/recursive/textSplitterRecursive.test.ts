import { describe, expect, test } from "vitest"
import { Document, DocumentWithLoc, RecursiveParamsWithType } from "../types.js"
import fs from "fs"
import { getLengthNoWhitespace } from "../utils.js"
import { recursive } from "../index.js"
import { preSplitSol, splitOnSolComments } from "./sol.js"

describe("sol", () => {
  test("splits full contract", () => {
    const params: RecursiveParamsWithType = {
      chunkSize: 550,
      chunkOverlap: 0,
      type: "sol",
    }
    let text = fs
      .readFileSync("./src/recursive/test/samples/sample.sol")
      .toString()

    const docs = recursive.splitText(text, params)

    printResultToFile("sample.sol", docs, "recursive")

    let fullFile = docs.map((d) => d.pageContent).join("")

    expect(fullFile).toBe(text)

    for (let i = 1; i < docs.length; i++) {
      let prev = docs[i - 1]
      let curr = docs[i]

      expect(prev.metadata.loc.lines.from).toBeLessThanOrEqual(
        curr.metadata.loc.lines.from
      )
    }

    expect(docs.at(-1)?.metadata.loc.lines.to).toBe(text.split("\n").length)
    verifyMiddleChunksWithCorrectLength(docs, 550, 550 * 0.3)
  })

  test("splits long if case", async () => {
    // verify long block is split correctly on separators (`if`) and the original text is preserved 1:1
    const params: RecursiveParamsWithType = {
      chunkSize: 550,
      chunkOverlap: 0,
      type: "sol",
    }
    let text = fs
      .readFileSync("./src/recursive/test/samples/sample-long-if.sol")
      .toString()

    const docs = recursive.splitText(text, params)

    printResultToFile("sample-long-if.sol", docs, "recursive")

    let allLines = ""

    for (let i = 0; i < docs.length; i++) {
      let curr = docs[i]

      if (i > 0) {
        let prev = docs[i - 1]
        expect(prev.metadata.loc.lines.from).toBeLessThanOrEqual(
          curr.metadata.loc.lines.from
        )
      }

      allLines += curr.pageContent
    }

    expect(allLines).toBe(text)

    expect(docs.at(-1)?.metadata.loc.lines.to).toBe(text.split("\n").length)
    verifyMiddleChunksWithCorrectLength(docs, 550, 550 * 0.2)
  })

  test("pre split sol", async () => {
    let text = fs
      .readFileSync("./src/recursive/test/samples/sample.sol")
      .toString()
    let split = preSplitSol(text, 550, 0)
    let joined = split.join("")
    expect(joined).toBe(text)
  })

  test("split on comments", async () => {
    let text = fs
      .readFileSync("./src/recursive/test/samples/sample.sol")
      .toString()
    let split = splitOnSolComments(text)
    let joined = split.map((s) => s.join("")).join("")
    expect(joined).toBe(text)
  })
})

describe("md", () => {
  test("test md", async () => {
    const params: RecursiveParamsWithType = {
      chunkSize: 550,
      chunkOverlap: 0,
      type: "md",
    }

    let text = fs
      .readFileSync("./src/recursive/test/samples/sample.md")
      .toString()
    const docs = recursive.splitText(text, params)
    printResultToFile("sample.md", docs)

    for (let i = 1; i < docs.length; i++) {
      let prev = docs[i - 1]
      let curr = docs[i]

      expect(prev.metadata.loc.lines.from).toBeLessThanOrEqual(
        curr.metadata.loc.lines.from
      )
    }

    expect(docs.at(-1)?.metadata.loc.lines.to).toBe(text.split("\n").length)
  })

  test.only("test md readme", async () => {
    // this one splits until the \n
    const params: RecursiveParamsWithType = {
      chunkSize: 450,
      type: "md",
    }

    let text = fs
      .readFileSync("./src/recursive/test/samples/readme.md")
      .toString()
    const docs = recursive.splitText(text, params)
    printResultToFile("readme.md", docs)

    for (let i = 1; i < docs.length; i++) {
      let prev = docs[i - 1]
      let curr = docs[i]

      expect(prev.metadata.loc.lines.from).toBeLessThanOrEqual(
        curr.metadata.loc.lines.from
      )
    }

    expect(docs.at(-1)?.metadata.loc.lines.to).toBe(text.split("\n").length)
  })

  test("test ethena", async () => {
    // this one splits until the \n
    const params: RecursiveParamsWithType = {
      chunkSize: 450,
      type: "md",
    }

    let text = fs
      .readFileSync("./src/recursive/test/samples/ethena.md")
      .toString()

    const docs = recursive.splitText(text, params)
    printResultToFile("ethena.md", docs)

    for (let i = 1; i < docs.length; i++) {
      let prev = docs[i - 1]
      let curr = docs[i]

      expect(prev.metadata.loc.lines.from).toBeLessThanOrEqual(
        curr.metadata.loc.lines.from
      )
    }

    expect(docs.at(-1)?.metadata.loc.lines.to).toBe(text.split("\n").length)
  })

  test("short lines", async () => {
    // langchain for this one had a bug where result had too small chunks
    const params: RecursiveParamsWithType = {
      chunkSize: 500,
      type: "md",
    }

    let text = fs
      .readFileSync("./src/recursive/test/samples/short-lines.md")
      .toString()

    const docs = recursive.splitText(text, params)
    printResultToFile("short-lines.md", docs)

    for (let i = 1; i < docs.length; i++) {
      let prev = docs[i - 1]
      let curr = docs[i]

      expect(prev.metadata.loc.lines.from).toBeLessThanOrEqual(
        curr.metadata.loc.lines.from
      )
    }

    // we expect all of the docs to have sufficient length, except very small remainder chunks
    let trimmed = docs.reduce((acc, curr) => {
      if (curr.pageContent.trim().length > 10) {
        acc.push(curr)
      }
      return acc
    }, [] as DocumentWithLoc[])

    trimmed.forEach((doc) => {
      expect(doc.pageContent.length).toBeGreaterThanOrEqual(200)
    })
  })
})

const verifyMiddleChunksWithCorrectLength = (
  docs: Document[],
  chunkSize: number,
  deviation = 5
) => {
  // deviation: on character split needs to be precise(5)
  // on new lines, we can expect deviation of ~20% from the target chunk size (not precise to character)

  for (let i = 1; i < docs.length - 1; i++) {
    let curr = docs[i]

    let skipCommentChunks = curr.pageContent.trim().match(/^(\/\*|\/\/\/)/)
    if (skipCommentChunks) continue

    let length = getLengthNoWhitespace(curr.pageContent.split("\n"))
    let distFromSize = Math.abs(length - chunkSize)

    // since we don't match whitespace, then deviation is acceptable
    expect(distFromSize).toBeLessThanOrEqual(deviation)
  }
}

const printResultToFile = (
  fileName: string,
  docs: Document[],
  version: string = "v1"
) => {
  let file = ""
  for (const doc of docs) {
    let metadata = doc.metadata
    let content = doc.pageContent
    file += `${content}\n${JSON.stringify(metadata, null, 2)}\n`
  }

  fs.mkdirSync("./src/recursive/test/results", { recursive: true })
  fs.writeFileSync(
    `./src/recursive/test/results/${fileName.split(".")[0]}-${version}.txt`,
    file
  )
}
