import type { Metadata } from "next";
import { SCENES, type SceneId } from "@/components/scenes/Scenes";

// Capture source for the use-case images: scripts/scenes.mjs screenshots each at 1200x800 @2x. Not linked, not indexed.
export const metadata: Metadata = { title: "Softstroke scene", robots: { index: false, follow: false } };

export function generateStaticParams() {
  return Object.keys(SCENES).map((id) => ({ id }));
}

export default async function ScenePage({ params }: { params: Promise<{ id: string }> }) {
  const { Scene } = SCENES[(await params).id as SceneId];
  return (
    <div className="fixed left-0 top-0 z-50">
      <Scene />
    </div>
  );
}
