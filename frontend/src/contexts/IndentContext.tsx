import React, { useEffect, useState } from 'react';

export interface ITodo {
  id: number;
  title: string;
  description: string;
  status: boolean;
}
export type IndentContextType = {
  indent: number;
  setIndent: (indent: number) => void;
};

export const IndentContext = React.createContext<IndentContextType | null>(
  null
);

const IndentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [indent, setIndent] = useState<number>(2);

  useEffect(() => {
    const currentIndent = localStorage.getItem('indent');
    if (currentIndent) {
      setIndent(parseInt(currentIndent));
    }
  }, []);

  const changeIndent = (indent: number) => {
    localStorage.setItem('indent', indent.toString());
    setIndent(indent);
  };

  return (
    <IndentContext.Provider value={{ indent, setIndent: changeIndent }}>
      {children}
    </IndentContext.Provider>
  );
};

export default IndentProvider;
