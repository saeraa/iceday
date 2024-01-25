import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import db, { storage } from "@/utils/firebase";
import { ref, uploadBytes } from "firebase/storage";

import { Dayjs } from "dayjs";

interface TeamData {
  name: string;
  abbreviation: string;
  city: string;
  file: File | null;
}

interface GameData {
  homeTeam: string;
  awayTeam: string;
  dateTime: Dayjs;
  league: string;
}

const addGame = async (gameData: GameData) => {
  const result = await addDoc(collection(db, "games"), {
    homeTeam: gameData.homeTeam,
    awayTeam: gameData.awayTeam,
    dateTime: gameData.dateTime.toDate(),
    league: gameData.league,
  });

  return result;
};

const uploadTeamIcon = async (file: File, abbreviation: string) => {
  const storageRef = ref(storage, `teams/${abbreviation}`);

  // 'file' comes from the Blob or File API
  const result = await uploadBytes(storageRef, file);
  const path = result.metadata.fullPath;

  return path;
};

const addTeam = async (teamData: TeamData) => {
  let url = "";
  if (teamData.file != null) {
    url = await uploadTeamIcon(teamData.file, teamData.abbreviation);
  }

  const result = await setDoc(doc(db, "teams", teamData.abbreviation), {
    name: teamData.name,
    abbreviation: teamData.abbreviation,
    city: teamData.city,
    icon: url,
  });

  return result;
};

export { uploadTeamIcon, addTeam, addGame };
