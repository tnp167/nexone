import { FC, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  targetDate: string; //Target date in string format
  homeStyle?: boolean;
}

const Countdown: FC<Props> = ({ targetDate, homeStyle }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetTime = new Date(targetDate).getTime();
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div
      className={cn("text-orange-background leading-4", {
        "text-white": homeStyle,
      })}
    >
      <div
        className={cn("inline-block text-xs", {
          "text-2xl font-bold": homeStyle,
        })}
      >
        <span className="mr-1">Ends in:</span>
        <div className="inline-block">
          <span
            className={cn(
              "bg-orange-background text-white min-w-5 p-0 rounded-[2px] inline-block min-h-4 text-center",
              {
                "p-2 bg-white text-black mr-1": homeStyle,
              }
            )}
          >
            {timeLeft.days.toString().padStart(2, "0")}
          </span>
          <span className="mx-1">:</span>
          <span
            className={cn(
              "bg-orange-background text-white min-w-5 p-0 rounded-[2px] inline-block min-h-4 text-center",
              {
                "p-2 bg-white text-black mr-1": homeStyle,
              }
            )}
          >
            {timeLeft.hours.toString().padStart(2, "0")}
          </span>
          <span className="mx-1">:</span>
          <span
            className={cn(
              "bg-orange-background text-white min-w-5 p-0 rounded-[2px] inline-block min-h-4 text-center",
              {
                "p-2 bg-white text-black mr-1": homeStyle,
              }
            )}
          >
            {timeLeft.minutes.toString().padStart(2, "0")}
          </span>
          <span className="mx-1">:</span>
          <span
            className={cn(
              "bg-orange-background text-white min-w-5 p-0 rounded-[2px] inline-block min-h-4 text-center",
              {
                "p-2 bg-white text-black mr-1": homeStyle,
              }
            )}
          >
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
