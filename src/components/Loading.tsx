interface LoadingProps {
  copy?: string;
  error?: Error;
}

export default function Loading({ copy, error }: LoadingProps) {
  return (
    <div className="container">
      <div className="wrapper">
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        <div className="w-full">
          <div className=""></div>
          <div className="flex flex-row justify-center gap-2 mt-3">
  <div className="w-4 h-4 rounded-full bg-gray-400 animate-bounce [animation-delay:.7s]"></div>
  <div className="w-4 h-4 rounded-full bg-violet-800 animate-bounce [animation-delay:.3s]"></div>
  <div className="w-4 h-4 rounded-full bg-gray-400 animate-bounce [animation-delay:.7s]"></div>
</div>
        </div>
      </div>
    </div>
  );
}
