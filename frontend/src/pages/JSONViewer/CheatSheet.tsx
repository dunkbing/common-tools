import sampleJson from './sample.json';
import { BrowserOpenURL } from '$wailsjs/runtime/runtime';

const expressions = [
  { jsonPath: '$', description: 'the root object/element' },
  { jsonPath: '@', description: 'the current object/element' },
  { jsonPath: '. or []', description: 'child operator' },
  {
    jsonPath: '..',
    description: 'recursive descent. JSONPath borrows this syntax from E4X.',
  },
  {
    jsonPath: '*',
    description: 'wildcard. All objects/elements regardless of their names.',
  },
  {
    jsonPath: '[]',
    description:
      'subscript operator. XPath uses it to iterate over element collections and for predicates. In Javascript and JSON, it is the native array operator.',
  },
  {
    jsonPath: '[,]',
    description:
      'Union operator in XPath results in a combination of node sets. JSONPath allows alternate names or array indices as a set.',
  },
  {
    jsonPath: '[start:end:step]',
    description: 'array slice operator borrowed from ES4.',
  },
  { jsonPath: '?()', description: 'applies a filter (script) expression.' },
  {
    jsonPath: '()',
    description: 'script expression, using the underlying script engine.',
  },
];

const examples = [
  {
    jsonPath: '$.store.book[*].author',
    description: 'the authors of all books in the store',
  },
  {
    jsonPath: '$..author',
    description: 'all authors',
  },
  {
    jsonPath: '$.store.*',
    description: 'all things in store, which are some books and a red bicycle',
  },
  {
    jsonPath: '$.store..price',
    description: 'the price of everything in the store.',
  },

  {
    jsonPath: '$..book[2]',
    description: 'the third book',
  },
  {
    jsonPath: `$..book[(@.length-1)]\n$..book[-1:]`,
    description: 'the last book in order.',
  },
  {
    jsonPath: '$..book[0,1]\n$..book[:2]',
    description: 'the first two books',
  },
  {
    jsonPath: '$..book[?(@.isbn)]',
    description: 'filter all books with an ISBN number',
  },
  {
    jsonPath: '$..book[?(@.price<10)]',
    description: 'filter all books cheaper than 10',
  },
  {
    jsonPath: '$..*',
    description: 'everything',
  },
];

const JSONPathCheatSheet = () => {
  return (
    <div className="h-80 text-zinc-100 shadow-lg">
      <h1 className="text-lg font-bold">JSONPath Expressions</h1>
      Reference :{' '}
      <a
        href="https://goessner.net/articles/JsonPath/"
        target="_blank"
        rel="noreferrer"
        className="text-blue-400 underline"
        onClick={() => {
          BrowserOpenURL('https://goessner.net/articles/JsonPath/');
        }}
      >
        https://goessner.net/articles/JsonPath/
      </a>
      <table className="table-auto text-sm mt-2">
        <thead>
          <tr>
            <th className="py-2 px-4 border">JSONPath</th>
            <th className="py-2 px-4 border">Description</th>
          </tr>
        </thead>
        <tbody>
          {expressions.map((row, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border text-center">{row.jsonPath}</td>
              <td className="py-2 px-4 border">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1 className="text-lg font-bold mt-4">JSONPath Examples</h1>
      <pre className="text-xs bg-slate-900 text-slate-200 p-3 rounded-md">
        {JSON.stringify(sampleJson, null, 2)}
      </pre>
      <table className="table-auto text-sm mt-2">
        <thead>
          <tr>
            <th className="py-2 px-4 border">JSONPath</th>
            <th className="py-2 px-4 border">Output</th>
          </tr>
        </thead>
        <tbody>
          {examples.map((row, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border">{row.jsonPath}</td>
              <td className="py-2 px-4 border">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JSONPathCheatSheet;
