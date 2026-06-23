import { createContext, useContext, useEffect, useState } from "react";

const MusicContext = createContext();

const songs = [
    {
        id: 1,
        title: "Blinding Lights",
        artist: "The Weeknd",
        url: "/songs/Blinding Lights - The Weeknd.mp3",
        duration: "3:19",
    },
    {
        id: 2,
        title: "One of the girls",
        artist: "The Weeknd",
        url: "/songs/One of the girls - The Weeknd.mp3",
        duration: "4:04",
    },
    {
        id: 3,
        title: "Popular",
        artist: "The Weeknd",
        url: "/songs/Popular - The Weeknd.mp3",
        duration: "3:50",
    },
    {
        id: 4,
        title: "Save Your Tears",
        artist: "The Weeknd",
        url: "/songs/Save Your Tears - The Weeknd.mp3",
        duration: "3:34",
    },
    {
        id: 5,
        title: "Starboy",
        artist: "The Weeknd",
        url: "/songs/Starboy - The Weeknd.mp3",
        duration: "3:50",
    },
    {
        id: 6,
        title: "The Hills",
        artist: "The Weeknd",
        url: "/songs/The Hills - The Weeknd.mp3",
        duration: "2:29",
    },
    {
        id: 7,
        title: "Timeless",
        artist: "The Weeknd",
        url: "/songs/Timeless - The Weeknd.mp3",
        duration: "4:15",
    },
];

export const MusicProvider = ({ children }) => {
    const [allSongs, setAllSongs] = useState(songs);
    const [currentTrack, setCurrentTrack] = useState(songs[0]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const savedPlaylists = localStorage.getItem("musicPlayerPlaylists");
        if (savedPlaylists) {
            setPlaylists(JSON.parse(savedPlaylists));
        }
    }, []);

    useEffect(() => {
        if (playlists.length > 0) {
            localStorage.setItem("musicPlayerPlaylists", JSON.stringify(playlists));
        } else {
            localStorage.removeItem("musicPlayerPlaylists");
        }
    }, [playlists]);

    const handlePlaySong = (song, index) => {
        setCurrentTrack(song);
        setCurrentTrackIndex(index);
        setIsPlaying(false);
    };

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => {
            const nextIndex = (prev + 1) % allSongs.length;
            setCurrentTrack(allSongs[nextIndex]);
            return nextIndex;
        });
        setIsPlaying(false);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => {
            const nextIndex = prev === 0 ? allSongs.length - 1 : prev - 1;
            setCurrentTrack(allSongs[nextIndex]);
            return nextIndex;
        });
        setIsPlaying(false);
    };

    const formatTime = (time) => {
        if (isNaN(time) || time === undefined) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const createPlaylist = (name) => {
        const newPlaylist = {
            id: Date.now(),
            name,
            songs: [],
        };
        setPlaylists((prev) => [...prev, newPlaylist]);
    };

    const deletePlaylist = (playlistId) => {
        setPlaylists((prev) =>
            prev.filter((playlist) => playlist.id !== playlistId)
        );
    };

    const addSongToPlaylist = (playlistId, song) => {
        setPlaylists((prev) =>
            prev.map((playlist) =>
                playlist.id === playlistId
                    ? { ...playlist, songs: [...playlist.songs, song] }
                    : playlist
            )
        );
    };

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);

    return (
        <MusicContext.Provider
            value={{
                allSongs,
                handlePlaySong,
                currentTrackIndex,
                currentTrack,
                setCurrentTime,
                currentTime,
                formatTime,
                duration,
                setDuration,
                nextTrack,
                prevTrack,
                play,
                pause,
                isPlaying,
                volume,
                setVolume,
                createPlaylist,
                playlists,
                addSongToPlaylist,
                setCurrentTrack,
                deletePlaylist,
            }}
        >
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const contextValue = useContext(MusicContext);
    if (!contextValue) {
        throw new Error("useMusic must be used inside of MusicProvider");
    }
    return contextValue;
};
