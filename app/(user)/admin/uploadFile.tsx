"use server";

import { join } from "path";

interface FormDataToUpload {
  name: string;
  abbreviation: string;
  city: string;
  file?: File | null;
}

export default async function upload(data: FormData) {
  "use server";

  console.log(data);

  // check if file
  const file: File | null = data.get("file") as unknown as File;
  if (file) {
    // -- upload file
    // -- get file reference

    // add rest of form data
    // return message success or error
    const name = data.get("name")?.toString();
    const abbreviation = data.get("abbreviation")?.toString();
    const city = data.get("city")?.toString();

    if (name && abbreviation && city) {
      const formData: FormDataToUpload = {
        name: name,
        abbreviation: abbreviation,
        city: city,
        file: null,
      };
    } else {
      return;
    }
  }

  // add rest of form data
  // return message success or error

  /*   
    

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const path = join("/", "tmp", file.name);
  // await writeFile(path, buffer);
  console.log(`open ${path} to see the uploaded file`);
 */
  return { success: true };
}
