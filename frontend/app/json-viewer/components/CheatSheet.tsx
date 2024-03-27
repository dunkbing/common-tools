import { BrowserOpenURL } from "$wailsjs/runtime/runtime";
import { sampleJSON } from "@/lib/constants";

const expressions = [
  {
    jsonPath: "$",
    description: "the root object/element",
  },
  {
    jsonPath: "@",
    description: "the current object/element",
  },
  {
    jsonPath: ". or []",
    description: "child operator",
  },
  {
    jsonPath: "..",
    description: "recursive descent. JSONPath borrows this syntax from E4X.",
  },
  {
    jsonPath: "*",
    description: "wildcard. All objects/elements regardless of their names.",
  },
  {
    jsonPath: "[]",
    description:
      "subscript operator. XPath uses it to iterate over element collections and for predicates. In Javascript and JSON, it is the native array operator.",
  },
  {
    jsonPath: "[,]",
    description:
      "Union operator in XPath results in a combination of node sets. JSONPath allows alternate names or array indices as a set.",
  },
  {
    jsonPath: "[start:end:step]",
    description: "array slice operator borrowed from ES4.",
  },
  {
    jsonPath: "?()",
    description: "applies a filter (script) expression.",
  },
  {
    jsonPath: "()",
    description: "script expression, using the underlying script engine.",
  },
];

const examples = [
  {
    jsonPath: "$.store.book[*].author",
    description: "the authors of all books in the store",
  },
  {
    jsonPath: "$..author",
    description: "all authors",
  },
  {
    jsonPath: "$.store.*",
    description: "all things in store, which are some books and a red bicycle",
  },
  {
    jsonPath: "$.store..price",
    description: "the price of everything in the store.",
  },

  {
    jsonPath: "$..book[2]",
    description: "the third book",
  },
  {
    jsonPath: "$..book[(@.length-1)]\n$..book[-1:]",
    description: "the last book in order.",
  },
  {
    jsonPath: "$..book[0,1]\n$..book[:2]",
    description: "the first two books",
  },
  {
    jsonPath: "$..book[?(@.isbn)]",
    description: "filter all books with an ISBN number",
  },
  {
    jsonPath: "$..book[?(@.price<10)]",
    description: "filter all books cheaper than 10",
  },
  {
    jsonPath: "$..*",
    description: "everything",
  },
];

const JSONPathCheatSheet = () => {
  return (
    <div className="h-80 text-zinc-100 shadow-lg">
      <h1 className="text-lg font-bold">JSONPath Expressions</h1>
      Reference :{" "}
      <button
        type="button"
        className="text-blue-400 underline"
        onClick={() => {
          BrowserOpenURL("https://goessner.net/articles/JsonPath/");
        }}
      >
        https://goessner.net/articles/JsonPath/
      </button>
      <table className="mt-2 table-auto text-sm">
        <thead>
          <tr>
            <th className="border px-4 py-2">JSONPath</th>
            <th className="border px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {expressions.map((row) => (
            <tr key={row.jsonPath}>
              <td className="border px-4 py-2 text-center">{row.jsonPath}</td>
              <td className="border px-4 py-2">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1 className="mt-4 text-lg font-bold">JSONPath Examples</h1>
      <pre className="rounded-md bg-slate-900 p-3 text-xs text-slate-200">
        {JSON.stringify(sampleJSON, null, 2)}
      </pre>
      <table className="mt-2 table-auto text-sm">
        <thead>
          <tr>
            <th className="border px-4 py-2">JSONPath</th>
            <th className="border px-4 py-2">Output</th>
          </tr>
        </thead>
        <tbody>
          {examples.map((row) => (
            <tr key={row.jsonPath}>
              <td className="border px-4 py-2">{row.jsonPath}</td>
              <td className="border px-4 py-2">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JSONPathCheatSheet;
