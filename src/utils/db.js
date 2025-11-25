'use client';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig"



export async function fetchData() {
  try {
    const querySnapshot = await getDocs(collection(db, "fish"));
    const allFish = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allFish.push({
        id: doc.id,
        description: data.description,
        name: data.name,
        imageUri: data.imageUri,
        response: data.response,
        schema: data.schema,
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
