import Replicate from "replicate";

export const maxDuration = 60;

export const POST = async (req, res) => {
    const { prompt, duration } = await req.json();

    // MusicGen model by Meta
    const model = "meta/musicgen:7be0f12c54a8d033a0fbd14418c9af98962da9a86f5ff7811f9b3423a1f0b7d7";

    const input = {
        prompt: prompt,
        duration: parseInt(duration, 10),
        temperature: 1,
        model_version: "stereo-large",
        output_format: "wav"
    }

    try {

        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });
    
        const output = await replicate.run(
            model,
            {
                input: input
            }
        );

        return new Response(JSON.stringify(output), {status:200});

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {status:500});
    }
};