import { FC, useEffect, useState } from "react";

interface Props {
  targetDate: string; //Target date in string format
}

const Countdown: FC<Props> = ({ targetDate }) => {
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
    <div className="text-orange-background leading-4">
      <span className="mr-1">Sales ends in:</span>
      <div className="inline-block">
        <span className="bg-orange-background text-white min-w-5 p-0 text-center rounded-[1px] inline-block min-h-4">
          {timeLeft.days.toString().padStart(2, "0")}
        </span>
        <span className="mx-1">:</span>
        <span className="bg-orange-background text-white min-w-5 p-0 text-center rounded-[1px] inline-block min-h-4">
          {timeLeft.hours.toString().padStart(2, "0")}
        </span>
        <span className="mx-1">:</span>
        <span className="bg-orange-background text-white min-w-5 p-0 text-center rounded-[1px] inline-block min-h-4">
          {timeLeft.minutes.toString().padStart(2, "0")}
        </span>
        <span className="mx-1">:</span>
        <span className="bg-orange-background text-white min-w-5 p-0 text-center rounded-[1px] inline-block min-h-4">
          {timeLeft.seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

export default Countdown;
