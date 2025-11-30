//import GPT.. duhh
//for safety reaons, the API key has been deleted. Please refer to our slides and demo to see the app functioning
import OpenAI from "openai";
//formatting helpers. Used documentation from prof to help me build this --> https://platform.openai.com/docs/guides/structured-outputs
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import * as FileSystem from "expo-file-system/legacy";

//because there is a long ass set of instructions, and I dont wanna throw in paragraphs of text here, i stored it on a different file.
import { fishPrompt } from "./fishPrompt";
//same as above, but for image parsing prompts.
import { imgPrompt } from "./imgPrompt";

//create a new openAI object for communication
//very bad practice of keeping my API key in a public file. This will not be pushed to git
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

//defined data structure - matches PixelFish component parameters
const TestFish = z.object({
  pattern: z.enum(["stripes", "dots", "gills", "line"]),
  colorOverlay: z.boolean(),
  color: z.string(), // Color for body overlays (hex)
  mainColor: z.string(), // Color for main body, face, and left square (hex)
  fin: z.enum(["angled", "flat", "fat", "dorsal", "firstDorsal", "anal", "shark", "finlets", "long"]),
  bottomFin: z.enum(["angled", "flat", "fat", "dorsal", "firstDorsal", "anal", "shark", "finlets", "long"]),
  tail: z.enum(["clubbed", "emarginate", "forked", "lunate", "truncate"]),
  size: z.enum(["small", "medium", "long"]), // Controls secondary body width
  secondary: z.string(), // Color for fins and tail (hex)
  tertiary: z.string(), // Color for gills, dots, and stripes (hex)
  snout: z.enum(["overhanging", "slightlyProtruding", "terminal", "extended", "projecting", "blunt"]), // Snout shape
  sideFin: z.boolean(), // Side fin in the middle of body
});

//has to be async function because we are calling something outside
export async function handleResponse(ask) {
  try {
    console.log("calling response");

    //creates an ask to gpt object, which has a few parameters we must fill out.
    //we are using parse because we need to parse an object we ask GPT. Create would be for creating  a
    const response = await openai.responses.parse({
      //specifies which model of GPT to use
      model: "gpt-4o-2024-08-06",
      //our input to GPT
      input: [
        { role: "system", content: fishPrompt },
        {
          role: "user",
          content: ask,
        },
      ],
      //text format apparently tells GPT how to format my response
      text: {
        format: zodTextFormat(TestFish, "event"),
      },
    });
    //GPT outputs alot of different stuff, but we are only interested in the text, so for this case, we need to tell it that specifically
    // console.log(response.output[0].content[0].text);
    // const reply = response.output[0].content[0].text;
    const reply = response.output_parsed;
    console.log(reply);
    return reply;
  } catch (e) {
    //catch statement if we can't call the response
    console.warn("failed to respond", e);
  }
}



//for images
export async function imgResponse(img) {
  //guard
  if (!img) {
    console.warn("no image detected in upload");
    return;
  }
  try {
    //needed GPT help for this. Basically, because img parsing cannot take in photo.uri (which is just a string), we need to save photos to a file system so that it can be formatted in a legible format for GPT.
    //base64 turns any file into a really long text string which can be read by
    const base64 = await FileSystem.readAsStringAsync(img, {
      //make sure use base64 for encoding.
      encoding: "base64",
    });

    // 2. Send directly as data URI
    //this code was referenced from GPT documentation for image parsing: https://platform.openai.com/docs/guides/images-vision?api-mode=responses&lang=javascript
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: imgPrompt },
            {
              type: "input_image",
              //needed gpt to help generate this, but basically turns the base64 string into a legible code.
              image_url: `data:image/jpeg;base64,${base64}`,
            },
          ],
        },
      ],
    });
    const text = response.output?.[0]?.content?.[0]?.text;
    return text;
  } catch (e) {
    console.warn("issue parsing" + e);
  }
}

// for fish description
export async function fishDescription(ask) {
  if (!ask) {
    console.warn("no ask detected");
    return;
  }

  try {

    //left this one in here since its very short 
    const descriptionPrompt = `Provide a brief 1-2 sentence description of the fish species: ${ask}. Include information about its appearance, habitat, or notable characteristics. Be concise and informative.`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: descriptionPrompt,
        },
      ],
    });
    const text = response.output?.[0]?.content?.[0]?.text;
    return text;
  } catch (e) {
    console.warn("issue returning description:" + e);
  }
}



