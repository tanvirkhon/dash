import AIAssistant from "@/components/ai/ai-assistant";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant | AI TradeBot",
  description: "Your intelligent trading companion",
};

export default function AIPage() {
  return <AIAssistant />;
}