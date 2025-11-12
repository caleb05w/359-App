//import GPT.. duhh
import OpenAI from "openai";
//formatting helpers. Used documentation from prof to help me build this --> https://platform.openai.com/docs/guides/structured-outputs
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

//because there is a long ass set of instructions, and I dont wanna throw in paragraphs of text here, i stored it on a different file.
import { fishPrompt } from "./fishPrompt";

//create a new openAI object for communication
//very bad practice of keeping my API key in a public file. This will not be pushed to git
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

//defined data structure
const TestFish = z.object({
  size: z.number(),
  bodyColor: z.string(),
  finColor: z.string(),
  eyeColor: z.string(),
  pattern: z.string(),
  tail: z.string(),
  dorsal: z.string(),
  flip: z.boolean(),
  participants: z.array(z.string()),
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
