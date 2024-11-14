export function DebugEnv() {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-xs">
      <div>K2 API Key: {process.env.NEXT_PUBLIC_K2_API_KEY ? '✓' : '✗'}</div>
      <div>Claude API Key: {process.env.NEXT_PUBLIC_CLAUDE_API_KEY ? '✓' : '✗'}</div>
    </div>
  );
} 