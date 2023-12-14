# Music Factory: Text to Music 🎵

### Description
Music Factory is a text to music interface that uses Meta's `MusicGen` model to generate music based on text prompts provided by the user.

The application is built using `NextJS` and features a clean UI desgin leveraging `Tailwind CSS`

The model is hosted on demand using Replicate (https://replicate.com/meta/musicgen).

### Installation
- Clone the repo and install dependencies:

  ```
  npm install
  ```

- Place your Replicate API Key in a `.env` file in the project root folder.

  ```
  REPLICATE_API_TOKEN = `Your secret key`
  ```

- Run the project:

  ```
  npm run dev
  ```

### Some Libraries used:
- **Wavesurfer.js:** Wavesurfer is an awesome library to visualize audio as a waveform. (https://wavesurfer.xyz/)
- **Ldrs:** Thanks to @GriffinJohnston for creating that awesome loading animation. There are many other loaders available on his website. (https://uiball.com/ldrs/)

### Challenges Faced
- **Load Time:** Even when the model is deployed on the highest configuration available on Replicate, it does take more than a few seconds to generate the audio.



