"use client";

import WaveSurfer from "wavesurfer.js";
import { useEffect, useState, useRef, useCallback, memo } from "react";

import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";

//TimeDisplay
const TimeDisplay = ({ currentTime, duration }) => {
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="font-medium text-sm ml-2">
            {formatTime(currentTime)} / {formatTime(duration)}
        </div>
    );
};

// WaveSurfer hook
const useWavesurfer = (containerRef, options) => {
    const [wavesurfer, setWavesurfer] = useState(null)

    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
        if (!containerRef.current) return

        const ws = WaveSurfer.create({
            ...options,
            container: containerRef.current,
        })

        setWavesurfer(ws)

        return () => {
            ws.destroy()
        }
    }, [options, containerRef])

    return wavesurfer
}

const WaveForm = memo((props) => {
    const containerRef = useRef()
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const wavesurfer = useWavesurfer(containerRef, props)
    const [audioDuration, setAudioDuration] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);

    // On play button click
    const onPlayClick = useCallback(() => {
        wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
    }, [wavesurfer])

    // On download button click
    const onDownloadClick = async () => {
        setIsDownloading(true);

        try {
            const response = await fetch(props.url);
            const blob = await response.blob();

            // Create a download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'audio_file.wav'; // You can set the desired filename here
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
        } finally {
            setIsDownloading(false);
        }
    };


    // Initialize wavesurfer
    useEffect(() => {
        if (!wavesurfer) return

        setCurrentTime(0)
        setIsPlaying(false)
        const handleTimeUpdate = (currentTime) => setCurrentTime(currentTime);

        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            // wavesurfer.on('timeupdate', (currentTime) => setCurrentTime(currentTime)),
            wavesurfer.on('timeupdate', handleTimeUpdate),
        ]

        return () => {
            subscriptions.forEach((unsub) => unsub())
        }
    }, [wavesurfer])

    // when waveform is ready
    useEffect(() => {
        const handleWaveformReady = () => {
            const duration = wavesurfer.getDuration();
            setAudioDuration(duration);
        };

        if (wavesurfer) {
            wavesurfer.on('ready', handleWaveformReady);
        }

        return () => {
            if (wavesurfer) {
                wavesurfer.un('ready', handleWaveformReady);
            }
        };
    }, [wavesurfer]);


    return (
        <>
            <div ref={containerRef} style={{ minHeight: '120px' }} />

            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <button onClick={onPlayClick} className='w-16 h-8 mt-2 bg-darker_leaf_green rounded-full flex items-center justify-center hover:bg-leaf_green cursor-pointer'>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button onClick={onDownloadClick} className='w-16 h-8 mt-2 bg-darker_leaf_green rounded-full flex items-center justify-center hover:bg-leaf_green cursor-pointer'>
                        {isDownloading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-darker_leaf_green border-solid"></div>
                        ) : (
                            <IoMdDownload className="text-xl" />
                        )}
                    </button>
                </div>
                <TimeDisplay currentTime={currentTime} duration={audioDuration} />
            </div>
        </>
    )
});

export default WaveForm