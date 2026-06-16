type QuestionCounterProps = {
  count: number;
};

function QuestionCounter({ count }: QuestionCounterProps) {
  return (
    <div className="pointer-events-none absolute top-17 right-3 z-65 flex flex-col items-center border border-camel/25 bg-ink/85 px-3 py-2 sm:right-4">
      <span className="font-grotesk text-xl font-bold leading-none text-white">{count}</span>
      <span className="font-grotesk text-[0.58rem] font-bold tracking-[0.06em] text-white/35 uppercase">
        Questions
      </span>
    </div>
  );
}

export default QuestionCounter;
