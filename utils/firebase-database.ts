import db, { auth } from "@/utils/firebase";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();

interface TeamData {
  name: string;
  abbreviation: string;
  city: string;
  icon: File | null;
}

const uploadTeamIcon = async (file: File) => {
  const storageRef = ref(storage, "teams");

  // 'file' comes from the Blob or File API
  const result = await uploadBytes(storageRef, file);
  const path = result.metadata.fullPath;

  return path;
};

const addTeam = (teamData: TeamData) => {
  if (teamData.icon != null) {
    uploadTeamIcon(teamData.icon);
  }

  // then add team data to the db
};

export { uploadTeamIcon, addTeam };
