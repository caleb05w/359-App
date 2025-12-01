//Stores our functions for handling firestore data.

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig"

export async function fetchData() {
  try {
    const querySnapshot = await getDocs(collection(db, "fish"));
    const allFish = [];
    //pulls fish from our firestore
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allFish.push({
        id: doc.id, //id, for mapping key
        description: data.description, // description
        name: data.name, // name of fish 
        imageUri: data.imageUri, // image of fish
        response: data.response, //also schema for rendering fish, but from GPT
        schema: data.schema, //fish object for rendering svg of fish
      })
    })
    return allFish;
  }

  catch (e) {
    console.warn("Issue fetching data", e);
    //guardrail to avoid returning null.
    return [];
  }
}

export async function deleteData() {
  try {

    //snapshot of the fish doc, get the current list.
    const snap = await getDocs(collection(db, "fish"));
    //run through snap to delete all items in the saved db.
    const deletions = snap.docs.map((d) =>
      deleteDoc(doc(db, "fish", d.id)) // delete each document
    );

    await Promise.all(deletions); // wait for all deletes
    console.log("All fish deleted");
  } catch (e) {
    console.warn("Error deleting data", e);
  }
}

export async function deleteItem(id) {
  try {
    await deleteDoc(doc(db, "fish", id));
    console.log("deleted", id);
  } catch (e) {
    console.warn("Error deleting data", e);
  }
}
