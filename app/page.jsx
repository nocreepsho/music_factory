'use client';

import { useEffect, useState, useRef } from "react";
import { RiSendPlane2Line } from "react-icons/ri";
import { LuSettings2 } from "react-icons/lu";
import { Transition } from '@headlessui/react'
import '@styles/globals.css'


import WaveForm from "@components/WaveForm";
import Loader from "@components/Loader";


const Home = () => {
  const [prompt, setPrompt] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [audio, setAudio] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [duration, setDuration] = useState(8);

  // Handle prompt input change
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    setButtonDisabled(e.target.value.length === 0);
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setButtonDisabled(true);
    setAudio(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          prompt: prompt,
          duration: duration ? duration : 8
        })
      });

      const data = await response.json();

      setAudio(data);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
      setButtonDisabled(false);
    }

  }

  // Handle duration input change
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setDuration(inputValue);
  };

  const handleLuSettingsClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };


  useEffect(() => {
    const textarea = document.getElementById('home-prompt');
    if (textarea) {
      textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight > 120 ? 120 : this.scrollHeight) + 'px';

        const parentDiv = this.parentElement;
        parentDiv.style.height = 'auto';
        parentDiv.style.height = (this.scrollHeight > 120 ? 120 : this.scrollHeight) + 'px';
      });
    }

  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownRef]);

  // Waveform component entry animation
  useEffect(() => {
    const showWaveform = () => {
      const waveformContainer = document.querySelector('.waveform-container');
      if (waveformContainer) {
        waveformContainer.classList.add('show');
      }
    };
    const timeoutId = setTimeout(showWaveform, 500);

    return () => clearTimeout(timeoutId);
  }, [audio]);

  return (
    <section className="w-full flex flex-col justify-center items-center ">
      <div className="w-full h-[26vh]"></div>
      <h1 className="head_text text-center">
        Music Factory
      </h1>

      <p className="desc text-center font-medium">
        Generate music with text
      </p>

      <div id='prompt-container' className="relative mt-10 z-10 flex items-center justify-center w-full max-w-lg gap-2 px-2 m-auto divide-x shadow-lg divide-zinc-600 min-h-12 bg-zinc-900 rounded-3xl shadow-black/40">
        <div className="flex items-center self-end flex-1 min-w-0">
          <form className="w-full h-full [&amp;_textarea]:pr-11" onSubmit={handleSubmit}>
            <div className="relative w-full flex items-center transition-all duration-300 min-h-full h-fit gap-1" style={{ 'height': '48px' }}>
              <textarea id="home-prompt" maxLength="1000" className="flex-[1_0_50%] min-w-[50%] disabled:opacity-80 text-white bg-transparent border-0 shadow-none resize-none outline-none ring-0 disabled:bg-transparent selection:bg-teal-300 selection:text-black placeholder:text-zinc-400 [scroll-padding-block:0.75rem] pl-3 py-3 sm:min-h-[15px] sm:leading-6 text-base md:text-sm" style={{ 'colorScheme': 'dark', 'height': '48px !important' }} rows="1" placeholder="A groovy disco track" onChange={handlePromptChange}></textarea>

              <div className="relative" ref={dropdownRef}>
                <LuSettings2
                  className="text-xl cursor-pointer text-darker_leaf_green hover:text-leaf_green"
                  onClick={handleLuSettingsClick}
                />
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-darker_leaf_green p-2 rounded-lg font-medium shadow-md transition-[height] duration-500 ease-out ">
                    <label>
                      Duration (seconds):
                      <input
                        type="number"
                        value={duration}
                        onChange={handleInputChange}
                        className="p-1 rounded-md w-36"
                      />
                    </label>
                  </div>
                )}
              </div>

              <button type="submit" id="send-button" className="flex items-center bg-darker_leaf_green hover:bg-leaf_green disabled:bg-gray-600 disabled:opacity-50 outline-none text-gs-background-1000 justify-center w-8 h-8 rounded-full shrink-0" disabled={buttonDisabled}>
                <RiSendPlane2Line className="text-xl" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full mt-16 p-6 m-h-max">

        {submitting && <div className="flex flex-col items-center justify-center">
          <Loader />

          {/* Only for my deployed demo, can remove this warning */}
          <span className="text-lg mt-5 font-normal max-w-[300px]">This project is a demo, and runs on a slow instance. Might take a minute...</span>
        </div>}

        {audio && (
          <div className="waveform-container">
            <WaveForm
              height={100}
              waveColor="brown"
              progressColor="#9EB384"
              url={audio}
              dragToSeek={true}
              barWidth={3}
              barRadius={3}
              // barHeight={10}
              barGap={3}
              cursorWidth={3}
            />
          </div>)}

      </div>
    </section>
  )
}

export default Home