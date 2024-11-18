import dynamic from 'next/dynamic'

// Dynamically import the analytics dashboard with no SSR
const AnalyticsDashboard = dynamic(
  () => import('@/components/analytics/analytics-dashboard'),
  { ssr: false }
)

export default function AnalyticsPage() {
  return (
    <div className="h-full p-4 space-y-2">
      <AnalyticsDashboard />
    </div>
  );
}