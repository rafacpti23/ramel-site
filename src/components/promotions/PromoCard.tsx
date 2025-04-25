
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromoFeature {
  text: string;
}

interface PromoCardProps {
  icon: LucideIcon;
  title: string;
  price: string;
  period: string;
  features: PromoFeature[];
  buttonText: string;
  buttonVariant?: "default" | "outline";
  onClick: () => void;
}

const PromoCard = ({
  icon: Icon,
  title,
  price,
  period,
  features,
  buttonText,
  buttonVariant = "default",
  onClick
}: PromoCardProps) => {
  return (
    <div className="glass-card p-6 rounded-lg transition-transform hover:-translate-y-1 duration-300">
      <div className="h-14 w-14 flex items-center justify-center rounded-full bg-ramel/20 mb-6">
        <Icon className="h-6 w-6 text-ramel" />
      </div>
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="text-3xl font-bold mb-4">
        {price}<span className="text-sm font-normal text-muted-foreground">{period}</span>
      </div>
      
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        variant={buttonVariant}
        className="w-full"
        onClick={onClick}
      >
        {buttonText}
      </Button>
      
      {period === "/único" && (
        <p className="text-xs text-center mt-4 text-muted-foreground">
          *Oferta por tempo limitado
        </p>
      )}
    </div>
  );
};

export default PromoCard;
