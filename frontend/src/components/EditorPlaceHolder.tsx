type Props = {
  children: React.ReactNode;
  placeholders: string;
  className?: string;
};

const EditorPlaceHolder = (props: Props) => {
  return (
    <div className={props.className}>
      {props.children}
      <div className="monaco-placeholder">{props.placeholders}</div>
    </div>
  );
};

export default EditorPlaceHolder;
