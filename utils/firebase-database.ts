import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

import db from "@/utils/firebase";

const storage = getStorage();

interface TeamData {
  name: string;
  abbreviation: string;
  city: string;
  icon: File | null;
}

const uploadTeamIcon = async (file: File, abbreviation: string) => {
  const storageRef = ref(storage, `teams/${abbreviation}`);

  // 'file' comes from the Blob or File API
  const result = await uploadBytes(storageRef, file);
  const path = result.metadata.fullPath;

  return path;
};

const addTeam = async (teamData: TeamData) => {
  let url = "";
  if (teamData.icon != null) {
    url = await uploadTeamIcon(teamData.icon, teamData.abbreviation);
  }

  const result = await setDoc(doc(db, "teams", teamData.abbreviation), {
    name: teamData.name,
    abbreviation: teamData.abbreviation,
    city: teamData.city,
    icon: url,
  });

  return result;
};

export { uploadTeamIcon, addTeam };
