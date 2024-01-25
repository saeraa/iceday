import {
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import dayjs, { Dayjs } from "dayjs";
import db, { storage } from "@/utils/firebase";
import { ref, uploadBytes } from "firebase/storage";

interface TeamData {
  name: string;
  abbreviation: string;
  city: string;
  file: File | null;
}

class Game {
  constructor(
    readonly homeTeam: string,
    readonly awayTeam: string,
    readonly dateTime: Dayjs,
    readonly league: string
  ) {}
  toString(): string {
    return `${this.homeTeam} vs ${this.awayTeam}`;
  }
}

interface GameDbModel {
  homeTeam: string;
  awayTeam: string;
  dateTime: Timestamp;
  league: string;
}

class GameConverter implements FirestoreDataConverter<Game, GameDbModel> {
  toFirestore(post: WithFieldValue<Game>): WithFieldValue<GameDbModel> {
    return {
      homeTeam: post.homeTeam,
      awayTeam: post.awayTeam,
      //@ts-ignore
      dateTime: this._convertToTimestamp(post.dateTime),
      league: post.league,
    };
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<GameDbModel>,
    options: SnapshotOptions
  ): Game {
    const data = snapshot.data(options);
    const { homeTeam, awayTeam, league, dateTime } = data;
    return new Game(homeTeam, awayTeam, dayjs(dateTime.seconds * 1000), league);
  }

  _convertToTimestamp(dateTime: Dayjs): Timestamp {
    return new Timestamp(Math.floor(dateTime.valueOf() / 1000), 0); // Convert milliseconds to seconds
  }
}

async function gameConversion(db: Firestore): Promise<Game[]> {
  const q = query(collection(db, "games")).withConverter(new GameConverter());
  let gamesArray: Game[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const gameData = doc.data() as Game;

    gamesArray.push(gameData);
  });
  return gamesArray;
}

const getGames = async () => {
  return gameConversion(db);
};

const addGame = async (gameData: Game) => {
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

export { uploadTeamIcon, addTeam, addGame, getGames, Game };
