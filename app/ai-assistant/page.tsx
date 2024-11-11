import dynamic from 'next/dynamic';

// Dynamically import the AI Assistant component with client-side rendering
const AIAssistant = dynamic(() => import('@/components/ai/ai-assistant'), {
  ssr: false // Disable server-side rendering for this component
});

export default function AIAssistantPage() {
  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
      <AIAssistant />
    </div>
  );
} 