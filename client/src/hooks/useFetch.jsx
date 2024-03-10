import { useEffect,useState } from "react";

const API_KEY = import.meta.env.VITE_GIPHY_API;

const useFetch = ({keyword}) => {
    const [gifUrl, setGifUrl] = useState("");

    const fetchGif = async () => {
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword.split(" ").join("")}&limit=1`);
            const data = await response.json();
            setGifUrl(data[0]?.images?.downsized_medium?.url);
        } catch (error) {
            setGifUrl("https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif");
        }
    }
    useEffect(()=>{
        if(keyword){
            fetchGif();
        }
    },[keyword]);

    return gifUrl;
};

export default useFetch;