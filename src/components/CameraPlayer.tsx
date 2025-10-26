import ReactPlayer from "react-player";

interface CameraPlayerProps {
  url: string;
  name: string;
  onError?: (error: any) => void;
}

const CameraPlayer = ({ url, name, onError }: CameraPlayerProps) => {
  const Player = ReactPlayer as any;
  
  return (
    <div className="w-full h-full">
      <Player
        url={url}
        playing
        muted
        controls
        width="100%"
        height="100%"
        onError={(e: any) => {
          console.error(`Erro ao carregar stream da câmera ${name}:`, e);
          onError?.(e);
        }}
      />
    </div>
  );
};

export default CameraPlayer;
