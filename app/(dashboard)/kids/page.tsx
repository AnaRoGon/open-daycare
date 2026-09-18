import { KidsClientWrapper } from "@/components/kids/kids-client-wrapper";
import { getChildrenByRoom } from "@/lib/db/children";

export default async function KidsPage() {
  const roomGroups = await getChildrenByRoom();

  return <KidsClientWrapper roomGroups={roomGroups} />;
}
