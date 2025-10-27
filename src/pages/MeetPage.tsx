import MemberHeader from "@/components/MemberHeader";

const MeetPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <MemberHeader />
      <div className="h-[calc(100vh-64px)]">
        <iframe 
          allow="camera; microphone; fullscreen; display-capture; autoplay" 
          src="https://meet.jit.si/ramel" 
          style={{ height: '100%', width: '100%', border: '0px' }}
          title="Ramel Tecnologia Meet"
        />
      </div>
    </div>
  );
};

export default MeetPage;
